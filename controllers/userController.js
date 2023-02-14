const { User } = require('../models/user');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator/check');

const sendgrid = require('@sendgrid/mail');

const API_KEY = "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"

sendgrid.setApiKey(API_KEY);

exports.register = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Email Invalid.');
    error.statusCode = 422;
    error.data = false;
    next(error);
    return;
  }
  const { name, email, password, phone_number } = req.body;
  bcrypt.hash(password, 10, async (err, hash) => {
    if (err) {
      console.log("this is err")
      return res.status(500).json({
        message: 'some thing went wrong, invalid input',
        data: false
      })
    }
    const user = new User(name, email, hash, phone_number, "USER", 1);

    const result = await user.findOne(email)
      .then(result => { return result })
      .catch(err => console.log(err))

    // if (result) {
    //   res.status(500).json({
    //     error: err,
    //     message: 'some thing went wrong, invalid input'
    //   }); 
    // }
    console.log(result.recordset[0])
    if (result.recordset[0]) {
      res.status(401).json({
        message: 'User with that email exist. Please use another email',
        data: false
      });
      return
    } else {
      const rs = await user.save()
        .then(result => { return result })
        .catch(err => console.log(err))

      if (!rs) {
        return res.status(200).json({
          message: "Insert To Database False",
          data: false
        })
      }
      if (rs) {
        return res.status(200).json({
          message: "Create User Success",
          data: true
        })
      }
    }
  });
}






exports.login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Email Invalid.');
    error.statusCode = 422;
    error.data = false;
    next(error);
    return;
  }
  const { email, password } = req.body;
  const user = new User();


  const result = await user.findOne(email)
    .then(result => { return result })
    .catch(err => console.log(err))

  if (result.recordset[0] === undefined) {
    res.status(400).json({
      message: 'User with that email does not exist. Please signup',
      data: false
    });
    return;
  }

  loadedUser = result.recordset[0];
  console.log(loadedUser);

  return bcrypt.compare(password, loadedUser.password)
    .then(isEqual => {
      if (!isEqual) {
        const error = new Error('Wrong password!');
        error.statusCode = 400;
        error.data = false;
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
      res.status(200).json({
        message: 'Login successed',
        data: true,
        token: token,
        userId: loadedUser.id.toString()
      });
      return;
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
}
