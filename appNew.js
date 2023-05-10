const portToListen = 5050

// Importing and using express
const express = require("express")
const app = express()

//Importing and using bodyparser(for getting data from the webpage)
const bodyparser = require("body-parser")
//Allows for the use of the body parser
app.use(bodyparser.urlencoded({
    extended: true
}))

//Allows static files to be used
app.use(express.static("\public"))

//Sets the default view engine to ejs templates
app.set("view engine", "ejs")

// For database
const database = require("./database")


//Custom Module
const date = require(__dirname + "/date.js")
let day = date.getDay()



//Home Route
app.route("/")
    .get((req, res) => {
        let itemsTitle = []

        database.getAll("tasks").then(e => {
            e.tasksArray.forEach(j => {
                itemsTitle.push(j)
            })
            res.render("home", {
                title: "Arya",
                info: day,
                newItem: itemsTitle
            })
        })

    })
    .post((req, res) => {
        if (req.body.list === "Work") {
            database.insertOne("todo", req.body.newItem, "workTasks").then(() => {
                res.redirect("/work")
            })
        } else {
            database.insertOne("todo", req.body.newItem, "tasks").then(() => {
                res.redirect("/")
            })
        }
    })

//Work route
app.route("/work")
    .get((req, res) => {
        let items = []
        database.getAll("workTasks").then(e => {
            e.tasksArray.forEach(j => {
                items.push(j)
            })

            res.render("home", {
                title: "Arya",
                info: "Work",
                newItem: items
            })
        })

    })



app.route("/about")
    .get((req, res) => {
        res.render("about")
    })



app.listen(portToListen, () => {

    console.log(`Listening on port ${portToListen}`)
})