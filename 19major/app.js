const express = require("express");
const app = express();  
const path = require("path");
const mongoose = require("mongoose");
const methodOverride= require("method-override");
const mongourl= "mongodb://127.0.0.1:27017/wanderlust";
const  ejsmate= require("ejs-mate");
// const wrapAsync= require("./utils/wrapAsync.js");
const expressError= require("./utils/expressErrors.js");
// const {listingSchema, reviewSchema, userSchema} = require("./schema.js");  // data validation- joi

// //model folder file import
// const Listing = require("./Schema_models/listing.js");
// const Review = require("./Schema_models/review.js");
// const User = require("./Schema_models/user.js");


//passport
const passport= require("passport");
const localStrategy= require("passport-local");
const User= require("./Schema_models/user.js");

//routes
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


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



/***************************************************************************************************** */
const session = require("express-session");
// Set up session middleware
app.use(
  session({
            secret: "mysupersecretstring", // Secret to sign the session ID cookie
            resave: false, // Prevents saving the session back to the store if it hasn't been modified
            saveUninitialized: true, // Forces a session that is "uninitialized" to be saved to the store
            cookie: {                   // Set to true if using HTTPS
                      // secure: false,
                      expires:Date.now()+ 7 * 24 * 60 * 60 * 1000,  // in milliseconds
                      maxAge:7 * 24 * 60 * 60 * 1000,
                      httpOnly: true
                    }
          })
);


/*********************************************************************************************** */
// after sessions
const flash = require("connect-flash");
//flash connect  -  temporary one
app.use( flash() );


/************************************************************************************************/
//passport
app.use(passport.initialize());
app.use(passport.session());

// use static authenticate method of model in LocalStrategy
passport.use(new localStrategy( User.authenticate() ) );

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());











/*********************************************************************************************** */
//flash middleware in locals
app.use((req,res,next)=>{
  res.locals.success_msg= req.flash("success");
  res.locals.error_msg= req.flash("error");
  res.locals.currUser= req.user;

  // console.log(res.locals.success_msg);
  next();
});



//listing routes
app.use("/listings", listingRouter);

//review routes
app.use("/listings/:id/reviews", reviewRouter);

//user routes
app.use("/", userRouter);




// //demo user
// app.get("/demoUser", async (req, res) => {
//   let fakeUser = new User({
//           email: "student@gmail.com",
//           username: "abcstudent",
//       });

//   let newUser = await User.register(fakeUser, "helloworld");//user  password
//   res.send(newUser);
// });





/**************************************************************************************************************************************************************/
//middleware
//error handling 

// Explicitly handle the /favicon.ico request
app.get('/favicon.ico', (req, res) => {
  console.log("Favicon request received");
  res.status(204).send();  // Send a 204 No Content response
});



// all errors- at last standard response if no route above matched
app.all('*' , ( req, res, next)=>{  
  console.log("************", req.get('Referer'),"***************");
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






