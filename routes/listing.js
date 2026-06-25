const express = require("express");
const router = express.Router();
const asyncwrap = require("../utils/wrapasync.js");
const listing = require("../models/listing.js");
const { validatelisting } = require("../middleware.js");
let { isLoggedIn, isowner } = require("../middleware.js");
const listingcontroller = require("../controllers/listing.js");
const bookingController = require("../controllers/booking.js");
const { storage } = require("../cloudconfig.js");
const multer = require('multer');
const upload = multer({ storage });

router.route("/")
  .get(asyncwrap(listingcontroller.index))
  .post(isLoggedIn,
    upload.array("images"),
    validatelisting,
    asyncwrap(listingcontroller.createlisting));

//new route
router.get('/new', isLoggedIn, listingcontroller.rendernewform);

//search route - MUST be before /:id
router.get("/search", asyncwrap(listingcontroller.search));

// Booking route - MUST be before /:id
router.post("/:id/bookings", isLoggedIn, asyncwrap(bookingController.createBooking));

router.route("/:id")
  .get(asyncwrap(listingcontroller.showlisting))
  .put(isLoggedIn,
    isowner,
    upload.array("images"),
    validatelisting,
    asyncwrap(listingcontroller.updatelisting))
  .delete(isLoggedIn, isowner,
    asyncwrap(listingcontroller.destroylisting));

//edit route
router.get("/:id/edit", isLoggedIn,
  isowner, asyncwrap
  (listingcontroller.rendereditform));

module.exports = router;