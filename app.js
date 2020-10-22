const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const lodash = require("lodash");
const mongoose = require("mongoose");

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
                balance
            });
        } else {
            console.log("Admin not found");
        }
    });
});

app.post('/', (req, res) => {
    console.log((req.body.money).split("."));
});

app.listen(port, () => {
    console.log(`GiveTheChange is running on port ${port}`);
});