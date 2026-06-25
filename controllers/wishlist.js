const User = require("../models/user");
const Listing = require("../models/listing");

module.exports.addToWishlist = async (req, res) => {
    const { listingId } = req.params;
    const listing = await Listing.findById(listingId);

    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    const user = await User.findById(req.user._id);

    // Check for duplicates
    if (user.favorites.includes(listingId)) {
        req.flash("error", "Listing already in wishlist!");
        return res.redirect(`/listings/${listingId}`);
    }

    user.favorites.push(listingId);
    await user.save();

    req.flash("success", "Added to wishlist!");
    res.redirect(`/listings/${listingId}`);
};

module.exports.removeFromWishlist = async (req, res) => {
    const { listingId } = req.params;
    const user = await User.findById(req.user._id);

    await User.findByIdAndUpdate(req.user._id, { $pull: { favorites: listingId } });

    req.flash("success", "Removed from wishlist!");
    // Redirect back to the same page (could be wishlist or listing page)
    res.redirect(req.get('referer') || "/wishlist");
};

module.exports.showWishlist = async (req, res) => {
    const user = await User.findById(req.user._id).populate("favorites");
    res.render("wishlist/index.ejs", { listings: user.favorites });
};
