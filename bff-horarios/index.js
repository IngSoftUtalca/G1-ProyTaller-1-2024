const express = require('express');
const mysql = require('mysql');
const dbConfig = require('../ENPOINTS.json').DB;
const runQuery = require('./query.js').runQuery;
const runParametrizedQuery = require('./query.js').runParametrizedQuery;
const app = express();
const cors = require('cors');
const PORT = 3004;

const corsOptions = {
  origin: ['http://localhost:8080', 'http://localhost:8082', require('../ENPOINTS.json').webdocente, require('../ENPOINTS.json').mainpage],
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions));

app.get('/', (req, res) => {
  res.json({ message: 'Micro servicio para horarios' });
});

app.get('/ramos', async (req, res) => {
  try {
    const connection = mysql.createConnection(dbConfig);
    connection.connect();
    const query = 'SELECT * FROM Ramo';
    await runQuery(connection, query)
      .then((results) => {
        res.status(200).json(results);
      })
      .catch((e) => {
        console.error('Error ejecutando la query: ', e);
        return res.status(500).json({ message: 'Error' });
      });
  } catch (e) {
    console.error('Error conectando a la base de datos: ', e);
    return res.status(500).json({ message: 'Error' });
  }
});

app.get('/asignaciones/:rut', async (req, res) => {
  try {
    const rut = req.params.rut;
    const connection = mysql.createConnection(dbConfig);
    connection.connect();
    const query = `SELECT * FROM Instancia WHERE Ramo IN (SELECT Nombre_Ramo FROM Asignacion WHERE RUT_Docente = ?) AND Semestre IN (SELECT Periodo.ID FROM Periodo WHERE Estado = 'Activo');`;
    await runParametrizedQuery(connection, query, [rut]).then((results) => {
      res.status(200).json(results);
    }).catch((e) => {
      console.error('Error ejecutando la query: ', e);
      return res.status(500).json({ message: 'Error' });
    });
  } catch (e) {
    console.error('Error conectando a la base de datos: ', e);
    return res.status(500).json({ message: 'Error' });
  }
});

app.get('/periodos', async (req, res) => {
  try {
    const connection = mysql.createConnection(dbConfig);
    connection.connect();
    const query = 'SELECT * FROM Periodo';
    runQuery(connection, query)
      .then(async (results) => {
        const updatedResults = results.map(async periodo => {
          const fechaInicio = new Date(periodo.FechaInicio);
          const fechaTermino = new Date(periodo.FechaTermino);
          const fechaActual = new Date();

          if (fechaInicio <= fechaActual && fechaActual <= fechaTermino) {
            periodo.Estado = 'Activo';
          } else if (fechaTermino < fechaActual) {
            periodo.Estado = 'Finalizado';
          } else if (fechaActual < fechaInicio) {
            periodo.Estado = 'Pendiente';
          }

          const updateQuery = `UPDATE Periodo SET Estado = '${periodo.Estado}' WHERE id = '${periodo.ID}'`;
          await runQuery(connection, updateQuery);

          return periodo;
        });

        await runQuery(connection, query)
          .then((results) => {
            res.status(200).json(results);
          })
          .catch((e) => {
            console.error('Error ejecutando la query: ', e);
            return res.status(500).json({ message: 'Error' });
          });
      })
      .catch((e) => {
        console.error('Error ejecutando la query: ', e);
        return res.status(500).json({ message: 'Error' });
      });
  } catch (e) {
    console.error('Error conectando a la base de datos: ', e);
    return res.status(500).json({ message: 'Error' });
  }
});

app.get('/instancia', async (req, res) => {
  const constantes = require('./constantes.json');
  let startTime = "";
  let endTime = "";
  try {
    const connection = mysql.createConnection(dbConfig);
    connection.connect();
    const { sala, dia, bloque } = req.query;
    semestre = await runQuery(connection, `SELECT * FROM Periodo WHERE Estado = 'Activo'`);
    semestre = semestre[0].ID;
    if (!sala || !dia || !bloque) {
      return res.status(400).json({ message: 'Faltan parametros' });
    } else if (dia < 1 || dia > 5) {
      return res.status(400).json({ message: 'Dia no valido' });
    } else if (semestre == null) {
      return res.status(400).json({ message: 'No hay semestre activo' });
    }
    try {
      let query = `SELECT Ramo FROM Instancia WHERE Sala = ? AND Dia_Semana = ? AND Bloque = ? AND Semestre = ?`;
      let ramo = await runParametrizedQuery(connection, query, [sala, dia, bloque, semestre]);
      ramo = ramo[0].Ramo;
      query = `SELECT Bloque FROM Instancia WHERE Ramo = ? AND Semestre = ? AND Dia_Semana = ?;`
      const bloques = await runParametrizedQuery(connection, query, [ramo, semestre, dia]);
      const bloqueStart = bloques[0].Bloque;
      const bloqueEnd = bloques[bloques.length - 1].Bloque;
      query = `SELECT * FROM Bloque WHERE ID = ?;`
      startTime = await runParametrizedQuery(connection, query, [bloqueStart]);
      endTime = await runParametrizedQuery(connection, query, [bloqueEnd]);
      const response = {
        Ramo: ramo,
        HoraInicio: startTime[0].Inicio,
        HoraTermino: endTime[0].Termino,
      }
      return res.status(200).json(response);
    } catch (e) {
      const bloques = constantes.bloques;
      for (const b of bloques) {
        if (b.id == bloque) {
          startTime = b.inicio;
          endTime = b.fin;
        }
      }
      const response = {
        Ramo: "No hay clases en la sala",
        HoraInicio: startTime,
        HoraTermino: endTime,
      }
      return res.status(200).json(response);
    }
    connection.end();

  } catch (e) {
    console.log('Error conectando a la base de datos: ', e);
    return res.status(500).json({ message: 'Error: ' + e });
  }
});

app.get('/semestre/activo', async (req, res) => {
  try {
    const connection = mysql.createConnection(dbConfig);
    connection.connect();
    const query = `SELECT * FROM Periodo WHERE Estado = 'Activo';`;
    const semestre = await runQuery(connection, query);
    if (semestre.length == 0) {
      return res.status(200).json({ message: 'No hay semestre activo' });
    }
    return res.status(200).json(semestre);
  } catch (e) {
    return res.status(500).json({ message: 'Error: ' + e });
  }
});

app.listen(PORT, () => {
  console.log('Servidor corriendo en http://localhost:' + PORT);
});
