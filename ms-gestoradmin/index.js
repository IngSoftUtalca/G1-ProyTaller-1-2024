const express = require('express');
const mysql = require('mysql');
const dbConfig = require('../ENPOINTS.json').DB;
const runQuery = require('./query.js').runQuery;
const runParametrizedQuery = require('./query.js').runParametrizedQuery;
const app = express();
const cors = require('cors');


const PORT = 3006;

const corsOptions = {
  origin: ['http://localhost:8080', 'http://localhost:8082', require('../ENPOINTS.json').webdocente, require('../ENPOINTS.json').mainpage],
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}


app.use(cors(corsOptions));
app.use(express.json());

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