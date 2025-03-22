const express = require("express");
const app = express();


const path = require("path");
const  ejsmate= require("ejs-mate");
// use ejs-locals for all ejs templates:
app.engine('ejs', ejsmate);
// Set up views and view engine
app.set("views", path.join(__dirname, "views"));  
app.set("view engine", "ejs");


const session = require("express-session");
// Set up session middleware
app.use(
  session({
    secret: "mysupersecretstring", // Secret to sign the session ID cookie
    resave: false, // Prevents saving the session back to the store if it hasn't been modified
    saveUninitialized: true, // Forces a session that is "uninitialized" to be saved to the store
    cookie: { secure: false } // Set to true if using HTTPS
  })
);


const flash = require("connect-flash");
//flash connect  -  temporary one
app.use( flash() );











// to be used in every request 1st // empty for those which come before initializing success and error
app.use( (req, res, next) => {
  res.locals.msg=req.flash("success") ;
  res.locals.errormsg=req.flash("error") ;
  next();
});

//storing data in sessions
//****************************************************************************************************************** */
//register                   http://localhost:3000/register?name=abc

app.get("/register", (req, res) => {
  let {name="anomyous"}= req.query;
  
  req.session.name =name;     // adding name key to sessions

  console.log(req.session);  // Session {
                              //           cookie: { path: '/',  _expires: null, originalMaxAge: null, httpOnly: true, secure: false }  ,
                              //           name: 'abc'
                              //         }
  
  //saving temp msg
  if(name!="anomyous")
      req.flash("success", "user is registered");
  else
      req.flash("error", "user is not registered");


  res.send(name);
  // res.redirect("/hello");
});  



app.get("/hello", (req, res) => {
  let name = req.session.name;
  // res.send(`hello!: ${name}`);


  // res.render("page.ejs", {name:name, msg: req.flash("success") }  );
                       // OR
  // res.locals.msg=req.flash("success") ;
  // res.locals.errormsg=req.flash("error") ;


  res.render("page.ejs", {name:name}  );

});  





//******************************************************************************************************************

// count request in same session
app.get("/reqcount", (req, res) => {

  if(req.session.count)
    req.session.count++;
  else
     req.session.count=1;

  res.send(`you send a request: ${req.session.count} times`);
}); 


//******************************************************************************************************************
// Test route
app.get("/test", (req, res) => {
  res.send("test successful!");
});  


//******************************************************************************************************************
// Start the server
app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
