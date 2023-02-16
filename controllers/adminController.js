const Company = require('../models/company');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator/check');

exports.createCompany = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Email Invalid.');
      error.statusCode = 422;
      error.data = false;
      next(error);
      return;
    }
    const { name, email, password, address, hotline } = req.body;
    bcrypt.hash(password, 10, async (err, hash) => {
      if (err) {
        console.log("this is err")
        return res.status(500).json({
          message: 'some thing went wrong, invalid input',
          data: false
        })
      }
      // hash is a password hash change hash
      //turn off hash password function
      //const user = new User(name, email, hash, "COMPANY", 1, address, hotline);
      const company = new Company(name, email, password, "COMPANY" , 1, address, hotline);
      //find and check is user exist

      const result = await company.findOne(email)
        .then(result => { return result })
        .catch(err => console.log(err))
  //find mail in User email
  const user = new User();
  const findUser = await user.findOne(email)
    .then(result => { return result })
    .catch(err => console.log(err))

  if(findUser.recordset.length > 0){
      res.status(401).json({
        message: 'User with that email is User email. Please use another email',
        data: false
      });
      return
  }
      console.log(result.recordset[0])
      if (result.recordset[0]) {
        res.status(401).json({
          message: 'Company with that email exist. Please use another email',
          data: false
        });
        return
      } else {
        const rs = await company.save()
          .then(result => { return result })
          .catch(err => console.log(err))
  
        if (!rs) {
          return res.status(200).json({
            message: "Insert Company To Database False",
            data: false
          })
        }
        // result save success find user id in database and return to client
        if (rs) {
            let findCompany = await company.findOne(email)
            .then(result => { return result })
            .catch(err => console.log(err))
          //return res success to client
            return res.status(200).json({
              message: "Create Company Success",
              data: true,
              companyId: findCompany.recordset[0].id
          })
        }
      }
    });
  }