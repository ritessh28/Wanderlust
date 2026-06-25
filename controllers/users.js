const User = require("../models/user.js");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

module.exports.rendersignupform = (req, res, next) => {
    res.render("./users/signup.ejs");
}

module.exports.signup = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        let newuser = new User({ username, email });
        let registereduser = await User.register(newuser, password);
        console.log(registereduser);
        req.logIn(registereduser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to WanderLust");
            res.redirect("/listings");
        })
    }
    catch (e) {
        req.flash("errormsg", e.message);
        res.redirect("/signup")
    }

}

module.exports.renderloginform = (req, res) => {
    res.render("./users/login.ejs")
};

module.exports.login = async (req, res) => {
    req.flash("success", "welcome back to WanderLust");

    if (req.user.role === "admin") {
        return res.redirect("/admin/monitor");
    }

    let redirecturl = res.locals.redirecturl || "/listings";
    res.redirect(redirecturl);
};

module.exports.logout = (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "logged you out");
        res.redirect("/listings");
    })
};

module.exports.renderForgotPasswordForm = (req, res) => {
    res.render("users/forgot-password");
};

module.exports.sendResetPasswordEmail = async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        req.flash("errormsg", "No account with that email address exists.");
        return res.redirect("/forgot-password");
    }

    const token = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    await user.save();

    const resetUrl = `${req.protocol}://${req.get("host")}/reset-password/${token}`;
    const message = `You are receiving this email because you (or someone else) have requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

    try {
        await sendEmail({
            email: user.email,
            subject: "Password Reset Token",
            message,
            html: `<p>You requested a password reset</p><p>Click this <a href="${resetUrl}">link</a> to reset your password</p>`
        });

        req.flash("success", "Email sent");
        res.redirect("/forgot-password");
    } catch (err) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        req.flash("errormsg", "Email could not be sent");
        return res.redirect("/forgot-password");
    }
};

module.exports.renderResetPasswordForm = async (req, res) => {
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
        req.flash("errormsg", "Password reset token is invalid or has expired.");
        return res.redirect("/forgot-password");
    }

    res.render("users/reset-password", { token: req.params.token });
};

module.exports.resetPassword = async (req, res) => {
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
        req.flash("errormsg", "Password reset token is invalid or has expired.");
        return res.redirect("/forgot-password");
    }

    if (req.body.password !== req.body.confirmPassword) {
        req.flash("errormsg", "Passwords do not match.");
        return res.redirect(`/reset-password/${req.params.token}`);
    }

    await user.setPassword(req.body.password);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    req.login(user, (err) => {
        if (err) {
            req.flash("errormsg", "Error logging in after password reset.");
            return res.redirect("/login");
        }
        req.flash("success", "Password updated successfully! You are now logged in.");
        res.redirect("/listings");
    });
};

module.exports.renderProfilePage = (req, res) => {
    res.render("users/profile");
};

module.exports.updateProfile = async (req, res) => {
    try {
        const { username, email } = req.body;
        const user = await User.findById(req.user._id);

        if (email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                req.flash("errormsg", "Email is already in use.");
                return res.redirect("/profile");
            }
        }

        user.username = username;
        user.email = email;
        await user.save();

        req.flash("success", "Profile updated successfully!");
        res.redirect("/profile");
    } catch (e) {
        req.flash("errormsg", e.message);
        res.redirect("/profile");
    }
};

module.exports.updatePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword, confirmPassword } = req.body;
        const user = await User.findById(req.user._id);

        if (newPassword !== confirmPassword) {
            req.flash("errormsg", "New passwords do not match.");
            return res.redirect("/profile");
        }

        await user.changePassword(oldPassword, newPassword);
        req.flash("success", "Password updated successfully!");
        res.redirect("/profile");
    } catch (e) {
        req.flash("errormsg", "Incorrect current password or other error.");
        res.redirect("/profile");
    }
};