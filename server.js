/*---------- Dependencies ----------*/ 

const dotenv = require("dotenv");
dotenv.config();
const express = require('express');
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");

const app = express();

/*---------- DB connection ----------*/ 

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.cars}.`);
});

const Car = require("./models/car.js");

app.use(express.urlencoded({ extended: false }));

/*---------- Middleware ----------*/ 

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method")); 
app.use(morgan("dev")); 

/*---------- Routes ----------*/ 

app.get("/", async (req, res) => {
  res.render("index.ejs");
});

app.get("/cars", async (req, res) => {
  const allCars = await Car.find();
  console.log(allCars);
  res.render("cars/catalog.ejs", { cars: allCars });
});

app.get("/cars/new", (req, res) => {
  res.render("cars/new.ejs");
});

app.post("/cars", async (req, res) => {
  if (req.body.currentCar === "on") {
    req.body.currentCar = true;
  } else {
    req.body.currentCar = false;
  }
  await Car.create(req.body);
  res.redirect("/cars");
})

app.get("/cars/:carId", async (req, res) => {
  const foundCar = await Car.findById(req.params.carId);
  res.render("cars/display.ejs", {car: foundCar});
});





app.listen(3000, () => {
  console.log('Listening on port 3000');
});