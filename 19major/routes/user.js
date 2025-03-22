const express = require("express");
const router=  express.Router({mergeParams:true});

const wrapAsync= require("../utils/wrapAsync.js");
// const { UserSchema} = require("../Schema_models/schema_validations.js");  // data validation- joi

// //model folder file import
const User = require("../Schema_models/user.js");    //user schema

//passport
const passport= require("passport");
const localStrategy= require("passport-local");

//middlewares  for login and validations isLoggedIn
const {saveRedirectUrl} =require("../utils/middlewares.js");



// //joi - as a middleware--------------------------------------------------------------------------------------------
// const validateUser=(req, res ,next)=>{
//     let {error}= userSchema.validate(req.body);
//     if(error)
//     {
//       console.log(error);
//       let error_msg=error.details.map((elem)=> elem.message).join(",");// join all error details
//       throw new expressError(400, error_msg);
//     }
           
//     else
//         next();
//   }
//   /****************************************************************************************************/
  




//user signup
router.get("/signUp", wrapAsync(async (req, res) => {
    
    res.render("user/new_user.ejs");  
  })
);



//user  register
router.post("/signUp", wrapAsync(async (req, res) => {
    try{
        let { username, email, password,confirmPassword } = req.body;

        if(password!=confirmPassword)
        {
          req.flash("error", `Re-entered password do not match`);
          res.redirect("/signUp");
          return;
        }

        const newUser = new User({email, username});
        const registeredUser= await User.register(newUser, password );

        console.log("new user registered:",registeredUser ); 
        
        //login after registering ****************************
        req.login(registeredUser, (err)=> {
          if (err) {
              next(err);
          }
          req.flash("success", `🎉 Welcome to Wanderlust, ${registeredUser.username} 🎉!  Your account has been successfully created`);
          res.redirect("/listings");
      });
      //****************************************************** */
    }
    catch(err)
    {
        console.log(err);
        req.flash("error", err.message);
        res.redirect("/signUp" );
    }
})
);




//user login
router.get("/login", wrapAsync(async (req, res) => {
    
    res.render("user/userLogin.ejs");  
  })
);


//user login
router.post("/login", 
            saveRedirectUrl,   // to store url which will be reset after "passport.authenticate"
            passport.authenticate('local', { failureRedirect: '/login', failureFlash:true }), 
            wrapAsync(async (req, res) => {   //passport.authenticate() middleware for authentication

        let { username , password } = req.body;

        console.log("welcome:",username ); 

        req.flash("success", `Welcome to wanderlust!   ${username}`);
        
        //to page just before login page
        let redirectUrl= res.locals.redirectUrl || "/listings" ;  // if directly login from home without "isLoggedIn"

        console.log("\n*********************************",redirectUrl,"*******************\n");
        
        res.redirect(redirectUrl);
})
);


router.get("/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
          return next(err);
      }
      req.flash("success", "Logged out!");
      res.redirect("/listings");
    });
});

// //Delete user 
// router.delete("/:reviewId", wrapAsync(async (req, res) => {
// let { id, reviewId } = req.params;

// let deletedReviewInListing= await Listing.findByIdAndUpdate(id,  {$pull:  {reviews:reviewId}} )  ;
// let deletedReview = await Review.findByIdAndDelete(reviewId);

// console.log(deletedReviewInListing,"\n**************\n", deletedReview);
// req.flash("success", "Review Deleted");

// res.redirect(`/listings/${id}`);
// })
// );





module.exports=router ;

//gggggggg