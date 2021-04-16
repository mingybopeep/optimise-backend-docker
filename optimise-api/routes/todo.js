const express = require('express'); 
const db = require('../dbConnection');
const authenticateToken = require("../middleware/authenticateToken");
let router = express.Router(); 

router
.route('/complete')
.put(authenticateToken, (req, res) => {
    let { id } = req.body;
    if (!id) {
        res.sendStatus(400)
    } else {
        let query = `UPDATE Todos SET completed = 1 WHERE todo_id = ${db.escape(id)} AND creator = ${db.escape(req.user.username)}`;
        db.query(query, (err, result) => {
            if (err) {
                res.sendStatus(400);
            } else {
                console.log('TASK COMPLETED');
                res.sendStatus(200);
            }
        })
    }
});

module.exports = router;