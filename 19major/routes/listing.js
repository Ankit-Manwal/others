const express = require("express");
const router=  express.Router({mergeParams:true});

const wrapAsync= require("../utils/wrapAsync.js");
const expressError= require("../utils/expressErrors.js");
//const {listingSchema} = require("../Schema_models/schema_validations.js");  // data validation- joi

// //model folder file import
const Listing = require("../Schema_models/listing.js");

//middlewares  for login and validations isLoggedIn
const{isLoggedIn, validateListing, isOwner} =require("../utils/middlewares.js");



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
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    
    res.render("listings/index.ejs", { allListings });  
  })
);



//New Route- create new data form                            1
router.get("/new", isLoggedIn, (req, res) => {
    console.log(req.user);   //user info 
    res.render("listings/new.ejs");
  });
  

  
//Create Route - save info. input in (new data form)
router.post("/",isLoggedIn, validateListing ,wrapAsync( async (req, res) => {
               //joi - as a middleware

  //  let result=listingSchema.validate(req.body);
  //  console.log(result);
  //  if(result.error)
  //         throw new expressError(400, result.error);

    
    const newListing = new Listing(req.body.listing);
    newListing.owner= req.user._id ;
    
    // *******************joi*********************************

    // if(!req.body.listing) // if no  listings obj
    //      throw new expressError(400, "Send valid data for listing");
    // if(!newListing.description) // if no description in listings obj
    //          throw new expressError(400, "description is missing for listing");
    // if(!newListing.title) // if no description in listings obj
    // if(!newListing.location) // if no description in listings obj
    console.log(newListing);
    
    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
})
);

  
//Show Route-   specific data                                 2
router.get("/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate(  { path:"reviews",
                                                          populate:{path:"writer"} 
                                                        }    
                                                      )
                                            .populate("owner");  
  if(!listing )
  {
    req.flash("error", "Listing you requested not found");
    return res.redirect("/listings");
  }
  console.log("\n***Show***\n",listing);
  res.render("listings/show.ejs", { listing });
})
);




//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing )
      {
        req.flash("error", "Listing you requested for edit not found");
        return res.redirect("/listings");
      }
    res.render("listings/edit.ejs", { listing });
})
);




//Update Route
router.put("/:id",isLoggedIn, isOwner, validateListing, wrapAsync(async (req, res) => {
  // if(!req.body.listing) // if no listings obj
  //     throw new expressError(400, "Send valid data for listing");
    let { id } = req.params;
    console.log( '\n',{...req.body.listing},"\n");

    await Listing.findByIdAndUpdate(id, req.body.listing ,  { new: true, runValidators: true });
    req.flash("success", "Listing Edited");
    res.redirect(`/listings/${id}`);
})
);


//Delete list in show Route
router.delete("/:id",isLoggedIn, isOwner, wrapAsync(async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log("deleted listing:\n",deletedListing);
  req.flash("success", "Listing Deleted");
  res.redirect("/listings");
  })
);




module.exports=router ;