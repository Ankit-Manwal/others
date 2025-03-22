const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');

// const { log } = require("console");
const express= require("express");
const app= express();  

// view folder-html template
app.set("view engine", "ejs"); 
const path= require("path");                               
app.set("views", path.join(__dirname,  "/views"));   

// uuid and method overriding
const {v4:uuidv4}= require('uuid');
const methodOverride= require("method-override");

//edit methodOverride
app.use(methodOverride("_method"));

//middleware 
app.use(express.urlencoded({extended:true}));


//public folder-style
app.use(express.static(path.join(__dirname, "public")));


//port
const port= 8080;
app.listen(port ,()=>{
    console.log(`listening on port ${port}`);
});


// create the connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'delta_app',
  password: '#mysql@123'
});

// Connect to the database and handle errors
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database.');
});


//fake data for hundred user
let  getRandomUser=  ()=> {
    return [
      faker.string.uuid(),
      faker.internet.username(), 
      faker.internet.email(),
      faker.internet.password(),
    ];
};

// let que= " INSERT INTO user (id, username, email, password) VALUES ? ";
// let data=[];
// for (let i = 0; i <= 100; i++) {
//    data.push(getRandomUser());
// }

// //connection to sql and query
// try{
//     connection.query(que, [data] , (err, result)=>{
//         if(err) throw err;
//         console.log(result);  //result -array
//     });
// }
// catch(err){
//     console.log(err);
// }

// connection.end();



//home page
app.get("/", (req, res) => {
  let q = 'SELECT count(*) FROM user'; // Corrected query syntax
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let count = result[0]["count(*)"]; // Ensure correct access to result
      res.render("home.ejs", { count });      
    });
  } 
  catch (err) {
    res.status(500); // Set status to 500
    res.send("Some error occurred",err);
  }
});


//All users data
app.get("/users", (req, res) => {
  let q = 'SELECT * FROM user'; // Corrected SQL query syntax
  try {
    connection.query(q, (err, result) => { // Fixed callback function syntax
      if (err) throw err;
      let users = result;
      res.render("Allusers.ejs", { users });
    });
  } catch (err) {
    console.error(err); // Log error for debugging
    res.status(500).send("Some error occurred"); // Send 500 status with error message
  }
});



































// //show all forms
// app.get("/posts",  (req, res)=>{
//     res.render("index.ejs", {posts});
// });


// //for getting new form
// app.get("/posts/new",  (req, res)=>{
//     res.render("new.ejs");
// });


// //after filling and submitting new form
// app.post("/posts",  (req, res)=>{
//     console.log(req.body);//req.body has data

//     let{username, content}= req.body;
//     let id=uuidv4();
//     posts.push({id, username, content});
//     // res.send("post request working");

//     res.redirect('/posts'); //res.render("index.ejs", {posts});
// }); 

// //specific post 
// app.get("/posts/:id",  (req, res)=>{
//     let {id}=req.params;
//     let post=posts.find((p)=>id==p.id);
//     res.render("show.ejs", {post} );
// });


// //edit
// app.get("/posts/:id/edit",  (req, res)=>{
//     let {id}= req.params;
//     let post=posts.find((p)=>id==p.id);
//     res.render("edit.ejs", {post});
// });

// //patch
// app.patch("/posts/:id",  (req, res)=>{
//     let {id}=req.params;
//     let newcontent= req.body.content;
//     let post=posts.find((p)=>id==p.id);
//     post.content=newcontent;

//     res.redirect('/posts'); 
// });


// //delete
// app.delete("/posts/:id",  (req, res)=>{
//     let {id}=req.params;
//     posts= posts.filter((p) => id !=p.id);
//     res.redirect('/posts'); 
// });
