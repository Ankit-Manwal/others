// to initiallise database for sample data


const mongoose = require("mongoose");

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
  


// // chat 1  data
// let chat1= new Chat({
//     from: "neha",
//     to: "priya",
//     message: "sendme jkkkk",
//     created_at: new Date()  // utc format
// });

// //save to database
// chat1.save() //asynchronous
// .then((res)=>{
//     console.log("data saved\n", res);
// })
// .catch((err)=>{
//     console.log("unable to save data\n", err);
// });


// chat multiple
let allchats= [ 
                {
                    from: "rahul",
                    to: "priya",
                    message: "sendme jkkkk",
                    created_at: new Date()  // utc format
                },
                {
                    from: "neha",
                    to: "priya",
                    message: "sendme jkkkk",
                    created_at: new Date()  // utc format
                },
                {
                    from: "nerohanha",
                    to: "priya",
                    message: "sendme jkkkk",
                    created_at: new Date()  // utc format
                }
            ];

//save to database
Chat.insertMany(allchats)
.then((res)=>{
    console.log("data saved\n", res);
})
.catch((err)=>{
    console.log("unable to save data\n", err);
});