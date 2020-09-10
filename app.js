if (process.env.NODE_ENV !== "production"){
    require("dotenv").config();
}

var express = require("express");
var session = require("express-session");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var flash = require("connect-flash");
var app = express();

var PORT = process.env.PORT || 8000;

var indexRoute = require("./routes/index.route");
var carRoute = require("./routes/car.route");

mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
var db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", function(){
    console.log("Connected to database!");
});

app.use(express.static(__dirname + "/public"))
app.set("view engine", "ejs");
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());

app.use(function(req, res, next){
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoute);
app.use("/cars", carRoute);

app.listen(PORT, process.env.IP, function(){
    console.log("Server is running on port " + PORT);
});