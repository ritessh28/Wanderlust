const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    listing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Listing",
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    checkIn: {
        type: Date,
        required: true
    },
    checkOut: {
        type: Date,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true,
        min: 0
    },
    nights: {
        type: Number,
        required: true,
        min: 1
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending"
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending"
    },
    razorpayOrderId: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Validation: checkOut must be after checkIn
bookingSchema.pre("save", function (next) {
    if (this.checkOut <= this.checkIn) {
        return next(new Error("Check-out date must be after check-in date"));
    }
    next();
});

// Index to help with overlap queries and performance
bookingSchema.index({ listing: 1, checkIn: 1, checkOut: 1 });

module.exports = mongoose.model("Booking", bookingSchema);
