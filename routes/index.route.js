var express = require("express");
var router = express.Router();
var Car = require("../models/car.model");

router.get("/", function(req, res){
    res.render("index/index");
});

module.exports = router;