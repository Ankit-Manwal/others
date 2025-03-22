const express = require("express");
const app = express();  
const path = require("path");
const mongoose = require("mongoose");
const methodOverride= require("method-override");
const mongourl= "mongodb://127.0.0.1:27017/wanderlust";
const  ejsmate= require("ejs-mate");
const wrapAsync= require("./utils/wrapAsync.js");
const expressError= require("./utils/expressErrors.js");
const {listingSchema, reviewSchema} = require("./Schema_models/schema_validations.js");  // data validation- joi

// //model folder file import
const Listing = require("./Schema_models/listing.js");
const Review = require("./Schema_models/review.js");


// Connect to MongoDB
async function main() {
  await mongoose.connect(mongourl);
}
main()
  .then(() => {
    console.log("Connection to database successful");
  })
  .catch((err) => console.log(err));


// // Disable ETag generation globally
// app.set('etag', false);

  // use ejs-locals for all ejs templates:
app.engine('ejs', ejsmate);

// Set up views and view engine
app.set("views", path.join(__dirname, "views"));  
app.set("view engine", "ejs");

//public folder-style
app.use(express.static(path.join(__dirname, "public")));

//middleware 
app.use(express.urlencoded({extended:true}));

//edit methodOverride
app.use(methodOverride("_method"));


// Define a route for the root path
app.get("/", (req, res) => {
  res.send("working root");
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

// //testing insertion
// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My New Villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Calangute, Goa",
//     country: "India",
//   });

//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("successful testing");
// });



//Index Route-  show full list
app.get("/listings", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    
    res.render("listings/index.ejs", { allListings });
  })
);



//New Route- create new data form                            1
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
  });
  

//Show Route-   specific data                                 2
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listing });
})
);

  
//Create Route - save info. input in (new data form)
app.post("/listings", validateListing ,wrapAsync( async (req, res) => {
               //joi - as a middleware

  //  let result=listingSchema.validate(req.body);
  //  console.log(result);
  //  if(result.error)
  //         throw new expressError(400, result.error);

    
    const newListing = new Listing(req.body.listing);
    // *******************joi*********************************

    // if(!req.body.listing) // if no  listings obj
    //      throw new expressError(400, "Send valid data for listing");
    // if(!newListing.description) // if no description in listings obj
    //          throw new expressError(400, "description is missing for listing");
    // if(!newListing.title) // if no description in listings obj
    // if(!newListing.location) // if no description in listings obj
    console.log(newListing);
    

    await newListing.save();
    res.redirect("/listings");
})
);
  


//Edit Route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
})
);
  

//Update Route
app.put("/listings/:id",validateListing, wrapAsync(async (req, res) => {
  // if(!req.body.listing) // if no listings obj
  //     throw new expressError(400, "Send valid data for listing");
    let { id } = req.params;
    console.log( '\n',{...req.body.listing},"\n");

    await Listing.findByIdAndUpdate(id, req.body.listing ,  { new: true, runValidators: true });
    res.redirect(`/listings/${id}`);
})
);


//Delete list in show Route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
  })
);



//reviews  save
app.post("/listings/:id/reviews",validateReview, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);

    //new review
    let newReview= new Review(req.body.review);

    //save in both review and listing
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    console.log("new review saved:",newReview ); 

    res.redirect(`/listings/${listing._id}` );
  })
);


//Delete review in show
app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async (req, res) => {
  let { id, reviewId } = req.params;

  let deletedReviewInListing= await Listing.findByIdAndUpdate(id,  {$pull:  {reviews:reviewId}} )  ;
  let deletedReview = await Review.findByIdAndDelete(reviewId);

  console.log(deletedReviewInListing,"\n**************\n", deletedReview);

  res.redirect(`/listings/${id}`);
  })
);



/**************************************************************************************************************************************************************/
//middleware
//error handling 

// // Explicitly handle the /favicon.ico request
// app.get('/favicon.ico', (req, res) => {
//   console.log("Favicon request received");
//   res.status(204).send();  // Send a 204 No Content response
// });



// all errors- at last standard response if no route above matched
app.all('*' , ( req, res, next)=>{  
  console.log("dddddddddddddddd");
  
   next(new expressError(403, "Page not found!"));
});


// last error handler
app.use((err, req, res, next)=>{
  let {statuscode=500, message="something went wrong"}= err ;
  console.log(err);
  

  // res.status(statuscode).send(message); // response in page woyhout alerts
  res.status(statuscode).render("error.ejs", {err});
});



// Start the server
app.listen(8080, () => {
  console.log("App is listening on port 8080");
});







// console.log("Response status code before sending:", res.statusCode);






