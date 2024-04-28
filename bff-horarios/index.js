const express = require('express');
const mysql = require('mysql');
const dbConfig = require('../ENPOINTS.json').DB;
const runQuery = require('./query.js').runQuery;
const app = express();
const cors = require('cors');
const PORT = 3004;

app.use(cors({ origin: '*' }));

app.get('/', (req, res) => {
  res.json({ message: 'Micro servicio para horarios' });
});

app.get('/periodos', async (req, res) => {
  try {
    const connection = mysql.createConnection(dbConfig);
    connection.connect();
    const query = 'SELECT * FROM Periodo';
    runQuery(connection, query)
      .then((results) => {
        res.status(200).json(results);
      })
      .catch((e) => {
        console.error('Error ejecutando la query: ', e);
        return res.status(500).json({ message: 'Error' });
      });
  } catch (e) {
    console.error('Error conectando a la base de datos: ', e);
    return res.status(500).json({ message: 'Error' });
  }
});


app.listen(PORT, () => {
  console.log('Servidor corriendo en http://localhost:' + PORT);
});
