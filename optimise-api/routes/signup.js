const express = require('express'); 
const db = require('../dbConnection');
const bcrypt = require('bcrypt');
let router = express.Router(); 

router
.route('/')
.post(async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).send('Insufficient credentials supplied');
    } else {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            //hash the password
            let query = `INSERT INTO Users (username, password) VALUES (${db.escape(username)},${db.escape(hashedPassword)});`
            db.query(query, (err, result) => {
                if (err) {
                    res.status(409).send('There was an issue handling your request, try a different combination');
                } else {
                    res.sendStatus(200);
                }
            })
        } catch {
            res.sendStatus(500);
        }
    }
});

module.exports = router;