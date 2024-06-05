const express = require('express');
const cors = require('cors');
const mongoClient = require('mongodb').MongoClient;
const dbData = require('./db'); // Import danych z db.js

const employeesRoutes = require('./routes/employees.routes');
const departmentsRoutes = require('./routes/departments.routes');
const productsRoutes = require('./routes/products.routes');

mongoClient.connect('mongodb://0.0.0.0:27017', (err, client) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Successfully connected to the database');
    const db = client.db('companyDB');

    // Import danych do MongoDB

    db.collection('departments')
      .insertOne({ name: 'Management' })
      .catch((err) => {
        console.log(err);
    });

    db.collection('employees')
    .find({ department: 'IT' })
    .toArray()
    .then((item) => {
      console.log(item);
     })
     .catch((err) => {
       console.log(err);
     });

    const app = express();

    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    app.use('/api', employeesRoutes);
    app.use('/api', departmentsRoutes);
    app.use('/api', productsRoutes);

    app.use((req, res) => {
      res.status(404).send({ message: 'Not found...' });
    });

    app.listen('8000', () => {
      console.log('Server is running on port: 8000');
    });
  }
});