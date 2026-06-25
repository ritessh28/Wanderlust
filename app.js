if (process.env.NODE_ENV != "production") {
    require('dotenv').config()
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path")
const mo = require("method-override");
const ejsmate = require("ejs-mate");
const Expresserror = require("./utils/Expresserror.js");
const listingrouter = require("./routes/listing.js");
const reviewrouter = require("./routes/review.js");
const bookingrouter = require("./routes/booking.js");
const userrouter = require("./routes/user.js");
const adminRouter = require("./routes/admin.js");
const wishlistRouter = require("./routes/wishlist.js");
const paymentRouter = require("./routes/payment.js");
const session = require("express-session");
const {MongoStore} = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const Localstrategy = require("passport-local");
const User = require("./models/user.js");
const dburl=process.env.ATLASDB_URL;
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(mo("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));
app.engine('ejs', ejsmate);
main().then((res) => {
    console.log("connected successfulyy")
})
    .catch((err) => {
        console.log(err);
    })
async function main() {
    await mongoose.connect(dburl);
}
const store=MongoStore.create({
    mongoUrl:dburl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,

});
store.on("error",()=>{
    console.log("error in mongo session store",err);
});
const sessionoptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:
    {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};

app.use(session(sessionoptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new Localstrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.errormsg = req.flash("errormsg");
    res.locals.error = req.flash("error"); // Passport uses 'error' key by default
    res.locals.curruser = req.user;
    next();
});

// Debug middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// About Us Page
app.get("/about", (req, res) => {
    res.render("about.ejs");
});

// Routes
app.use("/listings/:id/reviews", reviewrouter);
app.use("/listings", listingrouter);
app.use("/bookings", bookingrouter);
app.use("/admin", adminRouter);
app.use("/wishlist", wishlistRouter);
app.use("/payment", paymentRouter);
app.use("/", userrouter);

app.use((err, req, res, next) => {
    let { statuscode = 500, message = "something went wrong" } = err;
    res.status(statuscode).render("error.ejs", { err });
})

app.listen(4000, () => {
    console.log("listening on port 4000");
})