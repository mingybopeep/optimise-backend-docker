const express = require('express'); 
const db = require('../dbConnection');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
let router = express.Router(); 

router
.route('/')
.post(async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).send('Insufficient credentials supplied');
    } else {
        let query = `SELECT * FROM Users WHERE username = ${db.escape(username)};`;
        db.query(query, async (err, result) => {
            if (err) {
                res.sendStatus(400);
            } else {
                try {
                    //get check the password
                    const success = await bcrypt.compare(password, result[0].password);
                    if (success) {
                        //generate a token
                        let token = jwt.sign({ username: result[0].username }, process.env.JWT_SECRET);
                        res.json({ token });
                    } else {
                        res.sendStatus(400);
                    }
                } catch {
                    res.status(400).send('Wrong username/password combination');
                }
            }
        });

    }
});

module.exports = router;