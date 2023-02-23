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
        c.name as company_name, c.address, c.hotline, c.email, c.status, c.role
      FROM trip t 
          JOIN route r ON t.route_id = r.id
          JOIN company c ON r.company_id = c.id
          JOIN transportation tr ON tr.trip_id = t.id
      WHERE r.depart = @depart AND r.destination = @destination AND t.depart_date = @depart_date `;

      // create a new request object
      const result = await pool.request()
        .input('depart', mssql.NVarChar, depart)
        .input('destination', mssql.NVarChar, destination)
        .input('depart_date', mssql.NVarChar, depart_date)
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
      let query = `select route.depart, route.destination, route.id
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
  async createTripByCompany(depart, destination, company_id, depart_date, distance, price, end_time, begin_time, transport_name, image_path, type) {
    try {
      // Connect to the database
      const pool = await mssql.connect(config.sql);
     
      //check route if it exist.
      let query1 =`select route.id from route where route.company_id = @company_id and route.depart= @depart and route.destination = @destination` ;
      const checkRouteExist = await pool.request()
        .input('company_id', mssql.Int, parseInt(company_id))
        .input('depart', mssql.NVarChar, depart)
        .input('destination', mssql.NVarChar, destination)
        .query(query1)
        console.log(checkRouteExist)
      //Insert a new route
      // define route 
     
     if(checkRouteExist.rowsAffected[1] == 0){
        let query2 = `INSERT INTO route (company_id, depart, destination) VALUES 
          (@company_id, @depart, @destination);
          SELECT SCOPE_IDENTITY() AS route_id;`
          var route = await pool.request()
          .input('company_id', mssql.Int, parseInt(company_id))
          .input('depart', mssql.NVarChar, depart)
          .input('destination', mssql.NVarChar, destination)
          .query(query2)
          console.log(route)
          
      }
      
  
      // Insert a new trip
      let query3 = `INSERT INTO trip (route_id, begin_time, end_time, distance, price, depart_date) 
                    VALUES (@route_id, @begin_time, @end_time, @distance, @price, @depart_date);
                    SELECT SCOPE_IDENTITY() AS trip_id;`
                    
      const trip = await pool.request()
          .input('route_id', mssql.Int, route.recordset[0].route_id)
          .input('begin_time', mssql.NVarChar, begin_time)
          .input('end_time', mssql.NVarChar, end_time)
          .input('distance', mssql.Int, distance)
          .input('price', mssql.Int, price)
          .input('depart_date', mssql.NVarChar, depart_date)
          .query(query3)

      console.log(trip)

      // Insert a new transportation
      let query4 = `INSERT INTO transportation (trip_id, type, image_path, name) 
                    VALUES (@trip_id, @type, @image_path, @name);
                    SELECT SCOPE_IDENTITY() AS transportation_id; `
                    
      const transportation = await pool.request()
          .input('trip_id', mssql.Int, trip.recordset[0].trip_id)
          .input('type', mssql.Int, type)
          .input('image_path', mssql.NVarChar, image_path)
          .input('name', mssql.NVarChar, transport_name)
          .query(query4)
      console.log(transportation)

      
      if(checkRouteExist.recordset === undefined){
        return {
          route, trip, transportation
        }
      }else{
        return {
          checkRouteExist, trip, transportation
        }

      }

      // Insert cells for the transportation
      // const cell = await sql.query`DECLARE @counter INT = 1;
      //   WHILE @counter <= 50
      //   BEGIN
      //     INSERT INTO cell (transportation_id, sit_number) VALUES (${transportation.recordset[0].transportation_id}, @counter);
      //     SET @counter = @counter + 1;
      //   END;`;
  
      // console.log(`New trip created with ID ${trip.recordset[0].trip_id}`);
    
    } catch (err) {
      console.error(err);
    }
}
}
module.exports = Trip;