const express = require('express');
const app = express();
const PORT = 3003;

const mysql = require('mysql');
const dbConfig = require('../ENPOINTS.json').DB;
const runParametrizedQuery = require('./query.js').runParametrizedQuery;
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
app.use(express.json());

app.use('/', checkOriginMiddleware);
app.use('/cargo/:rut', checkOriginMiddleware);
app.use('/all-docentes', checkOriginMiddleware);



app.get('/cargo/:rut', async (req, res) => {
  try {
    const rut = req.params.rut;
    connection = mysql.createConnection(dbConfig);
    connection.connect();
    const query = `SELECT * FROM Docente WHERE RUT IN (SELECT Docente FROM Cargo WHERE Administrador = ?);`;
    await runParametrizedQuery(connection, query, [rut])
      .then((result) => {
        if (result.length === 0) {
          res.status(404).json({ message: 'No se encontraron datos' });
        }
        res.status(200).json(result);
      })
      .catch((error) => {
        res.status(501).json({ message: 'Error de consulta' });
      })
      .finally(() => {
        if (connection && connection.state !== 'disconnected') {
          connection.end();
        }
      });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

app.get('/all-docentes', async (req, res) => {
  try {
    connection = mysql.createConnection(dbConfig);
    connection.connect();
    const query = `SELECT * FROM Docente`;
    await runQuery(connection, query)
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((error) => {
        res.status(501).json({ message: 'Error de consulta' });
      })
      .finally(() => {
        if (connection && connection.state !== 'disconnected') {
          connection.end();
        }
      });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
});



app.get('/', (req, res) => {
  res.json({ message: 'Micro servicio para datos docente' });
});
app.listen(PORT, () => {
  console.log('Servidor corriendo en http://localhost:' + PORT);
});
