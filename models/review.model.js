var mongoose = require("mongoose");

var reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    text: String,
    date: {
        type: Date,
        default: Date.now()
    },
    rating: Number
});

module.exports = mongoose.model("Review", reviewSchema);