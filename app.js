const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const math = require("mathjs");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const session = require('express-session');
require('dotenv').config()


const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('src'))
app.set('view engine', 'ejs');

// create session
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/changeDB", {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    balance: Number
});

User.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/', (req,res) => {
    res.render("login");
});

app.post('/', (req, res) => {
    
    
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", (req, res) => {


    
});


function calculateChange(amount) {
    // Only get decimal part of change
    let dec = parseInt((amount).split(".")[1]);

    // check if no leading zeroes were entered
    if((amount).split(".")[1].length === 1) {
        dec = parseInt((amount).split(".")[1] + "0");
    }

    const cents = dec / 100;
    const change = math.round(1 - cents, 2);
    return change;
}

app.listen(port, () => {
    console.log(`GiveTheChange is running on port ${port}`);
});

