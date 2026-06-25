const listing = require("./models/listing.js")
const review = require("./models/reviews.js")
const Expresserror = require("./utils/Expresserror.js");
const { listingschema, reviewschema } = require("./schema.js");
module.exports.isLoggedIn = ((req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirecturl = req.originalUrl;
    req.flash("errormsg", "user must be logged in to add listing");
    return res.redirect("/login");
  }
  next();

})
module.exports.saveredirecturl = ((req, res, next) => {
  if (req.session.redirecturl) {
    res.locals.redirecturl = req.session.redirecturl;
  }
  next();
})
module.exports.isowner = (async (req, res, next) => {
  let { id } = req.params;
  let Listing = await listing.findById(id);
  if (!Listing.owner._id.equals(res.locals.curruser._id)) {
    req.flash("errormsg", "you are not the owner of this listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
})
module.exports.validatelisting = (req, res, next) => {
  // Temporarily remove deleteImages from validation body
  const { deleteImages, ...bodyToValidate } = req.body;
  
  const { error } = listingschema.validate(bodyToValidate);
  console.log(error);
  if (error) {
    throw new Expresserror(400, error);
  }
  
  // Restore deleteImages after validation
  if (deleteImages) {
    req.body.deleteImages = deleteImages;
  }
  
  next();
}
module.exports.validatereview = (req, res, next) => {
  const { error } = reviewschema.validate(req.body);
  console.log(error);
  if (error) {
    throw new Expresserror(400, error);
  }
  else {
    next();
  }
}
module.exports.isreviewauthor = (async (req, res, next) => {
  let { id, reviewid } = req.params;
  let Review = await review.findById(reviewid);
  if (!Review.author.equals(res.locals.curruser._id)) {
    req.flash("errormsg", "you are not the author of this Review");
    return res.redirect(`/listings/${id}`);
  }
  next();
})

module.exports.isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === "admin") {
    return next();
  }
  req.flash("errormsg", "Access denied. Admins only.");
  res.redirect("/login");
};
