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
      .then(async (results) => {
        const updatedResults = results.map(async periodo => {
          const fechaInicio = new Date(periodo.FechaInicio);
          const fechaTermino = new Date(periodo.FechaTermino);
          const fechaActual = new Date();

          if (fechaInicio <= fechaActual && fechaActual <= fechaTermino) {
            periodo.Estado = 'Activo';
          } else if (fechaTermino < fechaActual) {
            periodo.Estado = 'Finalizado';
          } else if (fechaActual < fechaInicio) {
            periodo.Estado = 'Pendiente';
          }

          const updateQuery = `UPDATE Periodo SET Estado = '${periodo.Estado}' WHERE id = '${periodo.ID}'`;
          await runQuery(connection, updateQuery);

          return periodo;
        });

        await runQuery(connection, query)
          .then((results) => {
            res.status(200).json(results);
          })
          .catch((e) => {
            console.error('Error ejecutando la query: ', e);
            return res.status(500).json({ message: 'Error' });
          });
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
