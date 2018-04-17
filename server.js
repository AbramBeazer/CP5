//Do backend stuff, REST API
// Express Setup
const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'))

// Knex Setup
const env = process.env.NODE_ENV || 'development';
const config = require('./knexfile')[env];  
const db = require('knex')(config);

app.get

app.post

app.delete



app.listen(4000, () => console.log('Server listening on port 4000!'))