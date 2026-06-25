const mongoose = require("mongoose");

const positiveWords = ["good", "great", "excellent", "amazing", "nice", "clean", "perfect"];
const negativeWords = ["bad", "dirty", "terrible", "worst", "disappointing", "poor"];

const reviewSchema = new mongoose.Schema({
    rating: Number,
    comment: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    sentiment: {
        type: String,
        enum: ["positive", "neutral", "negative"],
    }
});

// Auto sentiment detection
reviewSchema.pre("save", function (next) {
    let sentiment = "neutral";

    // Basic rule based on rating
    if (this.rating >= 4) sentiment = "positive";
    else if (this.rating <= 2) sentiment = "negative";
    else sentiment = "neutral";

    // Keyword analysis (optional)
    const text = this.comment?.toLowerCase() || "";
    let score = 0;

    positiveWords.forEach(word => {
        if (text.includes(word)) score++;
    });

    negativeWords.forEach(word => {
        if (text.includes(word)) score--;
    });

    // Combine rating + keywords
    if (score > 0) sentiment = "positive";
    else if (score < 0) sentiment = "negative";

    this.sentiment = sentiment;
    next();
});

module.exports = mongoose.model("Review", reviewSchema);