const Razorpay = require("razorpay");
const crypto = require("crypto");
const Booking = require("../models/booking.js");
const Payment = require("../models/payment.js");

module.exports.verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            booking_id
        } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        const isSignatureValid = expectedSignature === razorpay_signature;

        if (isSignatureValid) {
            // Payment success
            const booking = await Booking.findById(booking_id).populate("listing");
            if (!booking) {
                req.flash("errormsg", "Booking not found");
                return res.redirect("/listings");
            }

            booking.paymentStatus = "paid";
            await booking.save();

            // Create payment record
            const newPayment = new Payment({
                booking: booking._id,
                user: req.user._id,
                amount: booking.totalPrice,
                status: "completed",
                method: "razorpay",
                transactionId: razorpay_payment_id
            });
            await newPayment.save();

            req.flash("success", "Payment successful! Your booking is confirmed.");
            res.redirect(`/listings/${booking.listing._id}`);
        } else {
            // Internal verification failed
            console.error("Signature verification failed");
            await Booking.findByIdAndUpdate(booking_id, { paymentStatus: "failed" });
            req.flash("errormsg", "Payment verification failed. Please contact support.");
            res.redirect("/listings");
        }
    } catch (err) {
        console.error("Payment verification error:", err);
        req.flash("errormsg", "Something went wrong during payment verification.");
        res.redirect("/listings");
    }
};
