const express = require('express');
const mysql = require('mysql');
const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.json());

const dbData = require('../ENPOINTS.json').DB;

app.post('/nuevo', (req, res) => {
  const connection = mysql.createConnection(dbData);

  connection.connect(error => {
    if (error) {
      console.error('No se a podido conectar la base de datos: ', error);
      return res.status(500).json({ error: 'No se ha podido conectar la base de datos' });
    }

    // Get data from request body
    const fechaInicio = req.body.fechaInicio;
    const fechaTermino = req.body.fechaTermino;
    const feriados = req.body.feriados;
    const horario_periodo = req.body.horario_periodo;

    // Split fechaInicio and fechaTermino into components
    const [yearInicio, monthInicio, dayInicio] = fechaInicio.split('-').map(Number);
    const [yearTermino, monthTermino, dayTermino] = fechaTermino.split('-').map(Number);

    // Create new Date objects
    const fechaInicioDate = new Date(yearInicio, monthInicio - 1, dayInicio);
    const fechaTerminoDate = new Date(yearTermino, monthTermino - 1, dayTermino);

    // Determine the semester based on both fechaInicio and fechaTermino
    const semesterInicio = monthInicio < 7 || (monthInicio === 7 && dayInicio <= 15) ? 1 : 2;
    const semesterTermino = monthTermino < 7 || (monthTermino === 7 && dayTermino <= 15) ? 1 : 2;

    // Check if semesterInicio and semesterTermino are the same
    if (semesterInicio !== semesterTermino) {
      return res.status(400).json({ error: 'la fechaInicio y la fechaTermino deben corresponder al mismo semestre' });
    }

    // Construct the constant
    const semestre = 'Semestre.' + semesterInicio + '-' + yearInicio;

    const query1 = `INSERT INTO \`Periodo\` (ID, fechaInicio, fechaTermino) VALUES (?, ?, ?);`;
    connection.query(query1, [semestre, fechaInicio, fechaTermino], (error, results) => {
      if (error) {
        console.error('Error ejecutando la query: ', error);
        return res.status(500).json({ error: 'Error ejecutando la query dentro de Periodo' });
      }

      const query2 = `INSERT INTO \`Dia_Libre\` (Dia, ID_periodo ) VALUES (?, ?);`;
      for (let feriado of feriados) {
        connection.query(query2, [feriado, semestre], (error, results) => {
          if (error) {
            console.error('Error ejecutando la query: ', error);
            return res.status(500).json({ error: 'Error ejecutando la query dentro de Dia_Libre' });
          }
        });
      }

      connection.end();

      res.json({ message: 'Operación terminada con exito' });
    });
  });
});

app.listen(3010, () => {
  console.log('Server running on http://localhost:3010');
});