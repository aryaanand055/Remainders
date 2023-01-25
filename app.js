const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.set("view engine", "ejs")


let options = {
    weekday: "long",
    day: "2-digit",
    hour: "numeric",
    month: "short",
    minute: "numeric",
}


day = new Date().toLocaleDateString("EN-us", options)

app.get("/", (req, res) => {
    // res.sendFile(__dirname + "/index.html")
    let name = "Arya"
    res.render("list", {
        title: name,
        day: day
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