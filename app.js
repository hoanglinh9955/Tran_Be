const express = require('express');
const bodyParser = require('body-parser');
const mssql = require('mssql');
const config = require('./config');
const app = express();

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

const userRoutes = require("./routes/userRoutes");

app.use('/api', userRoutes);

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
  });

  
mssql.connect(config.sql)
  .then(app.listen(process.env.port, () => {
    console.log(`Server is running on port ${process.env.port}`)
}))
  .catch(err => console.log(err))
  
