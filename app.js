const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const _ = require("lodash");
const bcrypt = require("bcrypt");
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
    res.render("login");
});

app.post('/', (req, res) => {
    
    // find user
    User.findOne({username: req.body.username}, (err, user) => {
        if(user) {
            // check if password is valid
            bcrypt.compare(req.body.password, user.password, function(err, result) {
                if(result) {
                    res.render("overview", {
                        username: user.username,
                        balance: user.balance
                    });
                }
            });
        } else {
            console.log("login failed");
        }
    });
    
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({username}, (err, user) => {
        // if user doesn't exist, create user
        if(!user) {
            bcrypt.hash(password, 10, function(err, hash) {
                // Store hash in your password DB.
                const user = new User({
                    username,
                    password: hash,
                    balance: 0
                });
        
                try {
                    user.save();
                    res.render("overview", {
                        username: user.username,
                        balance: user.balance
                    })
                } catch (e) {
                    console.log(e);
                    res.redirect("register");
                }
            });
        } else {
            console.log("This user already exists.");
            res.redirect("register");
        }
    })

    

    
    
    
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

