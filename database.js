const mongoose = require("mongoose");
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const taskSchema = new mongoose.Schema({
    title: String,
    done: Boolean,
    list: String,
});

const Task = mongoose.model("task", taskSchema);

async function getAll(listToGet) {
    try {
        const tasksArray = await Task.find({
            list: listToGet
        });
        return {
            tasksArray
        };
    } catch (err) {
        console.error(err.stack);
        return {
            error: "Could not get tasks"
        };
    }
}

async function insertOne(title, list) {
    try {
        await Task.create({
            title,
            done: false,
            list
        });
        return "Successfully added";
    } catch (err) {
        console.error(err.stack);
        return {
            error: "Could not add task"
        };
    }
}

async function updateOne(list, title, done) {
    try {
        await Task.updateOne({
            title,
            list
        }, {
            done
        });
        return "Successfully updated";
    } catch (err) {
        console.error(err.stack);
        return {
            error: "Could not update task"
        };
    }
}

module.exports = {
    getAll,
    insertOne,
    updateOne,
};