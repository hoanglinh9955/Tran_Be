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






  async getTrips(depart, destination, depart_date) {
    try {

      // create connection pool
      const pool = await mssql.connect(config.sql);
      const query = `
    SELECT t.begin_time, t.end_time, t.distance, t.price, 
        tr.name as transport_name, tr.image_path, tr.type,
        r.depart, r.destination, t.depart_date,
        c.name as company_name, c.address, c.hotline
    FROM trip t 
        JOIN route r ON t.route_id = r.id
        JOIN company c ON r.company_id = c.id
        JOIN transportation tr ON tr.trip_id = t.id
    WHERE r.depart = @depart AND r.destination = @destination AND t.depart_date = @depart_date `;

      // create a new request object
      const result = await pool.request()
        .input('depart', mssql.VarChar, depart)
        .input('destination', mssql.VarChar, destination)
        .input('depart_date', mssql.VarChar, depart_date)
        .query(query)

      console.log(result.recordset)
      // return the result
      return result;
    } catch (err) {
      console.error('Error:', err);
    }
  }

  async getRoutes() {
    try {
      const pool = await mssql.connect(config.sql);
      let query = `select route.depart, route.destination from route`;
      const result = await pool.request()
        .query(query)

      console.log(result)
      return result
    } catch (err) {
      console.error('Error:', err);
    }
  }

  async getRoutesByComId(com_id) {
    try {
      const pool = await mssql.connect(config.sql);
      let query = `select route.depart, route.destination 
                    from route join company on (route.company_id = company.id)
                    where company.id = @company_id `;
      const result = await pool.request()
        .input('company_id', mssql.Int, com_id)
        .query(query)

      console.log(result)
      return result
    } catch (err) {
      console.error('Error:', err);
    }
  }

}

module.exports = Trip;