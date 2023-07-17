const mongoose = require("mongoose");

//Used to load .env variables
require('dotenv').config();

console.log(process.env)
mongoose.connect("mongodb+srv://phoenix:cookies@todolistheroku.kn4l80i.mongodb.net/data", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => {
        console.log('Connected to MongoDB successfully!');
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error.message);
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
            password: password,
            tasks: []
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

//Returns the array of the list item
async function getAll(email) {
    try {
        const user = await User.findOne({
            email: email
        });
        let tasksArray = []
        user.tasks.forEach(a => {
            tasksArray.push(a)
        })
        return {
            tasksArray: tasksArray
        }

    } catch (err) {
        console.error(err.stack);
        throw new Error("Could not get tasks")
    }
}
//Returns a json type msg 
// async function insertOne(title, list) {
//     try {
//         const taskCreate = await Task.create({
//             title,
//             done: false,
//             list
//         })
//         return {
//             msg: `The task "${taskCreate.title}" in the list "${taskCreate.list}" has been successfully added to the database.`
//         }


//     } catch (err) {
//         console.error(err.stack);
//         throw new Error("Could not add task")

//     }
// }
async function insertOne(email, taskDetails) {
    try {
        const user = await User.findOne({
            email: email
        });
        if (!user) {
            return {
                error: "User not found"
            };
        }

        // Create a new task using the provided details
        const newTask = {
            title: taskDetails.title,
            done: taskDetails.done || false,
            list: taskDetails.list || ""
        };

        // Push the new task to the tasks array of the user
        user.tasks.push(newTask);

        // Save the updated user object to the database
        savedUser = await user.save();
        const addedTaskId = savedUser.tasks[savedUser.tasks.length - 1]._id.toString();
        return {
            success: "Task added to the user successfully",
            user: user,
            id: addedTaskId
        };
    } catch (err) {
        return {
            error: err.message
        };
    }
}
//Returns json type with deleted count
async function deleteOne(email, taskId) {
    try {
        const user = await User.findOne({
            email: email
        });
        const taskIndex = user.tasks.findIndex(task => task._id.toString() === taskId);
        if (taskIndex === -1) {
            return {
                error: "Task not found"
            };
        }

        // Remove the task from the tasks array using splice
        user.tasks.splice(taskIndex, 1)
        await user.save()
        return {
            success: "Task deleted successfully",
            user: user
        };
    } catch (err) {
        return {
            error: err.message
        };
    }
}

//Returns json type with deleted count
async function updateOne(email, taskId, done) {
    try {
        const user = await User.findOne({
            email: email
        });
        const task = user.tasks.find(task => task._id.toString() === taskId);
        if (task === -1) {
            return {
                error: "Task not found"
            };
        }

        // Remove the task from the tasks array using splice
        task.done = done
        await user.save()
        return {
            success: "Task updated successfully",
            user: user
        };
    } catch (err) {
        return {
            error: err.message
        };
    }
}
async function replaceOne(email, taskId, title) {
    try {
        const user = await User.findOne({
            email: email
        })
        const task = user.tasks.find(task => task._id.toString() === taskId)

        task.title = title
        console.log(task.title)
        await user.save()
        return {
            msg: "Successfully replaced",
            user
        };
    } catch (err) {
        console.error(err.stack);
        return {
            error: "Could not replace task"
        };
    }
}


// //Returns a json type msg
// async function updateOne(list, title, done) {
//     try {
//         await Task.updateOne({
//             title,
//             list
//         }, {
//             done
//         })
//         return {
//             msg: "Successfully updated"
//         };
//     } catch (err) {
//         console.error(err.stack);
//         return {
//             error: "Could not update task"
//         };
//     }
// }
// async function replaceOne(list, newTitle, title) {
//     try {
//         await Task.updateOne({
//             title: title,
//             list: list
//         }, {
//             $set: {
//                 title: newTitle
//             }
//         });
//         return {
//             msg: "Successfully replaced"
//         };
//     } catch (err) {
//         console.error(err.stack);
//         return {
//             error: "Could not replace task"
//         };
//     }
// }



// module.exports = {
//     getAll,
//     insertOne,
//     updateOne,
//     deleteOne,
//     replaceOne
// };

module.exports = {
    addUser,
    findUser,
    insertOne,
    getAll,
    deleteOne,
    updateOne,
    replaceOne
};