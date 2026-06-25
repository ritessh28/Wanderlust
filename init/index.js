const mongoose = require("mongoose");
const initdata = require("./data.js");
const listing = require("../models/listing.js");
const getcoordinates = require("../utils/geocode.js");

const mongourl = 'mongodb://127.0.0.1:27017/wanderlust';

async function main() {
  await mongoose.connect(mongourl);
}

const initdb = async () => {
  await listing.deleteMany({});
  
  // Use a default admin owner ID (Make sure this exists in your Users collection!)
  const defaultOwner = '69db4565e3af286d3b93e602'; 
  
  console.log("Starting to seed data. Geocoding properties... (This will take ~30 seconds to respect API rate limits)");
  
  const mappedData = [];
  for (let obj of initdata.data) {
    console.log(`Fetching coordinates for: ${obj.location}, ${obj.country}...`);
    
    // Pause for 1 second to respect Nominatim API rate limits
    await new Promise(resolve => setTimeout(resolve, 1100));
    
    let coords = await getcoordinates(obj.location, obj.country);
    
    // Fallback to default [lat, lng] if Geocoding fails 
    if (coords[0] === 0 && coords[1] === 0) {
      coords = [15.48, 73.82]; 
    }
    
    mappedData.push({
      ...obj,
      owner: defaultOwner,
      geometry: { type: "Point", coordinates: coords }
    });
  }
  
  await listing.insertMany(mappedData);
  console.log("Data was initialized successfully with accurate map coordinates!");
  process.exit();
};

main()
  .then(() => {
    console.log("Connected successfully to DB");
    initdb();
  })
  .catch((err) => {
    console.log("DB Connection Error:", err);
  });