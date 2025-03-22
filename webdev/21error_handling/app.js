const express = require("express");
const app = express();  

//user defined error
const ExpressError= require("./expressError.js");


/****************************************************************************** */
// app.use(middleware)
app.use((req, res, next) => {
    console.log("hi, I am a middleware"); 
    next();
});



// //path specific- /random"
// app.use("/random", (req, res, next) => {
//     console.log("hi, I am response sending middleware 2"); 
// });






// /*******************************************************************************************/

//error handle
app.use( "/api", (req, res,next) => {
    let{token}=req.query;
    if(token=="giveaccess")
         return next();
    else 
        throw new ExpressError(401, "********denied access***");
});       

// Define a route for the root path
app.get("/api", (req, res) => {
  res.send("****************data*************");
});



// app.get("/admin", (req, res) => {
//   throw new ExpressError(403, "********admin access forbidden***");
// });
// /*******************************************************************************************/
//main error handle
// app.use( (err, req, res, next) => {
//     throw new Error("****1232denied access***", err);
// });       

//       or

//main error handle
app.use( (err, req, res,next) => {
  console.log("***11*denied access***", err);
 // next();  // to find next non error handler middleware
  // or
  next(error)  // to find next error handler middleware
  
 });  

// /********************************************************************************************/
//404 for non exiting page
// app.use( (req, res,next) => {
//   res.status(404).send("page not found"); 
// });


// /*******************************************************************************************/
app.use( (err, req, res,next) => {
  let {status=500, message="some error occuured"}=err;

  console.log("**222*denied access***", err);
  console.log("++++++++++++++", message,"+++++++++++");
  

  res.status(status).send(message);//  message of initial throw-  "throw new ExpressError(401, "********denied access***");"
 });  


//******************************************************************************************* */
// Define a route for the root path
app.get("/", (req, res) => {
  res.send("working root");
});


app.get("/random", (req, res) => {
    res.send("working random page");
  });


// Start the server
app.listen(8080, () => {
  console.log("App is listening on port 8080");
});













//ASYNC FUNCTION ERROR HANDLER
/****************************************************************************************** */
//async fn  error
// NEW - Show Route
app.get("/chats/:id", async (req, res, next) => {

  try {    // work all times - id  or length is wrong (casting error handler for id to _id)
    let { id } = req.params;
    let chat = await Chat.findById(id);   // undefined value if not found
    if (!chat) {
      // work only if id is wrong but length same (else use try catch)
        return next(new ExpressError(404, "Chat not Found or Deleted"));
        // throw new ExpressError(404, "Chat not Found or Deleted");  no right for async as async fn donot implicitly call next()
    }
    res.render("edit.ejs", { chat });
} 

catch (err) {
    next(err);
}
});


/******************************************************************************************/

// error handling for async validation error- when rules for data saving are voilated
app.post("/chats", async (req, res, next) => {
  try {    // work all times - id  or length is wrong (casting error handler for id to _id)
      let { from, to, message } = req.body;
      let newChat = new Chat({
          from: from,
          to: to,
          message: message,
          created_at: new Date(),
      });

      await newChat.save();
      res.redirect("/chats");
  } 
  catch (err) {
      next(err);
  }
});


/******************************************************************************************/
//wrapAsync - tackle bulky try and catch
function asyncWrap(fn) {
  return function (req, res, next) {
      fn(req, res, next).catch((err) => next(err));
  };
}

// NEW - Show Route
app.get("/chats/:id", asyncWrap(async (req, res, next) => {
  let { id } = req.params;
  let chat = await Chat.findById(id);
  if (!chat) {
      next(new ExpressError(500, "Chat not found"));
  } else {
      res.render("edit.ejs", { chat });
  }
}));





/******************************************************************************************/
// SPECIFIC HANDLER for specific error
const handleValidationErr = (err) => {
  console.log("Validation error occurred");
  return err;
};

app.use((err, req, res, next) => {
  console.log(err.name); 
  if (err.name === "ValidationError") {
      err = handleValidationErr(err);
  }
  next(err);
});























