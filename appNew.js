const express = require("express")
const app = express()
const bodyparser = require("body-parser")
app.use(express.static("\public"))
app.use(bodyparser.urlencoded({
    extended: true
}))
app.set("view engine", "ejs")
options = {
    weekday: "long",
    day: "2-digit",
    hour: "numeric",
    month: "short",
    minute: "numeric"
}
day = new Date().toLocaleDateString("EN-us", options)

items = ["Sample Task"]

app.route("/")
    .get((req, res) => {
        res.render("list1", {
            title: "Arya",
            date: day,
            newItem: items
        })
    })
    .post((req, res) => {
        console.log(123)
        items.push(req.body.newItem)
        res.redirect("/")
    })

app.listen(5050, () => {
    console.log("Listening on port 5050")
})