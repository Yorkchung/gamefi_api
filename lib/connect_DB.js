var MongoClient = require('mongodb').MongoClient;

// Connect to the db
var readMongo = async function (client, userid, password) {
    var db = client.db("admin");
    var query = { "userid": userid, "password": password };
    const re = await db.collection("member").find(query).toArray();
    console.log(re);
    return re;
}

module.exports = { readMongo: readMongo };