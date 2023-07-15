const mongoose = require("mongoose");

//Used to load .env variables
require('dotenv').config();


mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const taskSchema = new mongoose.Schema({
    title: String,
    done: Boolean,
    list: String,
});


const userSchema = new mongoose.Schema({
    fName: String,
    lName: String,
    email: String,
    password: String,
    tasks: [taskSchema]
});


const User = mongoose.model("users", userSchema);

//Returns json type with delet`ed count

async function addUser(fName, lName, userName, password) {
    try {
        const newUser = await User.create({
            fName: fName,
            lName: lName,
            email: userName,
            password: password
        })
        return newUser;

    } catch (err) {
        return {
            error: err.message
        };
    }
}

async function findUser(userName) {
    try {
        const user = await User.findOne({
            email: userName
        })
        return user
    } catch (err) {
        return {
            error: err.message
        };
    }
}


module.exports = {
    addUser,
    findUser
};