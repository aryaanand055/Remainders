const {
    MongoClient
} = require("mongodb");

let getAll = async function (listToGet) {
    let url = "mongodb+srv://phoenix:cookies@todolistheroku.kn4l80i.mongodb.net/?retryWrites=true&w=majority";
    const client = new MongoClient(url)
    const db = client.db("data");
    let list = db.collection(listToGet);
    try {
        let tasksArray = await list.find({}).toArray();
        console.log(123)
        return {
            tasksArray
        }
    } catch (err) {
        console.log(err.stack)
    } finally {
        await client.close()
    }
}


let insertOne = async function (stat, title, listToAdd) {
    let url = "mongodb+srv://phoenix:cookies@todolistheroku.kn4l80i.mongodb.net/?retryWrites=true&w=majority";

    const client = new MongoClient(url)
    const db = client.db("data");
    let list = db.collection(listToAdd);

    try {
        if (stat === "todo") {
            await list.insertOne({
                title,
                done: false
            });
        } else if (stat === "done") {
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