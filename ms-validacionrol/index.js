const express = require('express');
const app = express();
const PORT = 3011;

const mysql = require('mysql');
const dbConfig = require('../ENPOINTS.json').DB;
const runQuery = require('./query.js').runQuery;
const runParametrizedQuery = require('./query.js').runParametrizedQuery;
const cors = require('cors');

app.use(cors({ origin: [require('../ENPOINTS.json').webdocente, require('../ENPOINTS.json').mainpage, 'localhost'] }));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Micro servicio para validacion de rol' });
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
    connection = mysql.createConnection(dbConfig);
    connection.connect();
    const query = `SELECT * FROM ${rol} WHERE RUT = ?`;
    await runParametrizedQuery(connection, query, [rut])
        .then((result) => {
          if (result.length === 0) {
            response.Nombre = 'Usuario sin rol';
            res.status(400).json(response);
          } else {
            response.Nombre = result[0].Nombre;
            response.Valido = true;
            res.status(200).json(response);
          }
        })
        .catch((error) => {
          response.Nombre = 'Error de consulta';
          res.status(501).json(response);
        })
        .finally(() => {
          connection.end();
        });
  } catch (error) {
    response.Nombre = 'Base de datos no disponible';
    res.status(500).json(response);
  }
});

app.listen(PORT, () => {
  console.log('Servidor corriendo en http://localhost:' + PORT);
});
