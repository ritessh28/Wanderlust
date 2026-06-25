const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/wishlist.js");
const { isLoggedIn } = require("../middleware.js");
const asyncWrap = require("../utils/wrapasync.js");

router.get("/", isLoggedIn, asyncWrap(wishlistController.showWishlist));
router.post("/:listingId", isLoggedIn, asyncWrap(wishlistController.addToWishlist));
router.post("/:listingId/remove", isLoggedIn, asyncWrap(wishlistController.removeFromWishlist));

module.exports = router;
