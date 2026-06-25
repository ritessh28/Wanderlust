const mongoose = require("mongoose");
const schema = mongoose.Schema;
const passportlocalmongoose = require("passport-local-mongoose");

const userschema = new schema({
    email: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    favorites: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Listing"
        }
    ],
    resetPasswordToken: String,
    resetPasswordExpires: Date,
});

userschema.plugin(passportlocalmongoose);
module.exports = mongoose.model("User", userschema);