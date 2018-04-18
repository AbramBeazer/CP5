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

/*
const verifyToken = (req, res, next) => {
console.log(req.headers['authorization']);
  var token = req.headers['authorization'];
  if (!token){ console.log("HERE");
    return res.status(403).send({ error: 'No token provided.' });}
console.log("BEFORE");
  jwt.verify(token, jwtSecret, function(err, decoded) {
    if (err)
      return res.status(500).send({ error: 'Failed to authenticate token.' });
    // if everything good, save to request for use in other routes
    req.userID = decoded.id;
    next();
  });
}
*/

app.get('/api/titles/:username/type/:type',  (req, res) => {
  let username = req.params.username;
  let type = req.params.type;
  console.log("HELLO");
  console.log(username);
  console.log(type);
 // if(username !== req.userID){ console.log("W"); res.status(403).send("HERE"); return;}
    knex('titles').where('titles.username', username).andWhere('titles.type', type).orderBy('number')
                .select('number','title', 'type').then(list => {
                    res.status(200).json({list:list});
                  }).catch(error => {
                    res.status(500).json({error});
                  });
});

//add item
app.post('/api/titles',  (req, res) => {
   let username = req.body.username;
   let type = req.body.type;
   let title = req.body.title;
   let number = parseInt(req.body.number);
  // console.log(req.headers['authorization']);
 //  if(username !== req.userID){res.status(403).send("Invalid Credentials"); return;}
   knex('titles').where('titles.username', username).andWhere('titles.title', title).first().then(match => {
     if(match !== undefined){res.status(409).send("Already Exists"); return;}
     knex('titles').insert({username: username, title: title, number: number, type: type}).then(list => {
     console.log("X");
     res.status(200).send();
     return;
	});
   });
});

//save items
//app.post('api/titles', (req, res) => {});

//clear
app.delete('/api/titles/:username/type/:type',  (req, res) => {
	console.log("GOT TO CLEAR");
	console.log(req.params.username);
	console.log(req.params.type);
	knex('titles').where({username: req.params.username, type: req.params.type}).first().del().then(response => {
	res.status(200).send();
});
});

//delete an item
/*
app.delete('/api/titles/:title/username/:username',  (req,res) => {
 // id of the person who is following
   let username = req.params.username;
   let title = req.params.title;
   console.log("GOT TO DELETE");
   console.log(username);
   console.log(title);
 // check this id
//   if (username !== req.userID) {res.status(403).send("Invalid Credentials."); return;}
   return knex('titles').where('titles.username', username).andWhere('titles.title', title).then(T => {
     if(T === undefined){res.status(409).send("Does Not Exist"); return;}
     knex('titles').where('titles.username', username).andWhere('titles.title', title).del();
     res.status(200).send();
     return;
   });
});
*/


app.listen(4000, () => console.log('Server listening on port 4000!'))
