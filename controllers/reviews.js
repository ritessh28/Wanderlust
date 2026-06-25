const Listing=require("../models/listing.js");
const Review=require("../models/reviews.js");
module.exports.newreview=async(req,res,next)=>{
    let listing=await Listing.findById(req.params.id);
    let newreview=new Review(req.body.review);
    // console.log(req.params);
    // console.log(newreview);
    newreview.author=req.user._id;
    console.log(newreview);
    listing.reviews.push(newreview);
    await newreview.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
    // res.send("saved");
};
module.exports.destroyreview=async(req,res,next)=>{
    let{id,reviewid}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewid}})
    await Review.findByIdAndDelete(reviewid);
    res.redirect(`/listings/${id}`);
}