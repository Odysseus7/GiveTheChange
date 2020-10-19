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

app.get('/', (req,res) => {
    const name = "root";
    res.render("index", {
        name
    });
});

app.listen(port, () => {
    console.log(`GiveTheChange is running on port ${port}`);
});