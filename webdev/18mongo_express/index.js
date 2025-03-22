const express = require("express");
const app = express();  
const path = require("path");
const mongoose = require("mongoose");
const methodOverride= require("method-override");


//model folder file import
const Chat= require("./models/chat.js");

// Connect to MongoDB
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/whatapp");
}

main()
  .then(() => {
    console.log("Connection successful");
  })
  .catch((err) => console.log(err));



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



// Start the server
app.listen(8080, () => {
  console.log("App is listening on port 8080");
});


/***************************************************************************************** */


//index route
app.get("/chats", async (req, res) => {
  let chats= await Chat.find();
  res.render("index.ejs", {chats});
});


//new route
app.get("/chats/new", (req, res) => {
  res.render("new.ejs");
});




//create route
app.post("/chats", (req, res) => {
  let {from, to, message}= req.body;
  // new data
  let newchat= new Chat({
      from: from,
      to: to,
      message: message,
      created_at: new Date()  // utc format
  });

  
  //save to database
  newchat.save() //asynchronous
  .then((res)=>{
      console.log("data saved\n", res);
  })
  .catch((err)=>{
      console.log("unable to save data\n", err);
  });
  res.redirect("/chats");
});





//edit route
app.get("/chats/:id/edit",async(req, res) => {
  let {id}=req.params;
  console.log(id);
  
  let chat = await Chat.findById(id);
  res.render("edit.ejs", {chat});
});


//update route
app.put("/chats/:id",async(req, res) => {
  let {id}=req.params;
  let {message: newmessage}= req.body;

  let updatedChat= await Chat.findByIdAndUpdate(id ,  {message: newmessage}, {runValidators:true, new:true});
  console.log(updatedChat);

  let chat = await Chat.findById(id);
  res.redirect("/chats");
});

 
//delete route
app.delete("/chats/:id",async(req, res) => {
  let {id}=req.params;
  let deletedchat= await Chat.findByIdAndDelete(id);
  console.log(deletedchat);

  res.redirect("/chats");
});


