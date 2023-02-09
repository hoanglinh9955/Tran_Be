const express = require("express");
const userController = require("../controllers/userController");
const { check, validationResult } = require("express-validator");

const router = express.Router();

//Route to handle user registration
router.post("/register", [
  check("name").not().isEmpty().withMessage("Name is required"),
  check("email").isEmail().withMessage("Invalid email"),
  check("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
  check("phone_number").not().isEmpty().withMessage("Phone number is required")
], userController.register);
  
//Route to handle user login
router.post("/login", [
  check("email").isEmail().withMessage("Invalid email"),
  check("password").not().isEmpty().withMessage("Password is required")
], userController.login);
//router.post('/loginn', userController.login);


//router.post('/signup', userController.register)

module.exports = router;
