require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

const passportLocalMongoose = require('passport-local-mongoose');
const math = require("mathjs");
const { re } = require('mathjs');


const app = express();
let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}

const expressSession = require('express-session')({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false,
    maxAge: 60000 }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSession);
app.use(express.static('src'));
app.set('view engine', 'ejs');

/*  PASSPORT SETUP  */

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(`mongodb+srv://root:${process.env.MONGODB_PASSWORD}@cluster0.hrhid.mongodb.net/${process.env.MONGODB_NAME}?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    balance: 0
});

userSchema.plugin(passportLocalMongoose, {
    selectFields: "username password balance"
});
const User = new mongoose.model("User", userSchema);

/* PASSPORT LOCAL AUTHENTICATION */

passport.use(new LocalStrategy(
    function(username, password, done) {
      User.findOne({ username: username }, function(err, user) {
        if (err) { return done(err); }
        return done(null, user);
      });
    }
  ));

passport.serializeUser(function(user, cb) {
    cb(null, user.id);
});
  
passport.deserializeUser(function(id, cb) {
    User.findById(id, function (err, user) {
        if (err) { return cb(err); }
        cb(null, user);
    });
});

app.get('/', (req,res) => {
    if(req.isAuthenticated()) {
        res.render("overview", {
            username: req.user.username,
            balance: req.user.balance
        });
    } else {
        res.redirect("/login")
    }
});

app.get('/login', (req, res) => {
    res.render("login");
});

app.post('/login',
  passport.authenticate('local'),
  function(req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    res.redirect("/overview");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", (req, res) => {
    User.register({username: req.body.username, balance: 0, active: true}, req.body.password, function(err, user) {
        if (err) { console.log(err) }
        var authenticate = User.authenticate();
        authenticate(req.body.username, req.body.password, function(err, result) {
          if (err) { console.log(err) }
          // Value 'result' is set to false. The user could not be authenticated since the user is not active
          req.login(user, function(err) {
            if (err) { return next(err); }
            return res.redirect("/overview");
          });
          
        });
      });
});

app.get("/overview", (req, res) => {
    if(req.isAuthenticated()) {
        res.render("overview", {
            username: req.user.username,
            balance: req.user.balance
        });
    } else {
        res.redirect("/login")
    }
});

app.post("/overview", async (req, res) => {
    if(req.isAuthenticated()) {
        let change = calculateChange(req.body.money);
        try {
            await User.findOneAndUpdate({username: req.user.username }, {balance: req.user.balance + change});
            res.redirect("/overview");
        } catch(error) {
            console.log(error);
        }
                
    } else {
        res.redirect("/login");
    }
    
});

app.get("/logout", (req, res) => {
    req.logout();
    res.redirect('/login');

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

