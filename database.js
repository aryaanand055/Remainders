const {
    MongoClient
} = require("mongodb");


let getAll = async function () {
    const client = new MongoClient("mongodb+srv://Phoenix:Cookies@to-do-list.lifrbmd.mongodb.net/?retryWrites=true&w=majority")
    const db = client.db("To-Do-List");
    let list = db.collection("tasks");

    try {
        let tasksArray = await list.find({}).toArray();
        return {
            tasksArray
        }
    } catch (err) {
        console.log(err.stack)
    } finally {
        await client.close()
    }
}


let insertOne = async function (listToAdd, title) {
    const client = new MongoClient("mongodb+srv://Phoenix:Cookies@to-do-list.lifrbmd.mongodb.net/?retryWrites=true&w=majority")
    const db = client.db("To-Do-List");
    let list = db.collection("tasks");

    try {
        if (listToAdd === "todo") {
            await list.insertOne({
                title,
                done: false
            });
        } else if (listToAdd === "done") {
            await list.insertOne({
                title,
                done: true
            });
        }
        return "Successfully added"

    } catch (err) {
        console.log(err.stack)
    } finally {
        await client.close()
    }
}

module.exports = {
    getAll,
    insertOne
}