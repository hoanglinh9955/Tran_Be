const  User = require('../models/user');
const Company = require('../models/company');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator/check');

const sendgrid = require('@sendgrid/mail');

const API_KEY = "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";

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
    // hash is a password hash change hash
    // turn off hash function 
    //const user = new User(name, email, hash, phone_number, "USER", 1);
    const user = new User(name, email, password, phone_number, "USER", 1);

    const result = await user.findOne(email)
      .then(result => { return result })
      .catch(err => console.log(err))
    //find mail in company email
    const com = new Company();
    const findCom = await com.findOne(email)
      .then(result => { return result })
      .catch(err => console.log(err))
    console.log('company test')
    if(findCom.recordset.length > 0){
        res.status(401).json({
          message: 'User with that email is Company email. Please use another email',
          data: false
        });
        return
    }
    
    if (result.recordset.length > 0) {
      res.status(401).json({
        message: 'User with that email exist. Please use another email',
        data: false
      });
      return
    } 
    else {
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
        //get userid created
        let findUser = await user.findOne(email)
          .then(result => { return result })
          .catch(err => console.log(err))
        //return res success to client
          return res.status(200).json({
            message: "Create User Success",
            data: true,
            userId: findUser.recordset[0].id
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
  const company = new Company();
  //find user email
  const findUser = await user.findOne(email)
    .then(result => { return result })
    .catch(err => console.log(err))
  // find company email
    const findCom = await company.findOne(email)
    .then(result => { return result })
    .catch(err => console.log(err))

  if (!(findUser.recordset.length > 0|| findCom.recordset.length > 0)) {
    res.status(400).json({
      message: 'Email does not exist. Please signup',
      data: false
    });
    return;
  }
  
  loadedUser = findUser.recordset[0];
  loadedCom = findCom.recordset[0]
  try {
    if(loadedUser === undefined){
      console.log(loadedCom)
      // User email is undefiled
      // company is correct
      try {
        if(!(password === loadedCom.password)){
          const error = new Error('Wrong password!');
              error.statusCode = 400;
              error.data = false;
              throw error;
    
        } 
        console.log(loadedCom)
        if(loadedCom){
          const token = jwt.sign(
            {
              email: loadedCom.email,
              companyId: loadedCom.id.toString()
            },
            'somesupersecretsecret',
            { expiresIn: '1h' }
          );
      
          res.status(200).json({
            message: 'Login successed',
            data: true,
            token: token,
            companyId: loadedCom.id.toString(),
            role: loadedCom.role,
            status: loadedCom.status
          });
          return;
        
        }     
      } catch (err) {
        if(!err.statusCode){
          err.statusCode = 500;
        }
        next(err)
      }
    }
   if(loadedCom === undefined){
    console.log(loadedUser);
      // company email is undefiled
      // user is correct
      try {
        if(!(password === loadedUser.password)){
          const error = new Error('Wrong password!');
              error.statusCode = 400;
              error.data = false;
              throw error;
    
        }
        if(loadedUser){
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
            userId: loadedUser.id.toString(),
            role: loadedUser.role,
            status: loadedUser.status
          });
          return;
        
        }     
      } catch (err) {
        if(!err.statusCode){
          err.statusCode = 500;
        }
        next(err)
      }
    }
  } catch (error) {
    console.log('Err: ', error)
  }
  
  
  
  // return bcrypt.compare(password, loadedUser.password)
  //   .then(isEqual => {
  //     if (!isEqual) {
  //       const error = new Error('Wrong password!');
  //       error.statusCode = 400;
  //       error.data = false;
  //       throw error;
  //     }
  //     const token = jwt.sign(
  //       {
  //         email: loadedUser.email,
  //         userId: loadedUser.id.toString()
  //       },
  //       'somesupersecretsecret',
  //       { expiresIn: '1h' }
  //     );

  //     res.status(200).json({
  //       message: 'Login successed',
  //       data: true,
  //       token: token,
  //       userId: loadedUser.id.toString(),
  //       role: loadedUser.role
  //     });
  //     return;
  //   })
  //   .catch(err => {
  //     if (!err.statusCode) {
  //       err.statusCode = 500;
  //     }
  //     next(err);
  //   });
}
