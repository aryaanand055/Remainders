const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.set("view engine", "ejs")


let today = new Date()
day = today.getDay()



app.get("/", (req, res) => {
    // res.sendFile(__dirname + "/index.html")
    let name = "Stephen Strange"
    res.render("list", {
        title: name
    })
})
app.get(/.css/, (req, res) => {
    res.sendFile(__dirname + "/rem2.css")
})
app.get("/rem2.js", (req, res) => {
    res.sendFile(__dirname + "/rem2.js")
})
app.listen(9909, () => {
    console.log("App startd at port 9909");
})