const mongoose = require("mongoose");
const User = require("./models/user.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to DB");

    // Update all users who do not have a role field
    const result = await User.updateMany(
        { role: { $exists: false } },
        { $set: { role: "user" } }
    );

    console.log(`Matched ${result.matchedCount} users.`);
    console.log(`Modified ${result.modifiedCount} users.`);

    mongoose.connection.close();
}

main().catch((err) => {
    console.log(err);
});
