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

//Allows to recieve data from the fetch method
app.use(express.json());

// For database
const database = require("./database")


// //Custom Module
// const date = require(__dirname + "/date.js")
// let day = date.getDay()


//Home Route
app.route("/")
    .get((req, res) => {
        let itemsTitle = []

        database.getAll("home").then(e => {
            e.tasksArray.forEach(j => {
                itemsTitle.push(j)
            })
            res.render("home", {
                title: "Arya",
                list: "home",
                newItem: itemsTitle
            })
        })

    })
    .put((req, res) => {
        console.log(req.body)
        if (req.body.list === "work") {
            database.insertOne(req.body.title, "work").then(() => {
                // res.redirect("/work")
            })
        } else {
            database.insertOne(req.body.title, "home").then(() => {
                // res.redirect("/")
            })
        }
        res.sendStatus(200)
    })

//Work route
app.route("/work")
    .get((req, res) => {
        let items = []

        database.getAll("work").then(e => {
            e.tasksArray.forEach(j => {
                items.push(j)
            })

            res.render("home", {
                title: "Arya",
                list: "work",
                newItem: items
            })
        })
    })

app.route("/about")
    .get((req, res) => {
        res.render("about")
    })

app.route("/update-item")
    .put((req, res) => {
        console.log(req.body.list, req.body.title, req.body.done)
        database.updateOne(req.body.list, req.body.title, req.body.done)
        res.sendStatus(200);
    });


app.use((req, res, next) => {
    res.render("404");
});

// Handles errors that occurs anywhere
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});
app.listen(portToListen, () => {
    console.log(`Listening on port ${portToListen}`)
})