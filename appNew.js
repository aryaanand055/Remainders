// Importing and using express
const express = require("express")
const app = express()

//Importing and using bodyparser(for getting data from the webpage)
const bodyparser = require("body-parser")
//Allows for the use of the body parser
app.use(bodyparser.urlencoded({
    extended: true
}))

// For database
const database = require("./database")


let items = ["Sample Task"]
let workItems = ["Work Task"]

//Custom Module
const date = require(__dirname + "/date.js")
let day = date.getDay()

//Allows static files to be used
app.use(express.static("\public"))

//Sets the default view engine to ejs templates
app.set("view engine", "ejs")



//Home Route
app.route("/")
    .get((req, res) => {
        let itemsTitle = []

        database.getAll().then(e => {
            e.tasksArray.forEach(j => {
                itemsTitle.push(j.title)
            })

            res.render("list1", {
                title: "Arya",
                info: day,
                newItem: itemsTitle
            })
        })

    })
    .post((req, res) => {
        if (req.body.list === "Work") {
            workItems.push(req.body.newItem)
            res.redirect("/work")

        } else {

            items.push(req.body.newItem)
            database.insertOne("todo", req.body.newItem).then(() => {

                res.redirect("/")
            })
        }
    })

//Work route
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