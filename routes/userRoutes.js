const express = require("express");
const userController = require("../controllers/userController");
const { check, validationResult } = require("express-validator");

const router = express.Router();

//Route to handle user registration
router.post("/register", 
  check("email").isEmail()
, userController.register);
  
//Route to handle user login
router.post("/login", 
  check("email").isEmail(),
 userController.login);

module.exports = router;
