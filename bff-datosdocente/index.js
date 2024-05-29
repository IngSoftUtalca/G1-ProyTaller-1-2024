const express = require('express');
const mysql = require('mysql');
const dbConfig = require('../ENPOINTS.json').DB;
const runQuery = require('./query.js').runQuery;
const runParametrizedQuery = require('./query.js').runParametrizedQuery;
const app = express();
const cors = require('cors');

const PORT = 3003;

const corsOptions = {
  origin: ['http://localhost:8080', 'http://localhost:8082', require('../ENPOINTS.json').webdocente, require('../ENPOINTS.json').mainpage],
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions));
app.use(express.json());

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
