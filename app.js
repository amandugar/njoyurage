const express = require("express")
const bodyParser = require("body-parser")
const app = express();
const ejs = require("ejs")

const port = 8080;

app.use(bodyParser.urlencoded({
    extended:true
}))

app.use(express.static("public"))
app.set('view engine','ejs')

app.get("/",function(req,res){
    res.render("home")
})

app.listen(port,function(req,res){
    console.log(`Listening on port ${port}`)
})