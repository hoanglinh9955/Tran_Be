const mssql = require('mssql');
const config = require('../config');
class User {
    constructor(name, email, password, phone_number, role, status) {

        this.name = name;
        this.email = email;
        this.password = password;
        this.phone_number = phone_number;
        this.role = role;
        this.status = status;
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
                .input('phone_number', mssql.Int, parseInt(this.phone_number))
                .input('role', mssql.VarChar, this.role)
                .input('status', mssql.Int, this.status)
                .query('INSERT INTO user_ (name, email, password, phone_number, role, status) VALUES (@name, @email, @password, @phone_number, @role, @status)');

              
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
            .query('SELECT * FROM user_ WHERE email = @email');
            
            return result;
            
        } catch (err) {
            console.log(err)
        }

        }
        
    }

module.exports = {User};
