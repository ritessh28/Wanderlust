const listing = require("../models/listing.js");
const Review = require("../models/reviews.js");
const Booking = require("../models/booking.js");
const getcoordinates = require("../utils/geocode.js");
const { cloudinary } = require("../cloudconfig.js");

module.exports.index = async (req, res) => {
  let alllistings = await listing.find({});
  res.render("./listings/index.ejs", { alllistings });
}

module.exports.search = async (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.redirect("/listings");
  }

  let searchQuery = {
    $or: [
      { title: { $regex: q, $options: "i" } },
      { location: { $regex: q, $options: "i" } },
      { country: { $regex: q, $options: "i" } },
      { description: { $regex: q, $options: "i" } }
    ]
  };

  // If the query is a number, search strictly by exact price
  const numericPrice = Number(q);
  if (!isNaN(numericPrice) && q.trim() !== "") {
    searchQuery = { price: numericPrice };
  }

  const alllistings = await listing.find(searchQuery);
  if (alllistings.length === 0) {
    req.flash("errormsg", "No listings found matching '" + q + "'");
    return res.redirect("/listings");
  }
  res.render("./listings/index.ejs", { alllistings });
}

module.exports.rendernewform = (req, res) => {
  res.render("./listings/new.ejs");
}

module.exports.showlisting = async (req, res) => {
  let { id } = req.params;
  console.log(id);
  let list = await listing.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author" }
    })
    .populate({
      path: "bookings",
      populate: { path: "user" }
    })
    .populate("owner");
  if (!list) {
    req.flash("errormsg", "Listing you requested does not exist");
    return res.redirect("/listings");
  }
  
  // Create an array of booked date ranges for the calendar
  const bookedRanges = list.bookings.map(booking => ({
    from: booking.checkIn,
    to: booking.checkOut
  }));

  // Calculate average rating
  let avgRating = 0;
  if (list.reviews && list.reviews.length > 0) {
    const sum = list.reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
    avgRating = sum / list.reviews.length;
  }
  res.render("./listings/show.ejs", { list, avgRating, bookedRanges });
}

module.exports.renderHostDashboard = async (req, res) => {
  const listings = await listing.find({ owner: req.user._id })
    .populate("bookings")
    .populate({
      path: "reviews",
      populate: { path: "author" }
    });

  // Calculate stats for each listing
  listings.forEach(list => {
    list.listingEarnings = list.bookings
      .filter(b => b.paymentStatus === "paid")
      .reduce((acc, b) => acc + b.totalPrice, 0);
    list.confirmedBookings = list.bookings.filter(b => b.paymentStatus === "paid").length;
  });
  
  const listingIds = listings.map(l => l._id);
  const allBookings = await Booking.find({ listing: { $in: listingIds } })
    .populate("user")
    .populate("listing")
    .sort({ createdAt: -1 });

  // Dashboard Stats
  const totalEarnings = allBookings.reduce((acc, b) => acc + b.totalPrice, 0);
  const activeListings = listings.length;
  const totalBookings = allBookings.length;
  
  // Recent 5 bookings
  const recentBookings = allBookings.slice(0, 5);

  // Collect All Reviews
  let allReviews = [];
  listings.forEach(list => {
    if (list.reviews && list.reviews.length > 0) {
      list.reviews.forEach(review => {
        allReviews.push({
          review: review,
          listingTitle: list.title
        });
      });
    }
  });

  // Sort reviews by _id (which intrinsically contains a timestamp) descending
  allReviews.sort((a, b) => b.review._id.toString().localeCompare(a.review._id.toString()));
  const recentReviews = allReviews.slice(0, 5);

  let totalRating = 0;
  allReviews.forEach(r => totalRating += r.review.rating || 0);
  const avgRating = allReviews.length > 0 ? (totalRating / allReviews.length).toFixed(1) : "0.0";

  res.render("host/dashboard.ejs", {
    listings,
    stats: {
      totalEarnings,
      activeListings,
      totalBookings,
      avgRating
    },
    recentBookings,
    recentReviews
  });
};

module.exports.createlisting = async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    req.flash("errormsg", "At least one image is required");
    return res.redirect("/listings/new");
  }
  const newlisting = new listing(req.body);
  const Coordinates = await getcoordinates(newlisting.location, newlisting.country);
  newlisting.geometry = { type: "Point", coordinates: Coordinates };
  newlisting.owner = req.user._id;
  newlisting.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
  await newlisting.save();
  req.flash("success", "New Listing added");
  res.redirect("/listings");
};

module.exports.rendereditform = async (req, res) => {
  let { id } = req.params;
  console.log(id);
  let Listing = await listing.findById(id);
  if (!Listing) {
    req.flash("errormsg", "Listing you requested does not exist");
    return res.redirect("/listings");
  }
  res.render("./listings/edit.ejs", { Listing });
};

module.exports.updatelisting = async (req, res) => {
  let { id } = req.params;
  
  console.log("=== UPDATE LISTING DEBUG ===");
  console.log("req.body:", req.body);
  console.log("req.body.deleteImages:", req.body.deleteImages);
  
  // Extract deleteImages from body to prevent it from being updated in the document
  const { deleteImages, ...updateData } = req.body;
  
  console.log("updateData (after extracting deleteImages):", updateData);
  
  // Get the current listing first
  let Listing = await listing.findById(id);
  console.log("Current images count:", Listing.images.length);
  
  // Update only the fields that should be updated (not images)
  Listing.title = updateData.title;
  Listing.description = updateData.description;
  Listing.price = updateData.price;
  Listing.location = updateData.location;
  Listing.country = updateData.country;
  Listing.guests = updateData.guests;
  Listing.bedrooms = updateData.bedrooms;
  Listing.beds = updateData.beds;
  Listing.bathrooms = updateData.bathrooms;
  Listing.amenities = updateData.amenities || [];
  
  // Add new images if uploaded
  if (typeof req.files !== "undefined" && req.files.length > 0) {
    const newImages = req.files.map(f => ({ url: f.path, filename: f.filename }));
    Listing.images.push(...newImages);
    console.log("Added new images:", newImages.length);
  }
  
  // Save the listing with updated fields and new images
  await Listing.save();
  console.log("After save, images count:", Listing.images.length);
  
  // Delete selected images
  if (deleteImages) {
    // Ensure deleteImages is always an array (Express sends single checkbox as string)
    const imagesToDelete = Array.isArray(deleteImages) 
      ? deleteImages 
      : [deleteImages];
    
    console.log("Image IDs to delete:", imagesToDelete);
    console.log("Current images in listing:", Listing.images);
    
    // Find the images to delete and get their filenames for Cloudinary deletion
    const imagesToDeleteFromCloudinary = Listing.images
      .filter(img => imagesToDelete.includes(img._id.toString()))
      .map(img => img.filename);
    
    console.log("Filenames to delete from Cloudinary:", imagesToDeleteFromCloudinary);
    
    // Delete from Cloudinary (only if filename is not 'listingimage' - sample data)
    for (let filename of imagesToDeleteFromCloudinary) {
      if (filename && filename !== 'listingimage') {
        try {
          await cloudinary.uploader.destroy(filename);
          console.log(`✓ Deleted from Cloudinary: ${filename}`);
        } catch (err) {
          console.error(`✗ Failed to delete ${filename}:`, err);
        }
      } else {
        console.log(`⊘ Skipped Cloudinary deletion for sample data: ${filename}`);
      }
    }
    
    // Filter out the images to delete by _id
    Listing.images = Listing.images.filter(img => !imagesToDelete.includes(img._id.toString()));
    await Listing.save();
    
    console.log("After deletion, images count:", Listing.images.length);
  }

  req.flash("success", "listing updated");
  res.redirect(`/listings/${id}`);
};

module.exports.destroylisting = async (req, res) => {
  let { id } = req.params;
  await listing.findByIdAndDelete(id).then(() => console.log("success"));
  res.redirect("/listings");
};