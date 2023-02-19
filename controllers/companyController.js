const Company = require('../models/company');
const Trips = require('../models/trip');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator/check');


exports.getRouteByComId = async (req, res, next) => {
    
    const trips = new Trips();
    const comid = req.body.comid;

  const result = await trips.getRoutesByComId(comid)
    .then(result => { return result })
    .catch(err => console.log(err))

  console.log(result.recordset)
  if (result.recordset.length == 0) {
    res.status(200).json({
      message: "Don't Have Route To Show",
      data: false
    })
    return
  }

  if (result.recordset) {
    res.status(200).json({
      message: 'Get All Route Success',
      data: true,
      result: result.recordset
    })
    return
  }
}
