
const express = require('express');
const jwt = require('jsonwebtoken');
//note:  i realise the git ignore should contain the env variables, but an empty .gitignore makes it easier to get up and running for demo purposes
require('dotenv').config();
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

//create a new user
app.use('/signup', require('./routes/signup'));

//login user
app.use('/login', require('./routes/login'));

//lists
app.use('/list', require('./routes/list'));

// todos
app.use('/todos', require('./routes/todos'));

//complete a task 
app.use('/todo', require('./routes/todo'));

app.listen(3001, () => {
    console.log('listening on port: 3001');
})