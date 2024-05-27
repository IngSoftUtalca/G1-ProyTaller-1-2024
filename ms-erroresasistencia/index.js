const express = require('express');
const mysql = require('mysql');
const app = express();
const cors = require('cors');

let runQuery = require('./querys.js').runQuery;

const corsOptions = {
  origin: ['http://localhost:8080', 'http://localhost:8082', require('../ENPOINTS.json').webdocente, require('../ENPOINTS.json').mainpage],
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions));
app.use(express.json());

const dbData = require('../ENPOINTS.json').DB;

const PORT = 3005;
app.post('/error', async (req, res) => {
  let connection;
  try {
    connection = mysql.createConnection(dbData);
    connection.connect();
  } catch (error) {
    return res.status(500).json({ message: 'Error al conectar con la base de datos' });
  }
  const { rut, detalle, clase_dia, ramo_nombre, razon, sala, justificable } = req.body;
  const justificar = `INSERT INTO Justificacion (RUT, Detalle, Clase_Dia, Ramo_Nombre) VALUES (?, ?, ?, ?);`;
  const error = `INSERT INTO Error (Razon, Detalle, Docente, Ramo, Sala) VALUES (?, ?, ?, ?, ?);`;
  try {
    if (justificable){
      await runQuery(connection, justificar, [rut, detalle, clase_dia, ramo_nombre]);
    }
    await runQuery(connection, error, [razon, detalle, rut, ramo_nombre, sala]);
    res.status(200).json({ message: 'Error registrado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar el error: '+error });
  }
  connection.end();
});
app.get('/', (req, res) => {
  res.json({ message: 'Micro servicio para error de asistencia' });
});
app.listen(PORT, () => {
  console.log('Servidor corriendo en http://localhost:' + PORT);
});


