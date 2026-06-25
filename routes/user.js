const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const asyncwrap = require("../utils/wrapasync.js");
const passport = require("passport");
const { saveredirecturl, isLoggedIn } = require("../middleware.js")
const usercontroller = require("../controllers/users.js");

router.route("/signup")
    .get(usercontroller.rendersignupform)
    .post(asyncwrap(usercontroller.signup));

router.route("/login")
    .get(usercontroller.renderloginform)
    .post(saveredirecturl,
        passport.authenticate("local",
            {
                failureRedirect: "/login",
                failureFlash: "Wrong password or username. Please try again or use 'Forgot password' to reset."
            }),
        usercontroller.login
    );
//logout
router.get("/logout", usercontroller.logout);

router.route("/forgot-password")
    .get(usercontroller.renderForgotPasswordForm)
    .post(asyncwrap(usercontroller.sendResetPasswordEmail));

router.route("/reset-password/:token")
    .get(asyncwrap(usercontroller.renderResetPasswordForm))
    .post(asyncwrap(usercontroller.resetPassword));

router.get("/profile", isLoggedIn, usercontroller.renderProfilePage);
router.put("/profile", isLoggedIn, asyncwrap(usercontroller.updateProfile));
router.put("/profile/password", isLoggedIn, asyncwrap(usercontroller.updatePassword));

const bookingController = require("../controllers/booking.js");
router.get("/bookings", isLoggedIn, asyncwrap(bookingController.renderUserBookings));
router.get("/host/bookings", isLoggedIn, asyncwrap(bookingController.renderHostBookings));

const listingController = require("../controllers/listing.js");
router.get("/host/dashboard", isLoggedIn, asyncwrap(listingController.renderHostDashboard));

// About Us page
router.get("/about", (req, res) => {
    res.render("about.ejs");
});

module.exports = router;