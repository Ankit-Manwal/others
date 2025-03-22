const express = require("express");
const app = express();  


/****************************************************************************** */
// app.use(middleware)
app.use(() => {
    console.log("hi, I am a middleware"); 
});

// using req & res object in middleware
app.use((req, res,next) => {
    console.log("hi, I am response sending middleware 1"); 
    // res.send("bye");
    next();
    console.log("hi,after next"); 
    // return next;
});

// using req & res object in middleware
app.use((req, res,next) => {
    console.log("hi, I am response sending middleware 2"); 
    // res.send("bye");
});

// //logger-morgan
// app.use((req, res, next) => {
//     req.responseTime = new Date(Date.now()).toString();// manipulate request ny middleware
//     console.log(req.method, req.path, req.responseTime, req.hostname); 
//     next();
// });


// logger-morgan
app.use((req, res, next) => {
    req.responseTime = new Date(Date.now()).toString();// manipulate request ny middleware
    console.log(req.method, req.path, req.responseTime, req.hostname); 
    next();
});

//path specific- /random"
app.use("/random", (req, res,next) => {
    console.log("hi, I am response sending middleware 2"); 
});





/****************************************************************************************** */
//404
app.use( (req, res,next) => {
    res.status(404).send("page not found"); 
});


/****************************************************************************************** */
//access   required 

//   localhost:8080/api?token=giveaccess
app.use( "api/", (req, res,next) => {
    let{token}=req.query;
    if(token=="giveaccess")
         return next();
    else 
        console.log("****denied access***");
});       


app.get("/api", (req, res) => {               //     app.get("/api",m1,  (req, res) => {             
    res.send("******data**********");         //        res.send("******data**********");
  });                                         //      });



/****************************************************************************************** */

// Middleware 1
const m1 = (req, res, next) => {
    console.log("middleware 1");
    next();  // Pass control to the next middleware
  };
  
  // Middleware 2
  const m2 = (req, res, next) => {
    console.log("middleware 2");
    next();  // Ensure to call next() to proceed to the route handler
  };
  
  // Route with multiple middleware
  app.get("/checkm", [m1, m2], (req, res) => {
    res.send("working root");
  });

/****************************************************************************************** */

//error handle
app.use( "api/", (req, res,next) => {
    let{token}=req.query;
    if(token=="giveaccess")
         return next();
    else 
        throw new Error("****denied access***");
});       

/****************************************************************************************** */



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
