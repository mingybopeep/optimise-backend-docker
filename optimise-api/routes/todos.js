const express = require('express'); 
const db = require('../dbConnection');
const authenticateToken = require("../middleware/authenticateToken");
let router = express.Router(); 

router
.route('/:listId')
.post(authenticateToken, (req, res) => {
    const { listId } = req.params;
    const { taskname, description, deadline } = req.body;
    if (!listId || !taskname || !description || !deadline) {
        res.status(400).send('Values missing!');
    } else {
        //check list belongs to user
        let query = `SELECT * FROM Lists WHERE list_id = ${db.escape(listId)} and creator = ${db.escape(req.user.username)};`;
        db.query(query, (err, result) => {
            if (err || result.length == 0) {
                console.log(err);
                res.status(400).send('You do not have access to this list');
            } else {
                query = `INSERT INTO Todos (todo_name, todo_description, todo_deadline, parent_list, creator) VALUES (${db.escape(taskname)}, ${db.escape(description)}, ${db.escape(deadline)}, ${db.escape(listId)}, ${db.escape(req.user.username)});`;
                db.query(query, (err, result) => {
                    if (err) {
                        res.status(400).send('ERROR');
                    } else {
                        res.status(200).send('Task added');
                    }
                })
            }
        })
    }
});

router
.route("/")
.put(authenticateToken, (req, res) => {
    let { todos } = req.body;
    let queries = [];
    let failed = false;
    todos = todos.filter(todo=>{
        return todo != null;
    });

    //create the statements
    todos.forEach(todo => {
        let { todoId, listId, taskname, description, deadline } = todo;
        if (!todoId || !listId || !taskname || !description || !deadline) {
            failed = true;
        } else {
            queries.push({
                checkListStatement: `SELECT * from Lists WHERE creator = ${db.escape(req.user.username)} and list_id = ${db.escape(listId)}`,
                updateItemStatement: `UPDATE Todos SET todo_name = ${db.escape(taskname)}, todo_description = ${db.escape(description)}, todo_deadline = ${db.escape(deadline)}, parent_list = ${db.escape(listId)} WHERE creator = ${db.escape(req.user.username)} AND todo_id = ${db.escape(todoId)}`
            });
        }
    });

    if (failed) { console.log('error'); return res.sendStatus(400) }

    let checkListStatments = queries.map(e => e.checkListStatement).join(';');
    let updateItemStatements = queries.map(e => e.updateItemStatement).join(';');

    //check user owns target list
    db.query(checkListStatments, (err, results) => {
        if (err || results.filter(result => result.length != 0).length != todos.length) {
            failed = true;
        } else {
            //process the updates 
            db.query(updateItemStatements, (err, results) => {
                if (err) {
                    res.sendStatus(400);
                } else if (results) {
                    res.sendStatus(200);
                }
            });
        }
    });
})
.delete(authenticateToken, (req, res) => {
    const { todos } = req.body;
    let queries = todos
        .map(todo => {
            return `DELETE FROM Todos WHERE todo_id = ${db.escape(todo)} and creator = ${db.escape(req.user.username)}`
        }).join(';');

    db.query(queries, (err, results) => {
        if (err || (Array.isArray(results) && results.filter(r => r.length != 0).length != todos.length)) {
            res.sendStatus(400);
        } else {
            res.sendStatus(200);
        }
    })
})
.get(authenticateToken, (req, res) => {
    let query = `SELECT * FROM Todos t JOIN Lists l ON t.parent_list = l.list_id WHERE t.creator = ${db.escape(req.user.username)};`
    db.query(query, (err, result) => {
        if (err) {
            console.log(err);
            res.sendStatus(400);
        } else {
            res.json(result);
        }
    })
});

module.exports = router; 

