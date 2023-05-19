const mongoose = require("mongoose");
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

const Task = mongoose.model("task", taskSchema);


//Returns the array of the list item
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
        throw new Error("Could not get tasks")
    }
}
//Returns a json type msg 
async function insertOne(title, list) {
    try {
        const taskCreate = await Task.create({
            title,
            done: false,
            list
        })
        return {
            msg: `The task "${taskCreate.title}" in the list "${taskCreate.list}" has been successfully added to the database.`
        }


    } catch (err) {
        console.error(err.stack);
        throw new Error("Could not add task")

    }
}

//Returns a json type msg
async function updateOne(list, title, done) {
    try {
        await Task.updateOne({
            title,
            list
        }, {
            done
        })
        return {
            msg: "Successfully updated"
        };
    } catch (err) {
        console.error(err.stack);
        return {
            error: "Could not update task"
        };
    }
}
async function replaceOne(list, newTitle, title) {
    try {
        await Task.updateOne({
            title: title,
            list: list
        }, {
            $set: {
                title: newTitle
            }
        });
        return {
            msg: "Successfully replaced"
        };
    } catch (err) {
        console.error(err.stack);
        return {
            error: "Could not replace task"
        };
    }
}

//Returns json type with deleted count
async function deleteOne(title, list) {
    try {
        const taskDelete = await Task.deleteOne({
            title: title,
            list: list
        })
        if (taskDelete.deletedCount === 0) {
            throw new Error(
                "Error occurred while inserting task in the DB"
            )
        } else {
            return {
                msg: `${taskDelete.deletedCount} elements has been deleted.`
            }
        }
    } catch (err) {
        return err.stack
    }
}


module.exports = {
    getAll,
    insertOne,
    updateOne,
    deleteOne,
    replaceOne
};