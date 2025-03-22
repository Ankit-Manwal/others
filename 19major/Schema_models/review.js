const mongoose = require("mongoose");
const { Schema } = mongoose;  // Fixing the syntax here

// Define the Review Schema
const reviewSchema = new Schema({
    comment: String,
    rating: {
        type: Number,
        min: 1,
        max: 5,
    },
    createdAt: {
        type: Date,
        default: Date.now(), // Fixing the function call for the default date
    },

    writer:{
        type: Schema.Types.ObjectId,
        ref:"User",
    }
});

// Create and export the Review model
module.exports = mongoose.model("Review", reviewSchema);
