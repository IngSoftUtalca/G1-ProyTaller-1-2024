const express = require('express');
const app = express();
const PORT = 3003;

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
