var express = require('express');
const login = require('../lib/login.js');
var router = express.Router();
const { MongoClient } = require('mongodb');
var conn = require('../lib/connect_DB.js');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'API' });
});
/* Register page. */
router.post('/register', function (req, res, next) {

  var userid = req.body.userid || req.query.userid || req.cookies.userid;
  var password = req.body.password || req.query.password || req.cookies.password;
  console.log("userid:" + userid);
  console.log("pwd:" + password);
  // Connect to the db
  MongoClient.connect("mongodb://localhost:27017", function (err, client) {
    if (err) throw err;
    var db = client.db("admin");
    var data = { "userid": userid, "password": password };
    db.collection("member").insertOne(data, function (err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      client.close();
    });
    res.status(200).send({ success: true, "msg": { "status": 200, "message": "mongodb is running!!" } });
  });

});
/* Login page. */
router.post('/login', async function (req, res, next) {
  try {
    console.log('login');
    var userid = req.body.userid || req.query.userid || req.cookies.userid;
    var password = req.body.password || req.query.password || req.cookies.password;
    console.log("userid:" + userid);
    console.log("pwd:" + password);
    const client = new MongoClient("mongodb://localhost:27017");
    if (userid == null || password == null) {
      res.status(400).send({ success: false, "error": { "status": 400, "message": "帳號密碼皆需要有!" } });
    } else {
      try {
        await client.connect();
        console.log('good');
        const check = await conn.readMongo(client, userid, password);
        if (check.pop() != null) {
          const token = login.getToken();
          res.cookie('token', token);
          res.json({ success: true, Authorization_Token: token });
        } else {
          res.status(400).send({ success: false, "error": { "status": 400, "message": "帳號或密碼錯誤!" } });
        }
      } catch (e) {
        console.log('db error');
      } finally {
        client.close();
      }
    }
  } catch (error) {
  console.log(error);
  res.status(500).send({ "error": { "status": 500, "message": "server error!" } });
}
});
/* Fetch Data page. */
router.post('/fetch', function (req, res, next) {
  try {
    var update = require('./update.js');
    var token = req.body.token || req.query.token || req.cookies.token;
    var id = req.body.id || req.query.id || req.cookies.id;
    var content = req.body.content || req.query.content || req.cookies.content;
    console.log('updatedata');
    if (login.checkUser(token) == true) {
      if (content == null) {
        res.status(400).send({ "error": { "status": 400, "message": "content為空值" } });
      } else if (id == null) {
        res.status(400).send({ "error": { "status": 400, "message": "id為空值" } });
      } else {
        update.updatedata(id, content).then(function (data) {
          res.status(data.status).send(data.data);
        });
      }
    } else
      res.status(403).send({ "error": { "status": 403, "message": "金鑰存取錯誤!" } });
  } catch (error) {
    console.log('update wrong')
    console.log(error);
    res.status(500).send({ "error": { "status": 500, "message": "server error!" } });
  }
});

module.exports = router;
