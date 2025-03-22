const express= require("express");
const app= express();   // internally require ejs

const port= 8080;
app.listen(port ,()=>{
    console.log(`listening on port ${port}`);
});



app.set("view engine", "ejs"); // view engine is set to ejs


//giving path of view folder
const path= require("path");                               // to make sure view folder is accessible
app.set("views", path.join(__dirname,        "/views"));   // irrespective of place from where serve-index.js is started
                         // directory of ejs



app.get("/",  (req, res)=>{
    // res.send("this is home");
    res.render("home.ejs");    // by default check view folder for template
});


 
app.get("/hello",  (req, res)=>{
    res.send("hello");    
});


app.get("/rolldice",  (req, res)=>{
    let num= Math.floor(Math.random()*6);

    // res.render("home.ejs" , {num: num});
    res.render("home.ejs" , {num});

});


app.get("/ig/:username",  (req, res)=>{
    let {username}= req.params;
    console.log(username);

    res.render("insta.ejs", {username});
});