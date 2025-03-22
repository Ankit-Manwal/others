const { log } = require("console");
const express= require("express");
const app= express();  
const {v4:uuidv4}= require('uuid');
const methodOverride= require("method-override");

//database
let posts=[
    {
        id:uuidv4(),
        username: "apnacoll",
        content: "dddddddddddddd"
    },
    {
        id:uuidv4(),
        username: "anki",
        content: "deec"
    },
    {
        id:uuidv4(),
        username: "rojii",
        content: "ddddrrrrrrrrrrrrrrrdddddddddd"
    }
];

//port
const port= 8080;
app.listen(port ,()=>{
    console.log(`listening on port ${port}`);
});

//middleware 
app.use(express.urlencoded({extended:true}));


// view folder-html template
app.set("view engine", "ejs"); 
const path= require("path");                               
app.set("views", path.join(__dirname,  "views"));   


//public folder-style
app.use(express.static(path.join(__dirname, "public")));

//edit ejs
app.use(methodOverride("_method"));


app.get("/",  (req, res)=>{
    res.send("serving");
});


//show all forms
app.get("/posts",  (req, res)=>{
    res.render("index.ejs", {posts});
});


//for getting new form
app.get("/posts/new",  (req, res)=>{
    res.render("new.ejs");
});


//after filling and submitting new form
app.post("/posts",  (req, res)=>{
    console.log(req.body);//req.body has data

    let{username, content}= req.body;
    let id=uuidv4();
    posts.push({id, username, content});
    // res.send("post request working");

    res.redirect('/posts'); //res.render("index.ejs", {posts});
}); 

//specific post 
app.get("/posts/:id",  (req, res)=>{
    let {id}=req.params;
    let post=posts.find((p)=>id==p.id);
    res.render("show.ejs", {post} );
});


//edit
app.get("/posts/:id/edit",  (req, res)=>{
    let {id}= req.params;
    let post=posts.find((p)=>id==p.id);
    res.render("edit.ejs", {post});
});

//patch
app.patch("/posts/:id",  (req, res)=>{
    let {id}=req.params;
    let newcontent= req.body.content;
    let post=posts.find((p)=>id==p.id);
    post.content=newcontent;

    res.redirect('/posts'); 
});


//delete
app.delete("/posts/:id",  (req, res)=>{
    let {id}=req.params;
    posts= posts.filter((p) => id !=p.id);
    res.redirect('/posts'); 
});
