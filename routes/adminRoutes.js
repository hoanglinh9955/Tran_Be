const express = require("express");
const adminController = require("../controllers/adminController");
const { check, validationResult } = require("express-validator");

const router = express.Router();

router.post('/createCompany',check("email").isEmail() ,adminController.createCompany)

module.exports = router;