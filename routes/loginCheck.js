var tokenArr = require('../tokens');

function loginCheck (req, res, next) {
    var token = req.headers.token;
    for (let i = 0; i < tokenArr.length; i++) {
        if (token === tokenArr[i]) {
            return next()
        }
    }
    //fail 
    res.sendStatus(401);
}

module.exports = loginCheck; 
