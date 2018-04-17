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

const jwt = require('jsonwebtoken');
let jwtSecret = process.env.jwtSecret;
if (jwtSecret === undefined) {
  console.log("You need to define a jwtSecret environment variable to continue.");
  knex.destroy();
  process.exit();
}


/* login stuff

    if (result) {
       let token = jwt.sign({ id: user.id }, jwtSecret, {
        expiresIn: 86400 // expires in 24 hours
       });
      res.status(200).json({user:{username:user.username,name:user.name,id:user.id},token:token});
    } else {
       res.status(403).send("Invalid credentials");
    }

*/

/*
 let token = jwt.sign({ id: user.id }, jwtSecret, {
     expiresIn: 86400 // expires in 24 hours
    });
    res.status(200).json({user:user,token:token});

*/

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token)
    return res.status(403).send({ error: 'No token provided.' });
  jwt.verify(token, jwtSecret, function(err, decoded) {
    if (err)
      return res.status(500).send({ error: 'Failed to authenticate token.' });
    // if everything good, save to request for use in other routes
    req.userID = decoded.id;
    next();
  });
}

app.get

app.post

app.delete('/api/books/:token', verifyToken, (req,res) => {
 // id of the person who is following
   let token = parseInt(req.params.token);
 // check this id
   if (token !== req.token) {
     res.status(403).send();
     return;
   }
});


app.listen(4000, () => console.log('Server listening on port 4000!'))