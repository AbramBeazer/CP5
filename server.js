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
const knex = require('knex')(config);
// bcrypt setup
let bcrypt = require('bcrypt');
const saltRounds = 10;

const jwt = require('jsonwebtoken');
let jwtSecret = process.env.jwtSecret;
if (jwtSecret === undefined) {
  console.log("You need to define a jwtSecret environment variable to continue.");
  knex.destroy();
  process.exit();
}


// login stuff
app.post('/api/login', (req, res) => {
  knex('users').where('username',req.body.username).first().then(user => {
      if (user === undefined) {
        res.status(403).send("Invalid credentials");
        throw new Error('abort');
      }
      return [bcrypt.compare(req.body.password, user.password),user];
    }).spread((result,user) => {
    if (result) {
       let token = jwt.sign({ id: user.username }, jwtSecret, {
        expiresIn: 86400 // expires in 24 hours
       });
      res.status(200).json({token: token});
    } else {
       res.status(403).send("Invalid credentials");
    }
    }).catch(error => {
      if(error.message !== 'abort'){
          console.log(error);
          res.status(500).json({error});
      }
  });
});

app.post('/api/register', (req, res) => {
  knex('users').where('username',req.body.username).first().then(user => {
    if (user !== undefined) {
      res.status(403).send("Username already exists");
      throw new Error('abort');
    }
    return knex('users').where('username',req.body.username).first();
  }).then(user => {
    if (user !== undefined) {
      res.status(409).send("User name already exists");
      throw new Error('abort');
    }
    return bcrypt.hash(req.body.password, saltRounds);
  }).then(hash => {
    return knex('users').insert({password: hash, username:req.body.username});
  }).then(ids => {
    return knex('users').where('username',req.body.username).first().select('username');
  }).then(user => {
      let token = jwt.sign({ id: user.username }, jwtSecret, {
      expiresIn: 86400 // expires in 24 hours
    });
    res.status(200).json({token:token});
    return;
  }).catch(error => {
    if (error.message !== 'abort') {
      console.log(error);
      res.status(500).json({ error });
    }
  });
});

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

app.get('/api/titles', verifyToken, (req, res) => {
  let username = req.body.username;
  let type = req.body.type;
  if(username !== req.userID){ res.status(403).send(); return;}
  knex('titles').where('titles.username', username).andWhere('titles.type', type).orderBy('number')
                .select('id','number','title').then(list => {
                    res.status(200).json({list:list});
                  }).catch(error => {
                    res.status(500).json({error});
                  });
});

//add item
app.post('/api/titles', verifyToken, (req, res) => {
   let username = req.body.username;
   let type = req.body.type;
   let title = req.body.title;
   let number = req.body.number;
   if(username !== req.userID){res.status(403).send("Invalid Credentials."); return;}
   return knex('titles').where('titles.username', username).andWhere('titles.title', title);
    }).then(match => {
     if(match !== undefined){res.status(409).send("Already Exists."); return;}
     knex('titles').insert({username: username, title: title, number: number, type: type});
     res.status(200).send();
   });
});

//save items
//app.post('api/titles', verifyToken, (req, res) => {});

//clear
app.delete('/api/titles', verifyToken, (req, res) => {});

//delete an item
app.delete('/api/titles:id', verifyToken, (req,res) => {
 // id of the person who is following
   let username = req.body.username;
   let id = req.params.id;
 // check this id
   if (username !== req.userID) {res.status(403).send("Invalid Credentials."); return;}
   return knex('titles').where('titles.username', username).andWhere('titles.id', id).then(title => {
     if(title === undefined){res.status(409).send("Does Not Exist"); return;}
     knex('titles').where('titles.username', username).andWhere('titles.id', id).del();
     res.status(200).send();
     return;
   });
});


app.listen(4000, () => console.log('Server listening on port 4000!'))
