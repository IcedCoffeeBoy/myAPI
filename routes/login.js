var express = require('express');
var router = express.Router();
const credentials = require('../credentials');
var tokenArr = require('../tokens');

router.post('/', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    for (let i = 0; i < credentials.length; i++) {
        if (email === credentials[i].email && password === credentials[i].password) {
            //login success
            var tokenGenerated = req.body.email + Date.now();
            tokenArr.push(tokenGenerated)
            return res.status(200).send({
                token: tokenGenerated
            })
        }
    }
    //fail
    res.sendStatus(401);
});


module.exports = router;
