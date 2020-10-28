require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const math = require("mathjs");


const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('src'))
app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/changeDB", {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    balance: Number
});



const User = new mongoose.model("User", userSchema);

app.get('/', (req,res) => {
    res.send("hoi");
});

app.post('/', (req, res) => {
    
    
});

app.get('/login', (req, res) => {
    res.render("login");
});

app.post('/login', 

);

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", (req, res) => {

});

app.get("/overview", (req,res) => {

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

