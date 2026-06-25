const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const Listing = require("../models/listing.js");
const Booking = require("../models/booking.js");
const Review = require("../models/reviews.js");
const Payment = require("../models/payment.js");

const { isLoggedIn, isAdmin } = require("../middleware.js");
const asyncWrap = require("../utils/wrapasync.js");

// Dashboard / Monitor
const getMonitorData = async () => {
    const userCount = await User.countDocuments({});
    const listingCount = await Listing.countDocuments({});
    const reviewCount = await Review.countDocuments({});
    const bookingCount = await Booking.countDocuments({});

    // Calculate total revenue from completed bookings
    const bookings = await Booking.find({});
    const totalRevenue = bookings.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);

    // Fetch Recent Activity
    const recentBookings = await Booking.find({}).sort({ createdAt: -1 }).limit(5).populate("user").populate("listing");
    const recentReviews = await Review.find({}).sort({ _id: -1 }).limit(5).populate("author");
    const recentUsers = await User.find({}).sort({ _id: -1 }).limit(5);

    // Normalize activities for the feed
    const activities = [
        ...recentBookings.map(b => ({
            type: 'booking',
            user: b.user ? b.user.username : 'Unknown',
            target: b.listing ? b.listing.title : 'Deleted Listing',
            date: b.createdAt || new Date(),
            icon: 'fa-calendar-check',
            color: 'var(--info-500)'
        })),
        ...recentReviews.map(r => ({
            type: 'review',
            user: r.author ? r.author.username : 'Anonymous',
            target: `rated ${r.rating} stars`,
            date: r._id.getTimestamp(),
            icon: 'fa-star',
            color: 'var(--warning-500)'
        })),
        ...recentUsers.map(u => ({
            type: 'user',
            user: u.username,
            target: 'joined Wanderlust',
            date: u._id.getTimestamp(),
            icon: 'fa-user-plus',
            color: 'var(--primary-500)'
        }))
    ].sort((a, b) => b.date - a.date).slice(0, 10);

    return {
        userCount,
        listingCount,
        reviewCount,
        bookingCount,
        totalRevenue,
        activities
    };
};

router.get("/", isLoggedIn, isAdmin, asyncWrap(async (req, res) => {
    const data = await getMonitorData();
    res.render("admin/dashboard.ejs", data);
}));

router.get("/monitor", isLoggedIn, isAdmin, asyncWrap(async (req, res) => {
    const data = await getMonitorData();
    res.render("admin/dashboard.ejs", data);
}));

// Users List
router.get("/users", isLoggedIn, isAdmin, asyncWrap(async (req, res) => {
    const users = await User.find({});
    res.render("admin/users.ejs", { users });
}));

// Delete User
router.post("/users/:id/delete", isLoggedIn, isAdmin, asyncWrap(async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    req.flash("success", "User deleted successfully");
    res.redirect("/admin/users");
}));

// Listings List
router.get("/listings", isLoggedIn, isAdmin, asyncWrap(async (req, res) => {
    const listings = await Listing.find({}).populate("owner");
    res.render("admin/listings.ejs", { listings });
}));

// Delete Listing
router.post("/listings/:id/delete", isLoggedIn, isAdmin, asyncWrap(async (req, res) => {
    await Listing.findByIdAndDelete(req.params.id);
    req.flash("success", "Listing deleted successfully");
    res.redirect("/admin/listings");
}));

// Bookings List
router.get("/bookings", isLoggedIn, isAdmin, asyncWrap(async (req, res) => {
    const bookings = await Booking.find({}).populate("user").populate("listing");
    res.render("admin/bookings.ejs", { bookings });
}));

// Delete Booking
router.post("/bookings/:id/delete", isLoggedIn, isAdmin, asyncWrap(async (req, res) => {
    await Booking.findByIdAndDelete(req.params.id);
    req.flash("success", "Booking deleted successfully");
    res.redirect("/admin/bookings");
}));

// Reviews List
router.get("/reviews", isLoggedIn, isAdmin, asyncWrap(async (req, res) => {
    const reviews = await Review.find({}).populate("author");
    res.render("admin/reviews.ejs", { reviews });
}));

// Delete Review
router.post("/reviews/:id/delete", isLoggedIn, isAdmin, asyncWrap(async (req, res) => {
    await Review.findByIdAndDelete(req.params.id);
    req.flash("success", "Review deleted successfully");
    res.redirect("/admin/reviews");
}));

// Payments List
router.get("/payments", isLoggedIn, isAdmin, asyncWrap(async (req, res) => {
    const payments = await Payment.find({}).populate("user").populate("booking");
    res.render("admin/payments.ejs", { payments });
}));

// Delete Payment record
router.post("/payments/:id/delete", isLoggedIn, isAdmin, asyncWrap(async (req, res) => {
    await Payment.findByIdAndDelete(req.params.id);
    req.flash("success", "Payment record deleted");
    res.redirect("/admin/payments");
}));

module.exports = router;
