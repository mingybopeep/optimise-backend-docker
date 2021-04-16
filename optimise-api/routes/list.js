const express = require('express'); 
const db = require('../dbConnection');
const authenticateToken = require("../middleware/authenticateToken");
let router = express.Router(); 

router
.route('/')
.post(authenticateToken, (req, res) => {
    const { listName } = req.body;
    if (!listName) {
        res.status(400).send('List name missing');
    } else {
        let query = `INSERT INTO Lists (list_name, creator) VALUES (${db.escape(listName)}, '${db.escape(req.user.username)});`;
        db.query(query, (err, result) => {
            if (err) {
                res.status(400).send('New List failed');
            } else {
                res.status(200).send('New list created');
            }
        })
    }
})
.get(authenticateToken, (req, res) => {
    let query = `SELECT * FROM Lists WHERE creator = ${db.escape(req.user.username)};`;
    db.query(query, (err, results) => {
        if (err) {
            res.sendStatus(400)
        } else {
            res.json(results)
        }
    })
})
.delete(authenticateToken, (req, res) => {
    const { listIds } = req.body
    if (!listIds) {
        res.status(400).send('List name missing');
    } else {
        let query = `DELETE FROM Lists WHERE list_id in (${listIds.join(', ')}) and creator = ${db.escape(req.user.username)}`;
        db.query(query, (err, result) => {
            if (err) {
                res.status(400).send('Deletion failed');
            } else {
                res.status(200).send('Delete successful');
            }
        });
    }
})

module.exports = router;