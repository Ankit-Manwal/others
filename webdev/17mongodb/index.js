// getting-started.js
const mongoose = require('mongoose');

//connection to mongodb
main()
.then((res)=>{
    console.log("connection successful");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/test');  //asynchronous
}

//schema
const userSchema= new mongoose.Schema({
    name:String,
    email:String,
    age: Number
});

//model->class 
const User = mongoose.model("User" ,     userSchema);     
//    model                connection     schema


/******************************************************************************************************************* */

// // ( document->object)
// //insert a document-like tuple / or create  a document in memory
// const user1= new User({
//     name:"Adam",
//     email:"adam@gmail.com",
//     age:45
// });


// //save to database
// user1.save() //asynchronous
// .then((res)=>{
//     console.log("data saved\n", res);
// })
// .catch((err)=>{
//     console.log("unable to save data\n", err);
// });


// //mutiple insert
// User.insertMany ([
//     { name: "Tony", email: "tony@gmail.com", age: 50},
//     { name: "Bruce", email: "bruce@gmail.com", age: 47},
//     { name: "Peter", email: "peter@gmail.com", age: 30},
// ])
// .then((data) => {
//     console.log(data); 
// })
// .catch((err)=>{
//     console.log(err);
// });


/******************************************************************************************************************* */



//find    ->findMany
User.find({})              // return query object
.then((data) => {
    console.log(data); 
})
.catch((err)=>{
    console.log(err);
});


/******************************************************************************************************************* */


// //update    -> updateMany     // return meta data
// User.updateOne({name:"Bruce"} , {age:49})  //no need of set operator
// //               filter         new data       
// .then((data) => {
//     console.log(data); 
// })
// .catch((err)=>{
//     console.log(err);
// });


//findOneAndUpdate() // return old data
//findByIdAndUpdate() // return old data


/******************************************************************************************************************* */


//delete   ->deleteMany()
User.deleteOne({name:"Bruce"} , {age:49})   //return meta data
.then((data) => {
    console.log(data); 
})
.catch((err)=>{
    console.log(err);
});


//findByIdAndDelete() // return old data
//findOneAndDelete() // return old data
