const { json } = require('body-parser');
const mssql = require('mssql');
const config = require('../config');
class User {
    constructor(name, email, password, phone_number, role) {

        this.name = name;
        this.email = email;
        this.password = password;
        this.phone_number = phone_number;
        this.role = role;
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
                .query('INSERT INTO user_ (name, email, password, phone_number, role) VALUES (@name, @email, @password, @phone_number, @role)');
           
               
            // Return success
            return result.recordsets[0];
        } catch (error) {
            console.log(error)
            throw error;
        }
    }

    static async findOne(email) {
        try {
            // Connect to the database
            const pool = await mssql.connect(config.sql);

            // Get the user from the database
            console.log(email)
            const result = await pool.request()
                .input('email', mssql.VarChar, email)
                .query('SELECT * FROM user_ WHERE email = @email');
            console.log(result)
            console.log(typeof(result))
            console.log(typeof(result.recordset[0]))
            // Return the user
            return result.recordset[0];
        } catch (error) {
            throw error;
        }
    }

    static async find(options) {
        try {
            // Connect to the database
            const pool = await mssql.connect(config.sql);

            // Build the query
            let query = 'SELECT * FROM user_';
            if (options) {
                query += ' WHERE ';
                for (let key in options) {
                    if (options.hasOwnProperty(key)) {
                        query += `${key} = '${options[key]}' AND `;
                    }
                }
                query = query.slice(0, -5);
            }

            // Get the users from the database
            const result = await pool.request().query(query);

            // Return the users
            return result.recordset;
        } catch (error) {
            return error;
        }
    }
}

module.exports = User;
