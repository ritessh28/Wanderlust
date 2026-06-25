const mongoose = require("mongoose");
const User = require("./models/user.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to DB");

    // Option A: Create a new admin user (if you want to run this script to make one)
    // Uncomment below to create a fresh admin user
    /*
    const newAdmin = new User({
      email: "admin@wanderlust.com",
      username: "adminUser",
      role: "admin"
    });
    const registeredAdmin = await User.register(newAdmin, "adminpassword");
    console.log("Admin user created:", registeredAdmin);
    */

    // Option B: Update an existing user to be admin
    // Replace with your actual email
    const emailToPromote = "admin@gmail.com";
    const result = await User.updateOne(
        { email: emailToPromote },
        { $set: { role: "admin" } }
    );

    if (result.modifiedCount > 0) {
        console.log(`User with email ${emailToPromote} is now an ADMIN.`);
    } else {
        console.log(`User with email ${emailToPromote} not found or already admin.`);
    }

    mongoose.connection.close();
}

main().catch((err) => {
    console.log(err);
});
