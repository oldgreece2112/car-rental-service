var mongoose = require("mongoose");

var carSchema = new mongoose.Schema({
    year: Number,
    make: String,
    model: String,
    desc: String,
    notes: String,
    mileage: Number,
    img: String,
    currentlyRented: Boolean,
    price: Number
});

module.exports = mongoose.model("Car", carSchema);