const Booking = require("../models/booking.js");
const Listing = require("../models/listing.js");
const Razorpay = require("razorpay");

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder",
    key_secret: process.env.RAZORPAY_KEY_SECRET || "razorpay_secret_placeholder",
});

module.exports.createBooking = async (req, res) => {
    console.log("=== BOOKING CONTROLLER CALLED ===");
    try {
        const { id } = req.params;
        const { checkIn, checkOut } = req.body;

        // Find the listing
        const listing = await Listing.findById(id);
        if (!listing) {
            req.flash("errormsg", "Listing not found");
            return res.redirect("/listings");
        }

        // Prevent users from booking their own listings
        if (listing.owner.equals(req.user._id)) {
            req.flash("errormsg", "You cannot book your own listing");
            return res.redirect(`/listings/${id}`);
        }

        // Validate dates
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (checkInDate < today) {
            req.flash("errormsg", "Check-in date must be today or in the future");
            return res.redirect(`/listings/${id}`);
        }

        if (checkOutDate <= checkInDate) {
            req.flash("errormsg", "Check-out date must be after check-in date");
            return res.redirect(`/listings/${id}`);
        }

        // Check for overlapping bookings (only confirmed/paid ones)
        const overlappingBooking = await Booking.findOne({
            listing: id,
            paymentStatus: "paid",
            $or: [
                { checkIn: { $lte: checkInDate }, checkOut: { $gt: checkInDate } },
                { checkIn: { $lt: checkOutDate }, checkOut: { $gte: checkOutDate } },
                { checkIn: { $gte: checkInDate }, checkOut: { $lte: checkOutDate } }
            ]
        });

        if (overlappingBooking) {
            req.flash("errormsg", "These dates are already booked. Please choose different dates.");
            return res.redirect(`/listings/${id}`);
        }

        // Calculate total price
        const days = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
        const basePrice = days * listing.price;
        const cleaningFee = 500;
        const serviceFee = Math.round(basePrice * 0.12);
        const totalPrice = basePrice + cleaningFee + serviceFee;

        // Create booking with status pending
        const newBooking = new Booking({
            listing: id,
            user: req.user._id,
            checkIn: checkInDate,
            checkOut: checkOutDate,
            totalPrice: totalPrice,
            nights: days,
            status: "pending",
            paymentStatus: "pending"
        });

        await newBooking.save();

        // Add booking to listing
        listing.bookings.push(newBooking._id);
        await listing.save();

        req.flash("success", "Booking request submitted successfully! Waiting for host verification.");
        res.redirect("/bookings");

    } catch (err) {
        console.error("DETAILED BOOKING ERROR:", err);
        req.flash("errormsg", `Booking error: ${err.message || "Something went wrong"}. Please try again.`);
        res.redirect(`/listings/${req.params.id}`);
    }
};

module.exports.renderHostBookings = async (req, res) => {
    try {
        const listings = await Listing.find({ owner: req.user._id });
        const listingIds = listings.map(l => l._id);
        const bookings = await Booking.find({ listing: { $in: listingIds } })
            .populate('user')
            .populate('listing')
            .sort({ createdAt: -1 }); // Newest requests first

        res.render("users/bookings", { bookings, viewType: 'host' });
    } catch (err) {
        console.error("Error fetching host bookings:", err);
        req.flash("errormsg", "Could not fetch bookings");
        res.redirect("/listings");
    }
};

module.exports.renderUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id })
            .populate('listing')
            .populate('user')
            .sort({ createdAt: -1 }); // Newest bookings first

        res.render("users/bookings", { bookings, viewType: 'guest' });
    } catch (err) {
        console.error("Error fetching user bookings:", err);
        req.flash("errormsg", "Could not fetch your bookings. " + err.message);
        res.redirect("/listings");
    }
};

module.exports.acceptBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const booking = await Booking.findById(bookingId).populate("listing");
        if (!booking) {
            req.flash("errormsg", "Booking not found");
            return res.redirect("/host/bookings");
        }
        if (!booking.listing.owner.equals(req.user._id)) {
            req.flash("errormsg", "Unauthorized access");
            return res.redirect("/host/bookings");
        }
        if (booking.status !== "pending") {
            req.flash("errormsg", "Booking request is already processed.");
            return res.redirect("/host/bookings");
        }

        // Check for any paid overlapping bookings first
        const overlappingBooking = await Booking.findOne({
            _id: { $ne: booking._id },
            listing: booking.listing._id,
            paymentStatus: "paid",
            $or: [
                { checkIn: { $lte: booking.checkIn }, checkOut: { $gt: booking.checkIn } },
                { checkIn: { $lt: booking.checkOut }, checkOut: { $gte: booking.checkOut } },
                { checkIn: { $gte: booking.checkIn }, checkOut: { $lte: booking.checkOut } }
            ]
        });

        if (overlappingBooking) {
            req.flash("errormsg", "Cannot accept. This listing has an overlapping paid booking for these dates.");
            return res.redirect("/host/bookings");
        }

        booking.status = "accepted";
        await booking.save();
        req.flash("success", "Booking accepted successfully! The guest has been notified to make payment.");
        res.redirect("/host/bookings");
    } catch (err) {
        console.error("Accept booking error:", err);
        req.flash("errormsg", "Error accepting booking");
        res.redirect("/host/bookings");
    }
};

module.exports.rejectBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const booking = await Booking.findById(bookingId).populate("listing");
        if (!booking) {
            req.flash("errormsg", "Booking not found");
            return res.redirect("/host/bookings");
        }
        if (!booking.listing.owner.equals(req.user._id)) {
            req.flash("errormsg", "Unauthorized access");
            return res.redirect("/host/bookings");
        }
        if (booking.status !== "pending") {
            req.flash("errormsg", "Booking request is already processed.");
            return res.redirect("/host/bookings");
        }

        booking.status = "rejected";
        await booking.save();
        req.flash("success", "Booking request rejected.");
        res.redirect("/host/bookings");
    } catch (err) {
        console.error("Reject booking error:", err);
        req.flash("errormsg", "Error rejecting booking");
        res.redirect("/host/bookings");
    }
};

module.exports.checkoutBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const booking = await Booking.findById(bookingId).populate("listing");
        if (!booking) {
            req.flash("errormsg", "Booking not found");
            return res.redirect("/bookings");
        }
        if (!booking.user.equals(req.user._id)) {
            req.flash("errormsg", "Access denied");
            return res.redirect("/bookings");
        }
        if (booking.status !== "accepted") {
            req.flash("errormsg", "Booking must be accepted by the host before payment.");
            return res.redirect("/bookings");
        }
        if (booking.paymentStatus === "paid") {
            req.flash("errormsg", "This booking is already paid.");
            return res.redirect("/bookings");
        }

        // Create Razorpay Order
        const options = {
            amount: booking.totalPrice * 100, // Amount in paise
            currency: "INR",
            receipt: `receipt_${booking._id}`
        };

        const order = await razorpay.orders.create(options);
        booking.razorpayOrderId = order.id;
        await booking.save();

        res.render("bookings/checkout", {
            order,
            listing: booking.listing,
            booking,
            key_id: process.env.RAZORPAY_KEY_ID
        });
    } catch (err) {
        console.error("Checkout error:", err);
        req.flash("errormsg", "Error initiating payment: " + err.message);
        res.redirect("/bookings");
    }
};
