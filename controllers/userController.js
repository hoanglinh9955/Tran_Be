const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator/check');

const sendgrid = require('@sendgrid/mail');

const API_KEY = "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"

sendgrid.setApiKey(API_KEY);

exports.register = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = errors.array();
    next(error);
    return;
  }
  const { name, email, password, phone_number } = req.body;
    bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      console.log("this is err")
      return res.status(500).json({
        error: err
      });
    } else {
     
      const user = new User();
      user.email = email;
      user.name = name;
      user.password = hash;
      user.phone_number = phone_number;
      user.role = "USER"

    //  if(user.findOne(email)){
    //   return res.status(401).json({
    //     message: 'User with that email exist. Please use another email'
    //   });
    //  }

      user.save()
        .then(result => {
          res.status(201).json({
            message: 'User created successfully',
            result: result
          });
           sendgrid.send({
            to: email,
            from: "hoanglinh9955@gmail.com",
            subject: "Signup succeeded!",
            text: "this is test",
            html: "<h1>From LinhHoang App Fuck u bitch!!!</h1>"
          }).then(result => {
            console.log("email sending...")
          }).catch(err => {
            console.log('err at send email.')
          })
          return
        })
        .catch(err => {
          res.status(500).json({
            error: err
          });
        });
    }
  });
};

exports.login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = errors.array();
    next(error);
    return;
  }
  const { email, password } = req.body;
  const user = await User.findOne(email)
  
    if (!user) {
      return res.status(400).json({
        message: 'User with that email does not exist. Please signup'
      });
    }

    loadedUser = user;
      return bcrypt.compare(password, user.password)
    .then(isEqual => {
      if (!isEqual) {
        const error = new Error('Wrong password!');
        error.statusCode = 400;
        throw error;
      }
      const token = jwt.sign(
        {
          email: loadedUser.email,
          userId: loadedUser.id.toString()
        },
        'somesupersecretsecret',
        { expiresIn: '1h' }
      );
      res.status(200).json({ token: token, userId: loadedUser.id.toString() });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
  }

// exports.signup = (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     const error = new Error('Validation failed.');
//     error.statusCode = 422;
//     error.data = errors.array();
//     throw error;
//   }
//   const email = req.body.email;
//   const name = req.body.name;
//   const password = req.body.password;
//   bcrypt
//     .hash(password, 12)
//     .then(hashedPw => {
//       const user = new User({
//         email: email,
//         password: hashedPw,
//         name: name
//       });
//       return user.save();
//     })
//     .then(result => {
//       res.status(201).json({ message: 'User created!', userId: result._id });
//     })
//     .catch(err => {
//       if (!err.statusCode) {
//         err.statusCode = 500;
//       }
//       next(err);
//     });
// };

// exports.loginn = (req, res, next) => {
//   const email = req.body.email;
//   const password = req.body.password;
//   let loadedUser;
//   User.findOne({ email: email })
//     .then(user => {
//       if (!user) {
//         const error = new Error('A user with this email could not be found.');
//         error.statusCode = 401;
//         throw error;
//       }
//       loadedUser = user;
//       return bcrypt.compare(password, user.password);
//     })
//     .then(isEqual => {
//       if (!isEqual) {
//         const error = new Error('Wrong password!');
//         error.statusCode = 401;
//         throw error;
//       }
//       const token = jwt.sign(
//         {
//           email: loadedUser.email,
//           userId: loadedUser._id.toString()
//         },
//         'somesupersecretsecret',
//         { expiresIn: '1h' }
//       );
//       res.status(200).json({ token: token, userId: loadedUser._id.toString() });
//     })
//     .catch(err => {
//       if (!err.statusCode) {
//         err.statusCode = 500;
//       }
//       next(err);
//     });
// };


