const express = require("express");
const router=  express.Router({mergeParams:true});

const wrapAsync= require("../utils/wrapAsync.js");
const expressError= require("../utils/expressErrors.js");
const { reviewSchema} = require("../Schema_models/schema_validations.js");  // data validation- joi

// //model folder file import
const Listing = require("../Schema_models/listing.js");
const Review = require("../Schema_models/review.js");


//isLoggedIn
const{isLoggedIn,isReviewWriter, validateReview} =require("../utils/middlewares.js");



//reviews  save
router.post("/",isLoggedIn, validateReview, wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);

  //new review
  let newReview= new Review(req.body.review);
  newReview.writer= req.user._id;  

  //save in both review and listing
  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();

  console.log("new review saved:\n",newReview ); 
  req.flash("success", "New review saved");
  res.redirect(`/listings/${listing._id}` );
})
);


//Delete review in show
router.delete("/:reviewId",isLoggedIn, isReviewWriter, wrapAsync(async (req, res) => {
let { id, reviewId } = req.params;

let deletedReviewInListing= await Listing.findByIdAndUpdate(id,  {$pull:  {reviews:reviewId}} )  ;
let deletedReview = await Review.findByIdAndDelete(reviewId);

console.log(deletedReviewInListing,"\n**************\n", deletedReview);
req.flash("success", "Review Deleted");

res.redirect(`/listings/${id}`);
})
);





module.exports=router ;