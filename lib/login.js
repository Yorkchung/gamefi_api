const jwt = require('jsonwebtoken');
const config = require('../config/config.js');

module.exports = {
    getToken: function () {
        // 建立 Token
        const token = jwt.sign({ _id: config.username }, config.SECRET, { expiresIn: '1000 seconds' });
        return token;
    },
    checkUser: function (token) {
        try {
            var decode = jwt.verify(token, config.SECRET);
            if (decode != null && decode._id == config.username) {
                return true;
            } else {
                return false;
            }
        } catch (e) {
            return false;
        }
    }
}