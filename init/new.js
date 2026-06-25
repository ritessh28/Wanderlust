const mongoose=require("mongoose")
const axios = require("axios");
const Listing=require("../models/listing.js");
const mongourl='mongodb://127.0.0.1:27017/wanderlust'
main().then((res)=>{
    console.log("connected successfulyy")
})
.catch((err)=>{
    console.log(err);
})
async function main() {
  await mongoose.connect(mongourl);
}

async function getCoordinates(location, country) {
  try {
    const response = await axios.get("https://nominatim.openstreetmap.org/search", {
      params: {
        q: `${location}, ${country}`,
        format: "json",
        limit: 1,
      },
      headers: {
        "User-Agent": "WanderlustApp/1.0 (riteshshetty000@gmail.com)" // required by Nominatim
      }
    });

    if (response.data.length > 0) {
      const { lat, lon } = response.data[0];
      return [parseFloat(lat), parseFloat(lon)]; // [latitude, longitude]
    } else {
      console.log(`⚠️ No results found for ${location}, ${country}`);
      return null;
    }
  } catch (error) {
    console.error(`❌ Error fetching coordinates for ${location}, ${country}:`, error.message);
    return null;
  }
}

async function updateAllListings() {
  const listings = await Listing.find({});
  console.log(`🔍 Found ${listings.length} listings.`);

  for (const listing of listings) {
    if (!listing.geometry || !listing.geometry.coordinates || listing.geometry.coordinates.length === 0) {
      console.log(`🌍 Updating coordinates for: ${listing.title}`);

      const coords = await getCoordinates(listing.location, listing.country);
      if (coords) {
        listing.geometry = { type: "Point", coordinates: coords };
        await listing.save();
        console.log(`✅ Updated ${listing.title}: ${coords}`);
      } else {
        console.log(`⚠️ Skipped ${listing.title} — no coordinates found.`);
      }

      await new Promise(res => setTimeout(res, 1000));
    } else {
      console.log(`⏩ Skipping ${listing.title} — already has coordinates.`);
    }
  }

  console.log(" All listings processed!");
  mongoose.connection.close();
}

updateAllListings();