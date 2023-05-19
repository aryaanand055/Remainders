const portToListen = 5050

// Importing and using express
const express = require("express")
const app = express()

// For database
const database = require("./database")

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
                    title: "Stephen",
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




// Import necessary modules:
const User = require("./user").User;
// const passportLocalMongoose = require("passport-local-mongoose")
const passport = require("passport");
const LocalStrategy = require("passport-local");

// Configure Passport to use the LocalStrategy for authentication:
passport.use(new LocalStrategy(User.authenticate()));

// Configure Passport serialization and deserialization of user information:
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Set up the express - session middleware for session management:
app.use(require("express-session")({
    secret: "Rusty is a dog",
    resave: false,
    saveUninitialized: false
}));

// Initialize Passport and add it as middleware to the application:
app.use(passport.initialize());

// Enable Passport to use session - based authentication:
app.use(passport.session());

const userDb = require("./user")







app.route("/login")
    .get((req, res) => {
        res.render("login")
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
                        // res.render("home");
                        res.send("Password match. User authenticated")
                    } else {
                        res.status(400).json({
                            error: "password doesn't match"
                        });
                    }
                } else {
                    res.status(400).json({
                        error: "User doesn't exist"
                    });
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
                res.send(data)
            })

        } catch (error) {
            res.status(400).json({
                error
            });
        }

    })



app.route("/logout").get((req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err); // Remove this line
        }
        res.redirect('/');
    });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect("/login");
}


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