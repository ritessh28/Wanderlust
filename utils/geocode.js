const axios = require("axios");

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
      console.log(`⚠️ No coordinates found for ${location}, ${country}`);
      return [0, 0];
    }
  } catch (error) {
    console.error("❌ Geocoding error:", error.message);
    return [0, 0];
  }
}

module.exports = getCoordinates;
