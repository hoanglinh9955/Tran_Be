const Company = require('../models/company');
const Trips = require('../models/trip');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator/check');


exports.getRouteByComId = async (req, res, next) => {
    
    const trips = new Trips();
    const company_id = req.body.company_id;

  const result = await trips.getRoutesByComId(company_id)
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

exports.createTripByCompany = async (req, res, next) => {
    
  const trips = new Trips();
  
  const {company_id, depart, destination, depart_date, distance, price, end_time, begin_time, transport_name, image_path, type} = req.body

const result = await trips.createTripByCompany(depart, destination, company_id, depart_date, distance, price, end_time, begin_time, transport_name, image_path, type)
  .then(result => { return result })
  .catch(err => console.log(err))

console.log(result)

}