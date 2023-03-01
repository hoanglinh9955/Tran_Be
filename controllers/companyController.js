const Company = require('../models/company');
const Trips = require('../models/trip');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator/check');


exports.getRouteByComId = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Invalid Input.');
    error.statusCode = 200;
    error.message = errors.errors;
    error.data = false;
    next(error);
    return
  }
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

exports.createUpdateTripByCompany = async (req, res, next) => {
    
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Invalid Input.');
      error.statusCode = 200;
      error.message = errors.errors;
      error.data = false;
      next(error);
      return
    }
  const trips = new Trips();
  
  const {company_id, depart, destination, depart_date, distance, price, end_time, begin_time, transport_name, image_path, type, route_id, trip_id, tran_id } = req.body
  
const result = await trips.createUpdateTripByCompany(depart, destination, company_id, depart_date, distance, price, end_time, begin_time, transport_name, image_path, type, route_id, trip_id, tran_id)
  .then(result => { return result })
  .catch(err => console.log(err))

console.log(result)

console.log(result === undefined)
  if (result === undefined) {
    if(route_id === undefined || trip_id === undefined || tran_id === undefined){
      res.status(200).json({
        message: "Update Trip False",
        data: false
      })
      return
    }else{
      res.status(200).json({
        message: "Create Trip False",
        data: false
      })
      return
    }
  }

  if (result) {
    if(route_id === undefined || trip_id === undefined || tran_id === undefined){
      res.status(200).json({
        message: 'Create Trip Success',
        data: true,
        route_id: result.checkRouteExist === undefined ? result.route.recordset[0].route_id: result.checkRouteExist.recordset[0].route_id,
        trip_id: result.trip.recordset[0].trip_id,
        tran_id: result.transportation.recordset[0].transportation_id,
      })
      return
    }else{
      
      if(result === 'update_false'){
        res.status(200).json({
          message: "Update Trip False",
          data: false
        })
        return
      }else{
        res.status(200).json({
          message: 'Update Trip Success',
          data: true,
        })
        return
      } 
    }
  }
}

exports.createUpdateRouteByComId = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Invalid Input.');
    error.statusCode = 200;
    error.message = errors.errors;
    error.data = false;
    next(error);
    return
  }
  const trips = new Trips();
  const {company_id, depart, destination, route_id} = req.body;

const result = await trips.createUpdateRoutesByComId(company_id, depart, destination, route_id)
  .then(result => { return result })
  .catch(err => console.log(err))

console.log(result)
if(result === 'route_exist'){
  res.status(200).json({
    message: "Route Is Exist !!!",
    data: false
  })
  return
}

if (result === undefined) {
  if(route_id === undefined){
    res.status(200).json({
      message: "Create Route False",
      data: false
    })
    return
  }else{
    res.status(200).json({
      message: "Update Route False",
      data: false
    })
    return
  }
  
}

if (result && result != 'route_exist') {
  if(route_id === undefined){
      res.status(200).json({
        message: 'Create Route Success',
        data: true,
        trip_id: result.recordset[0].route_id
      })
      return
  }else{
    res.status(200).json({
      message: 'Update Route Success',
      data: true
    })
    return
    }
  }
}
exports.getTripsByComId = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Invalid Input.');
    error.statusCode = 200;
    error.message = errors.errors;
    error.data = false;
    next(error);
    return
  }
    const trips = new Trips();
    const company_id = req.body.company_id;

  const result = await trips.getTripsByComId(company_id)
    .then(result => { return result })
    .catch(err => console.log(err))

  console.log(result.recordset)
  if (result.recordset.length == 0) {
    res.status(200).json({
      message: "Don't Have Trip To Show",
      data: false
    })
    return
  }

  if (result.recordset) {
    res.status(200).json({
      message: 'Get All trips Success',
      data: true,
      result: result.recordset
    })
    return
  }
}


exports.getRouteNameByComId = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Invalid Input.');
    error.statusCode = 200;
    error.message = errors.errors;
    error.data = false;
    next(error);
    return
  }
    const trips = new Trips();
    const company_id = req.body.company_id;

  const result = await trips.getRouteNameByComId(company_id)
    .then(result => { return result })
    .catch(err => console.log(err))

  console.log(result.recordset)
  if (result.recordset.length == 0) {
    res.status(200).json({
      message: "Don't Have Route Name To Show",
      data: false
    })
    return
  }

  if (result.recordset) {
    res.status(200).json({
      message: 'Get All Route Name Success',
      data: true,
      result: result.recordset
    })
    return
  }
}