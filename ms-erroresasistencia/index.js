const express = require('express');
const app = express();
const PORT = 3005;

const mysql = require('mysql');
const dbData = require('../ENPOINTS.json').DB;
const runQuery = require('./query.js').runQuery;
const endpoints = require('../ENPOINTS.json');

const allowedOrigins = [
  endpoints.webdocente,
  endpoints.mainpage
];

// Middleware personalizado para verificar el origen de la solicitud
const checkOriginMiddleware = (req, res, next) => {
  const origin = req.headers.origin;
  const allowLocalhost = origin && origin.includes('localhost');
  const isAllowedOrigin = allowedOrigins.some(allowedOrigin => origin.startsWith(allowedOrigin));

  // Configurar encabezados CORS para respuestas
  if (allowLocalhost || isAllowedOrigin) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    // Si necesitas cookies o sesiones
    // res.header('Access-Control-Allow-Credentials', 'true');

    // Si la solicitud es una solicitud preflight CORS, terminar aquí
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
  } else {
    console.log('Acceso no permitido por el servidor');
    console.log('Origen de la solicitud:', origin);
    console.log('Orígenes permitidos:', allowedOrigins);
    console.log('Ruta:', req.path);
    console.log('Método:', req.method);
    console.log('Cuerpo:', req.body);
    console.log('Query:', req.query);
    return res.status(403).json({ message: 'Access forbidden by server' });
  }

  next();
};
// Middleware para manejar errores de CORS y otros errores
const handleErrorsMiddleware = (err, req, res, next) => {
  if (err) {
    console.error('Error:', err);
    console.log('Ruta:', req.path);
    console.log('Método:', req.method);
    console.log('Cuerpo:', req.body);
    console.log('Query:', req.query);
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
app.use('/error', checkOriginMiddleware);

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


