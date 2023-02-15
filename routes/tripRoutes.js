const express = require("express");
const tripController = require("../controllers/tripController");


const router = express.Router();

router.post('/trips', tripController.getTrips)
router.get('/getDepart', tripController.getDepart)
module.exports = router;