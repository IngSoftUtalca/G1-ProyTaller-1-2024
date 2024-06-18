const express = require('express');
const app = express();
const PORT = 3011;

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
// Rutas protegidas por verificación de origen
app.use('/', checkOriginMiddleware);
app.use('/horario', checkOriginMiddleware);
app.use('/validar', checkOriginMiddleware);
app.use('/validar/ramo', checkOriginMiddleware);

app.get('/', (req, res) => {
  res.json({ message: 'Micro servicio para validacion de rol' });
});

app.post('/horario', async (req, res) => {
  const Rut = req.body.Rut;
  let response = {
    Horario: [],
    Valido: false,
    mensaje: 'consulta no iniciada para el rut: ' + Rut
  };

  try {
    const connection = mysql.createConnection(dbConfig);
    connection.connect();
    const query = `SELECT Horario.Estado FROM Docente join Horario ON Docente.Horario = Horario.ID AND Docente.RUT = ?;`;
    await runParametrizedQuery(connection, query, [Rut])
      .then((result) => {
        if (result.length === 0) {
          response.Horario = result;
          response.Valido = false;
          res.status(400).json(response);
        } else {
          response.Horario = result;
          response.Valido = result[0].Estado === 'aprobado' ? true : false;
          response.mensaje = 'Consulta exitosa';
          res.status(200).json(response);
        }
      })
      .catch((error) => {
        response.Horario = [];
        response.Valido = false;
        response.mensaje = 'Error de consulta: ' + error.message;
        res.status(501).json(response);
      })
      .finally(() => {
        if (connection && connection.state !== 'disconnected') {
          connection.end();
        }
      });
  } catch (error) {
    response.Horario = [];
    response.Valido = false;
    res.status(500).json(response);
  }
});

app.post('/validar', async (req, res) => {
  const rut = req.body.rut;
  let rol = req.body.rol;
  let response = {
    Nombre: '',
    Rol: rol,
    Valido: false
  };

  rol = rol === 'webmaster' ? 'WebMaster' : rol === 'administrador' ? 'Administrador' : rol === 'docente' ? 'Docente' : null;

  if (rol === null) {
    response.Nombre = 'Usuario no válido';
    res.status(400).json(response);
    return;
  }
  try {
    const connection = mysql.createConnection(dbConfig);
    connection.connect();
    const query = `SELECT * FROM ${rol} WHERE RUT = ?`;
    await runParametrizedQuery(connection, query, [rut])
      .then((result) => {
        if (result.length === 0) {
          response.Nombre = 'Usuario sin rol';
          res.status(400).json(response);
        } else {
          response.Nombre = result[0].Nombre;
          response.Valido = rol === 'Docente' ? result[0].Estado === 'activo' : true;
          res.status(200).json(response);
        }
      })
      .catch((error) => {
        response.Nombre = 'Error de consulta';
        res.status(501).json(response);
      })
      .finally(() => {
        if (connection && connection.state !== 'disconnected') {
          connection.end();
        }
      });
  } catch (error) {
    response.Nombre = 'Base de datos no disponible';
    res.status(500).json(response);
  }
});

app.post('/validar/ramo', async (req, res) => {
  const { Rut, Ramo } = req.body;
  let response = {
    mensaje: 'consulta no iniciada para el rut: ' + Rut + ' y el ramo: ' + Ramo,
    Ramo: Ramo,
    Valido: false
  };

  try {
    const connection = mysql.createConnection(dbConfig);
    connection.connect();

    const query = `SELECT * FROM Asignacion WHERE RUT_Docente = ? AND Nombre_Ramo = ? AND Periodo_Ramo IN (SELECT Periodo.ID as Periodo FROM Periodo WHERE Estado = 'Activo');`;

    await runParametrizedQuery(connection, query, [Rut, Ramo])
      .then((result) => {
        if (result.length === 0) {
          response.mensaje = 'El docente no tiene asignado el ramo';
          res.status(400).json(response);
        } else {
          response.mensaje = 'El docente tiene asignado el ramo';
          response.Valido = true;
          res.status(200).json(response);
        }
      })
      .catch((error) => {
        response.mensaje = 'Error en la consulta: ' + error.message;
        res.status(501).json(response);
      })
      .finally(() => {
        if (connection && connection.state !== 'disconnected') {
          connection.end();
        }
      });

  } catch (error) {
    response.mensaje = 'Error en la consulta: ' + error.message;
    res.status(500).json(response);
  }
});

app.listen(PORT, () => {
  console.log('Servidor corriendo en http://localhost:' + PORT);
});

