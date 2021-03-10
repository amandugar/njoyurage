const express = require("express")
const bodyParser = require("body-parser")
const app = express();
const ejs = require("ejs")
const fs = require("fs")

const port = 8080;



app.use(bodyParser.urlencoded({
    extended: true
}))

let services;
app.use(express.static("public"))
app.set('view engine', 'ejs')

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
    res.render("services",{
        services:services
    })
})

app.get("/blogs", function (req, res) {
    res.render("blogs")
})

app.listen(port, function (req, res) {
    console.log(`Listening on port ${port}`)
})