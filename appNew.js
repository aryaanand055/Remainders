const portToListen = 5050

// Importing and using express
const express = require("express")
const app = express()

// For database
const database = require("./user")

//Importing and using bodyparser(for getting data from the webpage)
const bodyparser = require("body-parser")

//Login Data
let loginData = {
    loggedIn: false,
    email: "",
    fName: "",
    lName: "",

}

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


// Creating the routes
//Home Route
app.route("/")
    .get((req, res) => {
        if (loginData.loggedIn === true) {
            let itemsTitle = []
            database.getAll(loginData.email)
                .then(e => {
                    e.tasksArray.forEach(j => {
                        if (j.list === "home") {
                            itemsTitle.push(j)
                        }
                    })
                    console.log(itemsTitle)
                    res.render("home", {
                        title: loginData.fName,
                        list: "home",
                        newItem: itemsTitle
                    })
                }).catch(err => {
                    console.error(err.stack);
                    res.render("error", {
                        msg: "Error Occured while retrieving tasks",
                        link1: "logout"
                    })
                    // res.status(500).send("Error occured while retrieving tasks")
                })
        } else {
            res.redirect('/login')
        }
    })
    .put((req, res) => {
        listDetails = {
            title: req.body.title,
            done: false,
            list: req.body.list
        }
        database.insertOne(loginData.email, listDetails)
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
        if (loginData.loggedIn === true) {
            let itemsTitle = []
            database.getAll(loginData.email)
                .then(e => {
                    e.tasksArray.forEach(j => {
                        if (j.list === "work") {
                            itemsTitle.push(j)
                        }
                    })
                    res.render("home", {
                        title: loginData.fName,
                        list: "work",
                        newItem: itemsTitle
                    })
                }).catch(err => {
                    console.error(err.stack);
                    res.status(500).send("Error occured while retrieving tasks")
                })
        } else {
            res.redirect('/login')
        }
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
        console.log(req.body.id)
        database.deleteOne(loginData.email, req.body.id)
            .then((responseData) => {
                res.status(200).send(responseData);
            })
            .catch(err => {
                console.error(err.stack);
                res.status(500).send("Error occurred while deleting task");
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

app.route("/logout")
    .get((req, res) => {
        // Clear session data and redirect to login page
        loginData.loggedIn = false
        res.redirect("/")
    })


// Import necessary modules:

const userDb = require("./user")



app.route("/login")
    .get((req, res) => {
        if (loginData.loggedIn === true) {
            res.redirect("/")
        } else {
            res.render("login")
        }
    })
    .post((req, res) => {
        const {
            email,
            password
        } = req.body;
        try {
            let user;
            userDb.findUser(email).then(data => {
                user = data
                if (user) {
                    //check if password matches
                    const result = password === user.password;
                    if (result === true) {
                        // res.render("home")
                        loginData.loggedIn = true
                        loginData.email = user.email
                        loginData.fName = user.fName
                        loginData.lName = user.lName
                        res.redirect("/")
                    } else {
                        res.status(400).json({
                            error: "password doesn't match"
                        });
                    }
                } else {
                    res.render("error", {
                        msg: "User doesn't exist",
                        link1: "signup"
                    })

                }
            });
        } catch (error) {
            res.status(400).json({
                error
            });
        }
    })

app.route("/signup")
    .get((req, res) => {
        res.render("signup")
    })
    .post((req, res) => {
        const {
            fName,
            lName,
            userEmail,
            userPassword
        } = req.body;
        try {
            console.log(req.body)
            userDb.addUser(fName, lName, userEmail, userPassword).then(data => {
                res.redirect("/login")
            }).catch(err => {
                console.log(err)
                res.status(400).json({
                    error: "User already exists"
                })
            })

        } catch (error) {
            res.status(400).json({
                error
            });
        }

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