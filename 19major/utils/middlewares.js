const wrapAsync= require("../utils/wrapAsync.js");
const {listingSchema, reviewSchema} = require("../Schema_models/schema_validations.js");  // data validation- joi
const Listing = require("../Schema_models/listing.js");
const Review = require("../Schema_models/review.js");



const isLoggedIn=(req, res, next)=>{
    // console.log(req.path, "++", req.originalUrl);

    if(!req.isAuthenticated())  // login to create a new listing
    {
        //saving redirectUrl in sessions for redirect after login
        req.session.redirectUrl= req.originalUrl;

        req.flash("error", "Login in to create a listing!");
        return res.redirect("/login");
    }
    next();
}

const saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl)
    {
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};



const isOwner= wrapAsync(async (req,res,next)=>{
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(res.locals.currUser && !(listing.owner._id.equals(res.locals.currUser._id))){
      req.flash("error", "You are not the owner this Listing");
      return res.redirect(`/listings/${id}`);
    }
    next();
});


const isReviewWriter= wrapAsync(async (req,res,next)=>{
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);

    if(res.locals.currUser && !(review.writer._id.equals(res.locals.currUser._id))){
      req.flash("error", "You are not the writer this Review");
      return res.redirect(`/listings/${id}`);
    }
    next();
});

//joi - as a middleware--------------------------------------------------------------------------------------------

const validateListing=(req, res ,next)=>{
    let {error}= listingSchema.validate(req.body);
    
    if(error)
    {
      console.log(error);
      let error_msg=error.details.map((elem)=> elem.message).join(",");// join all error details
      throw new expressError(400, error_msg);
    }
           
    else
        next();
  }


  const validateReview=(req, res ,next)=>{
    let {error}= reviewSchema.validate(req.body);
    if(error)
    {
      console.log(error);
      let error_msg=error.details.map((elem)=> elem.message).join(",");// join all error details
      throw new expressError(400, error_msg);
    }
           
    else
        next();
  }
/****************************************************************************************************/



module.exports={isLoggedIn,saveRedirectUrl,isOwner,isReviewWriter, validateListing ,validateReview}; 
