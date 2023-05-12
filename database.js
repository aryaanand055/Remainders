// Connect and configure to MongoDB Atlas
const mongoose = require("mongoose");

mongoose.connect(
    "mongodb+srv://phoenix:cookies@todolistheroku.kn4l80i.mongodb.net/data", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
);

const taskSchema = new mongoose.Schema({
    title: String,
    done: Boolean,
});

const Task = mongoose.model("task", taskSchema);
const WorkTask = mongoose.model("worktask", taskSchema);

// Function to get all tasks from the specified list
async function getAll(listToGet) {
    try {
        if (listToGet === "tasks") {
            const tasksArray = await Task.find({});
            return {
                tasksArray
            };
        } else if (listToGet === "workTasks") {
            const tasksArray = await WorkTask.find({});
            return {
                tasksArray
            };
        }
    } catch (err) {
        console.log(err.stack);
    }
}

// Function to insert a new task into the specified list
async function insertOne(title, listToAdd) {
    try {
        if (listToAdd === "tasks") {
            await Task.create({
                title: title,
                done: false
            });
        } else if (listToAdd === "workTasks") {
            await WorkTask.create({
                title: title,
                done: false
            });
        }
        return "Successfully added";
    } catch (err) {
        console.log(err.stack);
    }
}
async function updateOne(list, task, done) {
    try {
        if (list === "tasks") {
            await Task.updateOne({
                title: task
            }, {
                done: done
            });
        } else if (list === "workTasks") {
            await WorkTask.updateOne({
                title: task
            }, {
                done: done
            });
        }
        return "Successfully updated";
    } catch {
        console.log(err.stack);
    }
}
module.exports = {
    getAll,
    insertOne,
    updateOne
};