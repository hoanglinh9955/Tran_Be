const mssql = require('mssql');
const config = require('../config');

class Trip {
    constructor(depart, destination, company_name, address, hotline, depart_date, distance, price, end_time, begin_time, transport_name, image_path, type) {
      this.depart = depart;
      this.destination = destination;
      this.company_name = company_name;
      this.address = address;
      this.hotline = hotline;
      this.depart_date = depart_date;
      this.distance = distance;
      this.price = price;
      this.end_time = end_time;
      this.begin_time = begin_time;
      this.transport_name = transport_name;
      this.image_path = image_path;
      this.type = type;
    }
  
  



 static async getTrips(depart, destination, depart_date) {
  try {
    // configure SQL connection
    

    // create connection pool
    const pool = await mssql.connect(config.sql);
    const query = `
      SELECT t.begin_time, t.end_time, t.distance, t.price, 
             tr.name as transport_name, tr.image_path, trt.name as type,
             r.depart, r.destination, r.depart_date,
             c.name as company_name, c.address, c.hotline
      FROM trip t 
      JOIN route r ON t.route_id = r.id
      JOIN company c ON r.company_id = c.id
      JOIN transportation tr ON tr.trip_id = t.id
      JOIN type trt ON tr.type = trt.id
      WHERE r.depart = @depart AND r.destination = @destination AND r.depart_date = @depart_date
    `;
    // create a new request object
    const result = new pool.Request()
    .input('depart', mssql.VarChar, depart)
    .input('destination', mssql.VarChar, destination)
    .input('depart_date', mssql.VarChar, depart_date)
    .query(query)
    // define the SQL query
    

    // add input parameters to the request
    

    // execute the query
    

    // return the result
    return result.recordset;
  } catch (err) {
    console.error('Error:', err);
  } finally {
    // close the connection pool
    mssql.close();
  }
}

// // call the function and print the result
// getTrips('San Francisco', 'Los Angeles')
//   .then(trips => console.log(trips))
//   .catch(err => console.error(err));
}

module.exports = Trip;