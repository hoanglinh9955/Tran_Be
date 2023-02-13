const Trips = require('../models/trip');

exports.getTrips = async (req, res) => {
    let moment = require('moment');
    

    const depart = req.body.depart;
    const destination = req.body.destination;
    
    const depart_date = req.body.depart_date;
   
    const trips = new Trips();

    trips = await Trips.getTrips(depart, destination, depart_date)



      res.status(200).json({
        message: "Trips retrieved successfully.",
        trips: trips.recordset
      
    })}