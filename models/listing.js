const mongoose = require("mongoose");
const Review = require("./reviews");
const { ref } = require("joi");
const schema = mongoose.Schema;
const listingschema = new schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  images: [
  {
    url: String,
    filename: String,
  }
 ],
  price: {
    type: Number,
    required: true
  },
  guests: { type: Number, required: true, default: 1 },
  bedrooms: { type: Number, required: true, default: 1 },
  beds: { type: Number, required: true, default: 1 },
  bathrooms: { type: Number, required: true, default: 1 },
  amenities: [String],
  location: String,
  country: String,
  reviews: [{
    type: schema.Types.ObjectId,
    ref: "Review"
  }],
  bookings: [{
    type: schema.Types.ObjectId,
    ref: "Booking"
  }],
  owner: {
    type: schema.Types.ObjectId,
    ref: "User",
  },
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number],
      default: [],
    },
  },
});
const Listing = mongoose.model("Listing", listingschema);
module.exports = Listing;