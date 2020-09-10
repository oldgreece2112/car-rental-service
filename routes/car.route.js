if(process.env.NODE_ENV !== "production"){
    require("dotenv").config();
}

var express = require("express");
var Car = require("../models/car.model");
var router = express.Router();
var stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

router.get("/view", function(req, res){
    Car.find({currentlyRented: false}, function(err, foundCars){
        if(err){
            console.log(err);
        }else{
            console.log(foundCars);
            res.render("cars/view", {cars: foundCars});
        }
    });
});

router.get("/view/:id", function(req, res){
    var id = req.params.id;
    Car.findById(id, function(err, foundCar){
        if(err){
            console.log(err);
        }else{
            console.log(foundCar);
            res.render("cars/single", {car: foundCar});
        }
    });
});

router.get("/rent/:id", function(req, res){
    Car.findById(req.params.id, function(err, foundCar){
        if(err){
            console.log(err);
        }else{
            console.log(foundCar);
            res.render("cars/rent", {car: foundCar});
        }
    });
});

router.post("/rent/:id", function(req, res){
    Car.findById(req.params.id, (err, foundCar) => {
        if(err){
            console.log(err);
        }else{
            try{
                stripe.customers.create({
                    name: req.body.name,
                    address: {
                        line1: req.body.street,
                        line2: req.body.street2,
                        city: req.body.city,
                        state: req.body.state,
                        postal_code: req.body.postalCode
                    },
                    email: req.body.email,
                    source: req.body.stripeToken
                }).then(function(customer){
                    stripe.charges.create({
                        currency: "usd",
                        customer: customer.id,
                        amount: foundCar.price * 100
                    }).then(function(){
                        res.redirect("/");
                    }).catch(function(err){
                        console.log(err);
                    });
                });
            }catch(err){
                console.log(err);
            }
        }
    });
});

router.get("/add", function(req, res){
    res.render("cars/add");
});

router.post("/add", function(req, res){
    var year = req.body.year;
    var make = req.body.make;
    var model = req.body.model;
    var desc = req.body.desc;
    var notes = req.body.notes;
    var mileage = parseInt(req.body.mileage);
    var img = req.body.img;
    var price = parseInt(req.body.price);
    if(req.body.currentlyRented === "true"){
        var currentlyRented = true;
    }else if(req.body.currentlyRented === "false"){
        var currentlyRented = false;
    }

    var newCar = {
        year: year,
        make: make,
        model: model,
        desc: desc,
        notes: notes,
        mileage: mileage,
        img: img,
        currentlyRented: currentlyRented,
        price: price
    };

    Car.create(newCar, function(err, newCar){
        if(err){
            console.log(err);
        }else{
            console.log(newCar);
            res.redirect("/cars/view/" + newCar._id);
        }
    });
});

router.get("edit/:id", function(req, res){
    var id = req.params.id;

    Car.findById(id, function(err, foundCar){
        if(err){
            console.log(err);
        }else{
            console.log(foundCar);
            res.render("cars/edit", {car: foundCar});
        }
    });
});

router.post("edit/:id", function(req, res){
    var id = req.params.id;

    var year = req.body.year;
    var make = req.body.make;
    var model = req.body.model;
    var desc = req.body.desc;
    var notes = req.body.notes;
    var price = req.body.price;
    var mileage = parseInt(req.body.mileage);
    var img = req.body.img;
    if(req.body.currentlyRented === "true"){
        var currentlyRented = true;
    }else if(req.body.currentlyRented === "false"){
        var currentlyRented = false;
    }

    var updatedCar = {
        year: year,
        make: make,
        model: model,
        desc: desc,
        notes: notes,
        mileage: mileage,
        img: img,
        currentlyRented: currentlyRented,
        price: price
    }

    Car.findByIdAndUpdate(id, updatedCar, function(err, updatedCar){
        if(err){
            console.log(err);
        }else{
            console.log(updatedCar);
            res.redirect("/cars/view/" + updatedCar._id);
        }
    });
});

router.get("delete/:id", function(req, res){
    var id = req.params.id;

    Car.findByIdAndDelete(id, function(err){
        if(err){
            console.log(err);
        }else{
            console.log("Car has been deleted");
            res.redirect("/cars/view");
        }
    })
});

module.exports = router;