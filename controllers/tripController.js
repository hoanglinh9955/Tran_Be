const Trips = require('../models/trip');

exports.getTrips = async (req, res, next) => {

  const depart = req.body.depart;
  const destination = req.body.destination;
  const depart_date = req.body.depart_date;

  const trips = new Trips();

  const result = await trips.getTrips(depart, destination, depart_date)
    .then(result => { return result })
    .catch(err => console.log(err))

  if(result.recordset.length == 0){
    res.status(403).json({
      message: "Don't Have Trip To Get",
      data: false
    })
    return
  }

  if (result.recordset) {
    res.status(200).json({
      message: "Get Trip Success",
      data: true,
      result: result.recordset
    })
    return
  }
}

exports.getRoutes = async (req, res, next) => {
  const trips = new Trips();

  const result = await trips.getRoutes()
    .then(result => {return result})
    .catch(err => console.log(err))

    console.log(result)
    if(result.recordset.length == 0){
      res.status(403).json({
        message: "Don't Have Route To Get",
        data: false
      })
      return
    }

    if(result.recordset){
      res.status(200).json({
        message:'get depart success',
        data: true,
        result: result.recordset
      })
    }
}