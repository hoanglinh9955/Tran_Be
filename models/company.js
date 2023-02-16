const mssql = require('mssql');
const config = require('../config');
class Company {
    constructor(name, email, password, role, status, address, hotline) {

        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.status = status;
        this.address = address;
        this.hotline = hotline
    }

     async save() {
        try {
            // Connect to the database
            const pool = await mssql.connect(config.sql);

            // Insert the user into the database
            const result = await pool.request()
                .input('name', mssql.VarChar, this.name)
                .input('email', mssql.VarChar, this.email)
                .input('password', mssql.VarChar, this.password)
                .input('hotline', mssql.Int, parseInt(this.hotline))
                .input('role', mssql.VarChar, this.role)
                .input('status', mssql.Int, this.status)
                .input('address', mssql.VarChar, this.address)
                .query('INSERT INTO company (name, email, password, role, status, address, hotline) VALUES (@name, @email, @password, @role, @status, @address, @hotline)');

              console.dir(result)
            // Return success
            return result;
        } catch (error) {
            console.log(error)
            
        }
    }
    async findOne(email) {
        try {
            // Connect to the database
            const pool = await mssql.connect(config.sql);
    
            // Get the user from the database
            const result = await pool.request()
            .input('email', mssql.VarChar, email)
            .query('SELECT * FROM company WHERE email = @email');
            
            return result;
            
        } catch (err) {
            console.log(err)
        }

        }
         
    }

module.exports = Company;


