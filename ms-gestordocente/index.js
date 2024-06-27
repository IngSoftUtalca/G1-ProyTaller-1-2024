const express = require('express');
const mysql = require('mysql');
const dbConfig = require('../ENPOINTS.json').DB;
const runQuery = require('./query.js').runQuery;
const runParametrizedQuery = require('./query.js').runParametrizedQuery;
const app = express();
const cors = require('cors');
const PORT = 3008;

const corsOptions = {
  origin: ['http://localhost:8080', 'http://localhost:8082', require('../ENPOINTS.json').webdocente, require('../ENPOINTS.json').mainpage],
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions));
app.use(express.json());

app.post('/habilitar', async (req, res) => {
  const { rut } = req.body;
  try {
    const connection = mysql.createConnection(dbConfig);
    connection.connect();
    const query = `UPDATE Docente SET Docente.Estado = 'activo' WHERE Docente.RUT = ?;`;
    await runParametrizedQuery(connection, query, [rut]);
    connection.end();
    res.json({ message: 'Docente habilitado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al habilitar docente' });
  }

});

app.post('/deshabilitar', async (req, res) => {
  const { rut } = req.body;
  try {
    const connection = mysql.createConnection(dbConfig);
    connection.connect();
    const query = `UPDATE Docente SET Docente.Estado = 'inactivo' WHERE Docente.RUT = ?;`;
    await runParametrizedQuery(connection, query, [rut]);
    connection.end();
    res.json({ message: 'Docente deshabilitado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al deshabilitar docente' });
  }
});

app.post('/asignar', async (req, res) => {
  const { adminRut, docenteRut } = req.body;
  try {
    const connection = mysql.createConnection(dbConfig);
    connection.connect();
    const query = `
    INSERT INTO Cargo (WebMaster, Administrador, Docente)
    SELECT distinct WebMaster, ?, ?
    FROM (
             SELECT WebMaster
             FROM Cargo
             WHERE Administrador = ${adminRut}
         ) AS Temp;`;
    await runParametrizedQuery(connection, query, [adminRut, docenteRut]);
    connection.end();
    res.json({ message: 'Docente asignado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al asignar docente' });
  }

});

app.post('/desasignar', async (req, res) => {
  const { adminRut, docenteRut } = req.body;
  try {
    const connection = mysql.createConnection(dbConfig);
    connection.connect();
    const query = `DELETE FROM Cargo WHERE Administrador = ? AND Docente = ?;`;
    await runParametrizedQuery(connection, query, [adminRut, docenteRut]);
    connection.end();
    res.json({ message: 'Docente desasignado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al desasignar docente' });
  }
});

app.post('/crear', async (req, res) => {
  const { rut, nombre, campus, facultad} = req.body;
  try {
    const connection = mysql.createConnection(dbConfig);
    connection.connect();
    const query = `INSERT INTO Docente (RUT, Nombre, Campus, Facultad) VALUES (?, ?, ?, ?);`;
    await runParametrizedQuery(connection, query, [rut, nombre, campus, facultad]);
    connection.end();
    res.json({ message: 'Docente creado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear docente' });
  }

});


app.get('/', (req, res) => {
  res.json({ message: 'Micro servicio para gestor docente' });
});
app.listen(PORT, () => {
  console.log('Servidor corriendo en http://localhost:' + PORT);
});
