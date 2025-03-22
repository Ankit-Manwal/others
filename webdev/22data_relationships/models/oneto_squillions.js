const mongoose = require("mongoose");
const {Schema}=mongoose;

// Connect to MongoDB
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/relationalDemo");
  }
  
  main()
    .then(() => {
      console.log("Connection successful");
    })
    .catch((err) => console.log(err));
//********************************************************************************************** */



const userSchema = new Schema({
    username: String,
    email: String
});


const postSchema = new Schema({
    content: String,
    likes: Number,
    user: {
        type: Schema.Types.ObjectId,
        ref: "Usr"  //collection referenced to
    }
});


const Usr = mongoose.model("Usr", userSchema);
const Post = mongoose.model("Post", postSchema);

/***************************************************************************************** */
// //1st time
// const addData = async () => {
//     try {
//         // Create a new user
//         let user1 = new Usr({
//             username: "rahulkumar",
//             email: "rahul@gmail.com",
//         });

//         // Create a new post and associate it with the user
//         let post1 = new Post({
//             content: "Hello World!",
//             likes: 7,
//             user: user1._id  // Assign user1's ID to the user field in post1
//         });

//         // Save both user and post to the database
//         await user1.save();
//         await post1.save();

//         console.log("Data added successfully!");
//     } catch (error) {
//         console.error("Error adding data:", error);
//     }
// };

/************************************************************************************ */
// 2nd timme
const addData = async () => {
    try {
        // Find the user with username "rahulkumar"
        let user = await Usr.findOne({ username: "rahulkumar" });

        // If the user is not found, handle the error
        if (!user) {
            console.error("User not found");
            return;
        }

        // Create a new post and associate it with the found user
        let post2 = new Post({
            content: "Bye Bye :)",
            likes: 23,
            user: user._id  // Assign user ID to the post
        });

        // Save the post to the database
        await post2.save();

        console.log("Post added successfully:", post2);
    } catch (error) {
        console.error("Error adding data:", error);
    }
};
/*************************************************************************************** */



// Call the function
// addData();


//get data
const findcustomer=async()=>{
    // // let result = await Customer.find({});                   // give how data order ids in customer
    let result = await Post.find().populate("user",  'username');     //replace order ids with actual values from order collection
    //                                       field
    console.log(result);
};

findcustomer();


// const deleteData = async () => {
//     try {
//         // Delete a post by ID
//         await Post.findByIdAndDelete("651db703119223d32b0c102b");

//         // Delete a user by ID
//         await User.findByIdAndDelete("651db5b552cf598a629e0ef9");

//         console.log("Post and User deleted successfully.");
//     } catch (error) {
//         console.error("Error deleting data:", error);
//     }
// };


// // Call the function
// deleteData();

