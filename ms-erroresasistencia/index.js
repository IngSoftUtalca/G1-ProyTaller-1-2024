const express = require('express');
const mysql = require('mysql');
const app = express();
const cors = require('cors');

let runQuery = require('./querys.js').runQuery;

//ya se puede hacer las querys 
app.use(express.json());
app.use(cors({ origin: '*' }));

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
  const { fecha, hora, rut, detalle, clase_dia, ramo_nombre, ramo_periodo } = req.body;
  const query = `INSERT INTO Justificacion (Fecha, Hora, Rut, Detalle, Clase_Dia, Ramo_Nombre, Ramo_Periodo) VALUES (?, ?, ?, ?, ?, ?, ?)`; //query para insertar un error
  try {
    await runQuery(connection, query, [fecha, hora, rut, detalle, clase_dia, ramo_nombre, ramo_periodo]);
    res.json({ message: 'Error registrado correctamente' });
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


