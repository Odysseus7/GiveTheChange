const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const _ = require("lodash");
const mongoose = require("mongoose");
const math = require("mathjs");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('src'))
app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/changeDB", {useNewUrlParser: true, useUnifiedTopology: true});

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
            balance = math.round(user.balance, 2);
            res.render("index", {
                username,
                balance
                
            });
        } else {
            console.log("Admin not found");
        }
    });
});

app.post('/', async (req, res) => {
    // check if not meant for another person
    if(!req.params.name) {
        const change = calculateChange(req.body.money);
        await User.findOneAndUpdate({username: "Chalita"}, {balance: balance + change});
        res.redirect('/');
    } else {
        const name = _.capitalize(req.params.name);
        res.redirect(`/${name}`);
    }


});

app.get("/:name", (req, res) => {
    username = _.capitalize(req.params.name);
    User.findOne({ username }, (err, foundUser) => {
        if(foundUser) {
            res.render("index", {
                username: foundUser.username,
                balance: foundUser.balance
            });
        } else {
            const user = new User({
                username,
                balance: 0
            });

            user.save();
            res.redirect(`/${username}`);
        }
    });
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

