const express = require('express');
const app = express();
const PORT = 3008;

const mysql = require('mysql');
const dbConfig = require('../ENPOINTS.json').DB;
const runParametrizedQuery = require('./query.js').runParametrizedQuery;
const endpoints = require('../ENPOINTS.json');

const allowedOrigins = [
  endpoints.webdocente,
  endpoints.mainpage
];

// Middleware personalizado para verificar el origen de la solicitud
const checkOriginMiddleware = (req, res, next) => {
  const origin = req.headers.origin;
  // Permitir solicitudes locales para desarrollo y pruebas
  const allowLocalhost = origin && origin.includes('localhost');
  if (allowLocalhost || (origin && allowedOrigins.includes(origin))) {
    next();
  } else {
    res.status(403).json({ message: 'Access forbidden by server' });
  }
};

// Middleware para manejar errores de CORS y otros errores
const handleErrorsMiddleware = (err, req, res, next) => {
  if (err) {
    res.status(403).json({ message: 'Access forbidden by server' });
  } else {
    next();
  }
};

// Aplicar middleware para manejo de JSON, CORS y verificación de origen
app.use(express.json());
app.use(checkOriginMiddleware); // Asegúrate de aplicar este middleware antes de tus rutas
app.use(handleErrorsMiddleware);

app.use('/', checkOriginMiddleware);
app.use('/habilitar', checkOriginMiddleware);
app.use('/deshabilitar', checkOriginMiddleware);
app.use('/asignar', checkOriginMiddleware);
app.use('/desasignar', checkOriginMiddleware);
app.use('/crear', checkOriginMiddleware);


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
