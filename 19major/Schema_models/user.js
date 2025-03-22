const { string, required } = require("joi");
const mongoose = require("mongoose");
const { Schema } = mongoose;  // Fixing the syntax here
const passportLocalMongoose = require("passport-local-mongoose");


// Define the user Schema
const userSchema = new Schema({
  email:{
            type:String,
            required:true,
         }
});

userSchema.plugin(passportLocalMongoose);  //automatically define user, password, hashing, salting

// Create and export the user model
module.exports = mongoose.model("User", userSchema);
