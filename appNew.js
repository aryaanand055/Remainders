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

// Creating the routes
//Home Route
app.route("/")
    .get((req, res) => {
        let itemsTitle = []

        database.getAll("home")
            .then(e => {
                e.tasksArray.forEach(j => {
                    itemsTitle.push(j)
                })
                res.render("home", {
                    title: "Arya",
                    list: "home",
                    newItem: itemsTitle
                })
            }).catch(err => {
                console.error(err.stack);
                res.status(500).send("Error occured while retrieving tasks")
            })
    })
    .put((req, res) => {
        database.insertOne(req.body.title, req.body.list)
            .then((responseData) => {
                res.status(200).send(responseData);
            })
            .catch(err => {
                console.error(err.stack);
                res.status(500).send("Error occurred while inserting task");
            });
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

app.route("/modify-item")
    .put((req, res) => {
        database.updateOne(req.body.list, req.body.title, req.body.done)
            .then((responseData) => {
                res.status(200).send(responseData)
            }).catch(err => {
                console.error(err.stack);
                res.status(500).send("Error occurred while updating task");
            });
    })
    .delete((req, res) => {
        database.deleteOne(req.body.title, req.body.list)
            .then((responseData) => {
                res.status(200).send(responseData);
            })
            .catch(err => {
                console.error(err.stack);
                res.status(500).send("Error occurred while inserting task");
            });
    });

app.route("/replace-item")
    .put((req, res) => {
        database.replaceOne(req.body.list, req.body.title, req.body.newTitle)
            .then((responseData) => {
                res.status(200).send(responseData);
            })
            .catch(err => {
                console.error(err.stack);
                res.status(500).send("Error occurred while replacing task");
            });
    })

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