// Importing and using express
const express = require("express")


const app = express()

//Importing and using bodyparser(for getting data from the webpage)
const bodyparser = require("body-parser")
//Allows for the use of the body parser
app.use(bodyparser.urlencoded({
    extended: true
}))

//Custom Module
const date = require(__dirname + "/date.js")

//Allows static files to be used
app.use(express.static("\public"))

//Sets the default view engine to ejs templates
app.set("view engine", "ejs")


items = ["Sample Task"]
workItems = ["Work Task"]


app.route("/")
    .get((req, res) => {
        res.render("list1", {
            title: "Arya",
            info: day,
            newItem: items
        })
    })
    .post((req, res) => {
        console.log(req.body)
        if (req.body.list === "Work") {
            workItems.push(req.body.newItem)
            res.redirect("/work")

        } else {

            items.push(req.body.newItem)
            res.redirect("/")
        }
    })
app.route("/work")
    .get((req, res) => {
        res.render("list1", {
            title: "Arya",
            info: "Work",
            newItem: workItems
        })
    })



app.route("/about")
    .get((req, res) => {
        res.render("about")
    })

app.listen(5050, () => {

    console.log("Listening on port 5050")
})