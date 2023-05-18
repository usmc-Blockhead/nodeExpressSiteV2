const express = require('express');
const User = require('../models/user');
const passport = require('passport');
const authenticate = require('../authenticate');

const router = express.Router();

/* GET users listing with verifyAdmin middleware. */
router.get('/', authenticate.verifyUser, authenticate.verifyAdmin,
(req, res, next) => {
    User.find()
    .then((users) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(users);
    })
    .catch((err) => next(err));
});

/* GET users listing with User model and Passport. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

//Mongoose routes
router.post('/signup', (req, res) => {
    User.register(
        new User({username: req.body.username}),
        req.body.password,
        (err, user) => {
            if (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.json({err: err});
            } else {
                if (req.body.firstname) {
                    user.firstname = req.body.firstname;
                }
                if (req.body.lastname) {
                    user.lastname = req.body.lastname;
                }
                user.save(err => {
                    if (err) {
                        res.statusCode = 500;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({err: err});
                        return;
                    }
                    passport.authenticate('local')(req, res, () => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({success: true, status: 'Registration Successful!'});
                    });
                });
            }
        }
    );
});

//Passport routes
// router.post('/signup', (req, res) => {
//   User.register(
//       new User({username: req.body.username}),
//       req.body.password,
//       err => {
//           if (err) {
//               res.statusCode = 500;
//               res.setHeader('Content-Type', 'application/json');
//               res.json({err: err});
//           } else {
//               passport.authenticate('local')(req, res, () => {
//                   res.statusCode = 200;
//                   res.setHeader('Content-Type', 'application/json');
//                   res.json({success: true, status: 'Registration Successful!'});
//               });
//           }
//       }
//   );
// });

//passport with JWT authentication
router.post('/login', passport.authenticate('local'), (req, res) => {
  const token = authenticate.getToken({_id: req.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, token: token, status: 'You are successfully logged in!'});
});

//passport
// router.post('/login', passport.authenticate('local'), (req, res) => {
//   res.statusCode = 200;
//   res.setHeader('Content-Type', 'application/json');
//   res.json({success: true, status: 'You are successfully logged in!'});
// });

router.get('/logout', (req, res, next) => {
  if (req.session) {
      req.session.destroy();
      res.clearCookie('session-id');
      res.redirect('/');
  } else {
      const err = new Error('You are not logged in!');
      err.status = 401;
      return next(err);
  }
});


/* GET users listing with User model and sessions. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

// router.post('/signup', (req, res) => {
//   User.findOne({username: req.body.username})
//   .then(user => {
//       if (user) {
//           const err = new Error(`User ${req.body.username} already exists!`);
//           err.status = 403;
//           return next(err);
//       } else {
//           User.create({
//               username: req.body.username,
//               password: req.body.password})
//           .then(user => {
//               res.statusCode = 200;
//               res.setHeader('Content-Type', 'application/json');
//               res.json({status: 'Registration Successful!', user: user});
//           })
//           .catch(err => next(err));
//       }
//   })
//   .catch(err => next(err));
// });

// router.post('/login', (req, res, next) => {
//   if(!req.session.user) {
//       const authHeader = req.headers.authorization;

//       if (!authHeader) {
//           const err = new Error('You are not authenticated!');
//           res.setHeader('WWW-Authenticate', 'Basic');
//           err.status = 401;
//           return next(err);
//       }
    
//       const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
//       const username = auth[0];
//       const password = auth[1];
    
//       User.findOne({username: username})
//       .then(user => {
//           if (!user) {
//               const err = new Error(`User ${username} does not exist!`);
//               err.status = 401;
//               return next(err);
//           } else if (user.password !== password) {
//               const err = new Error('Your password is incorrect!');
//               err.status = 401;
//               return next(err);
//           } else if (user.username === username && user.password === password) {
//               req.session.user = 'authenticated';
//               res.statusCode = 200;
//               res.setHeader('Content-Type', 'text/plain');
//               res.end('You are authenticated!')
//           }
//       })
//       .catch(err => next(err));
//   } else {
//       res.statusCode = 200;
//       res.setHeader('Content-Type', 'text/plain');
//       res.end('You are already authenticated!');
//   }
// });



/* GET users listing without user model. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

module.exports = router;
