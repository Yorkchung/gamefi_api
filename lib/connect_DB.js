var MongoClient = require('mongodb').MongoClient;

// createMongo
var createMongo = async function (client, userid, password) {
    var db = client.db("admin");
    var data = { "userid": userid, "password": password };
    const re = await db.collection("member").insertOne(data);
    console.log(re);
    return re;
}
// readMongo
var readMongo = async function (client, userid, password) {
    var db = client.db("admin");
    var query = { "userid": userid, "password": password };
    const re = await db.collection("member").find(query).toArray();
    console.log(re);
    return re;
}
// updateMongo
var updateMongo = async function (client, userid, password) {
    var db = client.db("admin");
    var query = { "userid": userid, "password": password };
    const re = await db.collection("member").updateOne({"userid":userid},{$set :query});
    console.log(re);
    return re;
}
// deleteMongo
var deleteMongo = async function (client, userid, password) {
    var db = client.db("admin");
    var query = { "userid": userid, "password": password };
    const re = await db.collection("member").deleteOne(query);
    console.log(re);
    return re;
}

module.exports = { createMongo: createMongo, readMongo: readMongo, updateMongo: updateMongo, deleteMongo: deleteMongo };