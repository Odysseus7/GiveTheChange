const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const lodash = require("lodash");
const mongoose = require("mongoose");
const numeral = require("numeral");
const math = require("mathjs");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('src'))
app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/changeDB", {useNewUrlParser: true});

const userSchema = new mongoose.Schema({
    username: String,
    balance: Number
});

const User = new mongoose.model("User", userSchema);

app.get('/', (req,res) => {
    // find admin user and show balance
    User.findOne({username: "Chalita"}, (err, user) => {
        if(user) {
            username = user.username
            balance = user.balance;
            res.render("index", {
                username,
                balance: math.round(balance, 2),
                
            });
        } else {
            console.log("Admin not found");
        }
    });
});

app.post('/', async (req, res) => {
    // Only get decimal part of change
    let dec = parseInt((req.body.money).split(".")[1]);

    // check if no leading zeroes were entered
    if((req.body.money).split(".")[1].length === 1) {
        dec = parseInt((req.body.money).split(".")[1] + "0");
    }

    const cents = dec / 100;
    const change = math.round(1 - cents, 2);


    await User.findOneAndUpdate({username: "Chalita"}, {balance: balance + change});
    res.redirect('/');
});

app.listen(port, () => {
    console.log(`GiveTheChange is running on port ${port}`);
});