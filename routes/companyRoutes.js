const express = require("express");
const companyController = require("../controllers/companyController");
const { check, validationResult } = require("express-validator");

const router = express.Router();

router.post('/getRouteByComId', companyController.getRouteByComId);

router.post('/createTripByCompany', companyController.createTripByCompany);

module.exports = router;