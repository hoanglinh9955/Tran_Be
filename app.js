const express = require('express');
const bodyParser = require('body-parser');
const mssql = require('mssql');
const config = require('./config');
const app = express();
const cors = require('cors');
// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json
app.use(cors());



app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const userRoutes = require("./routes/userRoutes");
const tripRoutes = require('./routes/tripRoutes');

app.use('/api', userRoutes);
app.use('/api', tripRoutes);

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
  
