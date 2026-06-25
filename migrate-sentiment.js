// Migration script to add sentiment to existing reviews
// Run this once with: node migrate-sentiment.js

const mongoose = require("mongoose");
const Review = require("./models/reviews.js");

async function migrateSentiment() {
    try {
        // Connect to MongoDB
        await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
        console.log("Connected to MongoDB");

        // Find all reviews without sentiment
        const reviews = await Review.find({ sentiment: { $exists: false } });
        console.log(`Found ${reviews.length} reviews without sentiment`);

        // Update each review
        for (const review of reviews) {
            // Calculate sentiment based on rating
            if (review.rating >= 4) {
                review.sentiment = "positive";
            } else if (review.rating === 3) {
                review.sentiment = "neutral";
            } else {
                review.sentiment = "negative";
            }

            // Optional: Keyword analysis
            if (review.comment) {
                const lowerComment = review.comment.toLowerCase();
                const positiveKeywords = ["good", "great", "excellent", "amazing", "nice", "clean", "perfect"];
                const negativeKeywords = ["bad", "dirty", "terrible", "worst", "disappointing", "poor"];

                let score = 0;
                positiveKeywords.forEach(word => {
                    if (lowerComment.includes(word)) score++;
                });
                negativeKeywords.forEach(word => {
                    if (lowerComment.includes(word)) score--;
                });

                if (review.sentiment === "neutral" && score >= 2) {
                    review.sentiment = "positive";
                } else if (review.sentiment === "neutral" && score <= -2) {
                    review.sentiment = "negative";
                }
            }

            await review.save();
            console.log(`Updated review ${review._id}: ${review.sentiment}`);
        }

        console.log("Migration complete!");
        process.exit(0);
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
}

migrateSentiment();
