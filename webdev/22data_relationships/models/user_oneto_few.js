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
  

 // Define the User schema
const userSchema = new Schema({
    username: { type: String, required: true },
    addresses: [
      {
        _id:false, // not create separate id for each location element
        location:String,
        city: String
      }
    ]
  });
  
  // Create the User model
  const User = mongoose.model("User", userSchema);
  
  // Function to add a new user with addresses
  const addUsers = async () => {
    try {
      // Create a new user instance with initial data
      let user1 = new User({
        username: "sherlockholmes",
        addresses: [
          {
            location: "221B Baker Street",
            city: "London"
          }
        ]
      });
  
      // Add an additional address to the user's addresses array
      user1.addresses.push({
        location: "P32 WallStreet",
        city: "London"
      });
  
      // Save the user to the database
      let result = await user1.save();
      console.log("User added successfully:", result);
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };
  
  // Call the function to add a user
  addUsers();