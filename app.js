const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose")
const session = require('express-session');
const passport = require("passport");
const fs = require("fs");
const passportLocalMongoose = require("passport-local-mongoose");
const app = express();

const port = 8080;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false
}));

let usernameAuthenticated;

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb+srv://njoyurage:njoyurage@cluster0.pjnmd.mongodb.net/nJoyUrAge?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set("useCreateIndex", true);

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    username: { type: String, unique: true },
    password: String,
});

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);


passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


fs.readFile('services.json', function (err, data) {
    if (err) throw err;
    services = JSON.parse(data);
    console.log(services[0].knowMore[0].heading)
})

app.get("/", function (req, res) {
    res.render("home")
})

app.get("/about", function (req, res) {
    res.render("about")
})

app.get("/services", function (req, res) {
    res.render("services", {
        services: services
    })
})

app.get("/blogs", function (req, res) {
    res.render("blogs")
})

app.get("/admin", function (req, res) {
    if (req.isAuthenticated()) {
        res.redirect(`/admin/${usernameAuthenticated}`)
    } else {
        res.redirect("/login")
    }
})

app.get("/admin/:username", function (req, res) {
    if (req.isAuthenticated() && req.params.username === usernameAuthenticated) {
        res.render("admin")
    } else {
        res.redirect("/login")
    }
})

app.get("/login", function (req, res) {
    res.render("login")
})

app.post("/login", function (req, res) {
    let username = req.body.username;
    const user = new User({
        username: username,
        password: req.body.password
    });

    req.login(user, function (err) {
        if (err) {
            console.log(err);
        } else {
            passport.authenticate("local")(req, res, function () {
                usernameAuthenticated = username;
                res.redirect(`/admin/${username}`);
            });
        }
    });

});

app.get("/signup", function (req, res) {
    res.render("signup")
})

app.post("/signup", function (req, res) {

    User.register({ email: req.body.email, username: req.body.username, name: req.body.name }, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            res.redirect("/signup");
        } else {
            res.send("Created");
        }
    });

});

app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
});


app.listen(port, function (req, res) {
    console.log(`Listening on port ${port}`)
})