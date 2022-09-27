var express = require('express');
const login = require('../lib/login.js');
var router = express.Router();
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
var conn = require('../lib/connect_DB.js');
const { hash } = require('bcrypt');
const saltRounds = 10;
var myHash = '';

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'API' });
});
/* Register page. */
router.post('/register', async function (req, res, next) {
  console.log('register');
  var userid = req.body.userid || req.query.userid || req.cookies.userid;
  var password = req.body.password || req.query.password || req.cookies.password;
  var group = req.body.group || req.query.group || req.cookies.group;
  var account = req.body.account || req.query.account || req.cookies.account;
  account = account.toLowerCase();
  var job = req.body.job || req.query.job || req.cookies.job;
  var encrypt_key = req.body.encrypt_key || req.query.encrypt_key || req.cookies.encrypt_key;
  const client = new MongoClient("mongodb://localhost:27017");
  // 加密
  bcrypt.hash(password, saltRounds).then(async function (hash) {
    // Store hash in your password DB.
    var pwd_hash = hash;
    console.log(pwd_hash);
    console.log("userid:" + userid);
    console.log("pwd:" + password);
    try {
      await client.connect();
      var query = { "userid": userid, "pwd_hash": pwd_hash, "group": group, "account": account, "encrypt_key": encrypt_key, "job": job };
      const check = await conn.createMongo(client, query);
      res.json({ success: true, "msg": { "status": 200, "message": `create '${userid}'` } });
    } catch (e) {
      console.log('db error');
    } finally {
      client.close();
    }

  });

});
/* Login page. */
router.post('/login', async function (req, res, next) {
  try {
    console.log('login');
    var userid = req.body.userid || req.query.userid || req.cookies.userid;
    var password = req.body.password || req.query.password || req.cookies.password;
    var account = req.body.account || req.query.account || req.cookies.account;
    account = account.toLowerCase();
    console.log("userid:" + userid);
    console.log("pwd:" + password);
    console.log("account:" + account);
    const client = new MongoClient("mongodb://localhost:27017");
    if (userid == null || password == null) {
      res.status(400).send({ success: false, "error": { "status": 400, "message": "帳號密碼皆需要有!" } });
    } else {
      try {
        await client.connect();
        var query = { "userid": userid, "account": account };
        const check = await conn.readMongo(client, query);
        if (check[0] != null) {
          const hash = check[0].pwd_hash;
          console.log(hash);
          // 驗證密碼
          bcrypt.compare(password, hash).then(function (resp) {
            console.log(hash);
            console.log(resp); // true
            if (resp) {
              // const token = login.getToken();
              // res.cookie('token', token);
              // res.json({ success: true, Authorization_Token: token });
              var data = {};
              data.userid = check[0].userid;
              data.account = check[0].account;
              data.job = check[0].job;
              data.group = check[0].group;
              data.encrypt_key = check[0].encrypt_key;
              res.json({ success: true, "message": data });
            } else {
              res.status(400).send({ success: false, "error": { "status": 400, "message": "帳號或密碼錯誤!" } });
            }
          });
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
router.post('/fetch', async function (req, res, next) {
  try {
    console.log('fetch');
    var account = req.body.account || req.query.account || req.cookies.account;
    account = account.toLowerCase();
    console.log("account:" + account);
    const client = new MongoClient("mongodb://localhost:27017");
    try {
      await client.connect();
      var query = { "account": account };
      const check = await conn.readMongo(client, query);
      if (check != "") {
        var data = {};
        data.userid = check[0].userid;
        data.account = check[0].account;
        data.job = check[0].job;
        data.group = check[0].group;
        data.encrypt_key = check[0].encrypt_key;
        res.json({ success: true, "message": data });
      } else {
        res.json({ success: false, "message": "not found" });
      }
    } catch (e) {
      console.log('db error');
    } finally {
      client.close();
    }

  } catch (error) {
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
    var query = { "userid": userid, "pwd_hash": pwd_hash, "hihi": "okok" };
    const check = await conn.updateMongo(client, query);
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
    var query = { "userid": userid, "pwd_hash": password };
    const check = await conn.deleteMongo(client, query);
    res.json({ success: true, "msg": { "status": 200, "message": `delete '${userid}'` } });
  } catch (e) {
    console.log('db error');
  } finally {
    client.close();
  }

});
module.exports = router;
