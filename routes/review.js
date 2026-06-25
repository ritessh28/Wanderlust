const express = require("express");
const router = express.Router({ mergeParams: true });
const { listingschema, reviewschema } = require("../schema.js");
const Listing = require("../models/listing.js");
const asyncwrap = require("../utils/wrapasync.js");
const Review = require("../models/reviews.js")
const Expresserror = require("../utils/Expresserror.js");
const { validatereview, isLoggedIn, isreviewauthor } = require("../middleware.js");
const reviewcontroller = require("../controllers/reviews.js");

//create route
router.post("/", isLoggedIn, validatereview, asyncwrap(reviewcontroller.newreview));

//reviews delete route
router.delete("/:reviewid", isLoggedIn, isreviewauthor, asyncwrap(reviewcontroller.destroyreview));

module.exports = router;