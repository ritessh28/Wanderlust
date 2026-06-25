const express = require("express");
const router = express.Router({ mergeParams: true });
const asyncwrap = require("../utils/wrapasync.js");
const { isLoggedIn } = require("../middleware.js");
const bookingController = require("../controllers/booking.js");

// Host actions: Accept/Reject booking requests
router.post("/:bookingId/accept", isLoggedIn, asyncwrap(bookingController.acceptBooking));
router.post("/:bookingId/reject", isLoggedIn, asyncwrap(bookingController.rejectBooking));

// Guest actions: Checkout/Pay for accepted booking
router.get("/:bookingId/checkout", isLoggedIn, asyncwrap(bookingController.checkoutBooking));

console.log("Booking routes loaded");
module.exports = router;
