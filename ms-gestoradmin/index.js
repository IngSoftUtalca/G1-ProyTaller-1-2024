const express = require('express');
const app = express();
const PORT = 3006;

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
app.use('/crear', checkOriginMiddleware);
app.use('/quitar', checkOriginMiddleware);


app.get('/', (req, res) => {
  res.json({ message: 'Micro servicio para gestor de admin' });
});
app.listen(PORT, () => {
  console.log('Servidor corriendo en http://localhost:' + PORT);
});




app.post('/quitar', async (req, res) => {
  const { rut } = req.body;
  try{
    const connection = mysql.createConnection(dbConfig);
    connection.connect();
    const query = `DELETE FROM Administrador WHERE Administrador.RUT = ?`;
    await runParametrizedQuery(connection, query, [rut]);
    connection.end();
    
    return res.json({ message: 'Administrador Quitado correctamente' });
  }catch (error) {
    return res.status(500).json({ message: 'Error al quitar a un administrador' });
  }
});



app.post('/crear', async (req, res) => {
  const { rut, nombre, campus, facultad} = req.body;
  try {
    const connection = mysql.createConnection(dbConfig);
    connection.connect();
  
    const query =  `INSERT INTO Administrador(RUT, Nombre, Campus, Facultad) VALUES (?,?,?,?)`;
    await runParametrizedQuery(connection, query, [rut, nombre, campus, facultad]);
    connection.end();
    res.json({ message: 'Administrador creado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear docente' });
  }

});