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
router.post('/register', async function (req, res, next) {
  console.log('register');
  var userid = req.body.userid || req.query.userid || req.cookies.userid;
  var password = req.body.password || req.query.password || req.cookies.password;
  const client = new MongoClient("mongodb://localhost:27017");
  console.log("userid:" + userid);
  console.log("pwd:" + password);
  try {
    await client.connect();
    const check = await conn.createMongo(client, userid, password);
    res.json({ success: true, "msg": { "status": 200, "message": `create '${userid}'` } });
  } catch (e) {
    console.log('db error');
  } finally {
    client.close();
  }

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

/* Update page. */
router.post('/update', async function (req, res, next) {
  console.log('update');
  var userid = req.body.userid || req.query.userid || req.cookies.userid;
  var password = req.body.password || req.query.password || req.cookies.password;
  const client = new MongoClient("mongodb://localhost:27017");
  console.log("userid:" + userid);
  console.log("pwd:" + password);
  try {
    await client.connect();
    const check = await conn.updateMongo(client, userid, password);
    res.json({ success: true, "msg": { "status": 200, "message": `update '${userid}'` } });
  } catch (e) {
    console.log('db error');
  } finally {
    client.close();
  }

});
/* Delete page. */
router.post('/delete', async function (req, res, next) {
  console.log('delete');
  var userid = req.body.userid || req.query.userid || req.cookies.userid;
  var password = req.body.password || req.query.password || req.cookies.password;
  const client = new MongoClient("mongodb://localhost:27017");
  console.log("userid:" + userid);
  console.log("pwd:" + password);
  try {
    await client.connect();
    const check = await conn.deleteMongo(client, userid, password);
    res.json({ success: true, "msg": { "status": 200, "message": `delete '${userid}'` } });
  } catch (e) {
    console.log('db error');
  } finally {
    client.close();
  }

});
module.exports = router;
