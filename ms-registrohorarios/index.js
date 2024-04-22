const { Console } = require('console');
const express = require('express');
const { get } = require('http');
const mysql = require('mysql');
const app = express();
const ProgressBar = require('progress');
app.use(express.json({ limit: '50mb' }));
app.use(express.json());

const bloques = [
  {id: 1, inicio: '08:30:00', fin: '09:30:00'},
  {id: 2, inicio: '09:40:00', fin: '10:40:00'},
  {id: 3, inicio: '10:50:00', fin: '11:50:00'},
  {id: 4, inicio: '12:00:00', fin: '13:00:00'},
  {id: 5, inicio: '13:10:00', fin: '14:10:00'},
  {id: 6, inicio: '14:20:00', fin: '15:20:00'},
  {id: 7, inicio: '15:30:00', fin: '16:30:00'},
  {id: 8, inicio: '16:40:00', fin: '17:40:00'},
  {id: 9, inicio: '17:50:00', fin: '18:50:00'},
  {id: 10, inicio: '19:00:00', fin: '20:00:00'},
  {id: 11, inicio: '20:10:00', fin: '21:10:00'},
  {id: 12, inicio: '21:20:00', fin: '22:20:00'},
];

const dbData = require('../ENPOINTS.json').DB;

app.post('/nuevo', async (req, res) => {
  const connection = mysql.createConnection(dbData);

  connection.connect(error => {
    if (error) {
      console.error('No se a podido conectar la base de datos: ', error);
      return res.status(500).json({ error: 'No se ha podido conectar la base de datos' });
    }
  });

  const XLSX = require('xlsx');
  const fs = require('fs');
  const FileSaver = require('file-saver');

  // Get data from request body
  const fechaInicio = req.body.fechaInicio;
  const fechaTermino = req.body.fechaTermino;
  const feriados = req.body.feriados;
  const horario_periodo = req.body.horario_periodo;

  const buffer = Buffer.from(horario_periodo, 'base64');

  // Guardar el archivo .xlsx
  fs.writeFileSync('archivo.xlsx', buffer);

  // Leer el archivo
  const workbook = XLSX.readFile('archivo.xlsx');

  // Obtener el nombre de la primera hoja
  const sheetName = workbook.SheetNames[0];

  // Convertir la hoja a JSON
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(worksheet);
/*  
  const nombresramos = jsonData.map(obj => ({
    NOMBRE: obj.NOMBRE,
    LIGA: obj.LIGA
  }));
  */
  const nombresSecciones = [...new Set(jsonData.map(obj => {
    const seccion = obj.LIGA.split("-")[1];
    const nombre = obj.NOMBRE.replace('(CURICO)', '').trim();
    return `${nombre} Seccion ${seccion}`;
  }))];

  // Extraer las salas
  const instancia = jsonData.map(obj => {
    let sala = obj.SALA;
    let edificio = obj.EDIFICIO;
    const inicioDecimal = obj["HORA INICIO"];
    const terminoDecimal = obj["HORA FIN"];
    const seccion = obj.LIGA.split("-")[1];
    const nombre = obj.NOMBRE.replace('(CURICO)', '').trim();

    const inicio = inicioDecimal ? `${Math.floor(inicioDecimal * 24)}:${Math.round((inicioDecimal * 24 - Math.floor(inicioDecimal * 24)) * 60).toString().padStart(2, '0')}` : '';
    const termino = terminoDecimal ? `${Math.floor(terminoDecimal * 24)}:${Math.round((terminoDecimal * 24 - Math.floor(terminoDecimal * 24)) * 60).toString().padStart(2, '0')}` : '';
    if (inicio === 'NaN' || termino === 'NaN') {
      return null;
    }
    const dia = obj.DIA;
    if (!sala && !edificio) {
      return {SALA: 'SIN SALA'};
    }
    return {SALA: `${edificio}-${sala}`, INICIO: `${inicio}`, TERMINO: `${termino}`,DIA: `${dia}` , NOMBRE: `${nombre} Seccion ${seccion}`};
    
  }).filter(inst => inst !== null);

  // Split fechaInicio and fechaTermino into components
  const [yearInicio, monthInicio, dayInicio] = fechaInicio.split('-').map(Number);
  const [yearTermino, monthTermino, dayTermino] = fechaTermino.split('-').map(Number);

  // Create new Date objects
  const fechaInicioDate = new Date(yearInicio, monthInicio - 1, dayInicio);
  const fechaTerminoDate = new Date(yearTermino, monthTermino - 1, dayTermino);

  // Determine the semester based on both fechaInicio and fechaTermino
  const semesterInicio = monthInicio < 7 || (monthInicio === 7 && dayInicio <= 15) ? 1 : 2;
  const semesterTermino = monthTermino < 7 || (monthTermino === 7 && dayTermino <= 15) ? 1 : 2;

  // Check if semesterInicio and semesterTermino are the same
  if (semesterInicio !== semesterTermino) {
    return res.status(400).json({ error: 'la fechaInicio y la fechaTermino deben corresponder al mismo semestre' });
  }

  // Construct the constant
  const semestre = 'Semestre.' + semesterInicio + '-' + yearInicio;

  const query1 = `INSERT INTO \`Periodo\` (ID, fechaInicio, fechaTermino) VALUES (?, ?, ?);`;
  try {
    await runQuery(connection, query1, [semestre, fechaInicioDate, fechaTerminoDate]);
  } catch (error) {
    return res.status(500).json({ error: 'Error ejecutando la query dentro de Periodo' });
  }

  console.log("Periodo creado");

  const query2 = `INSERT INTO \`Dia_Libre\` (Dia, ID_periodo ) VALUES (?, ?);`;
  for (let feriado of feriados) {
    try {
      await runQuery(connection, query2, [feriado, semestre]);
    } catch (error) {
      return res.status(500).json({ error: 'Error ejecutando la query dentro de Dia_Libre' });
    }
  }

  console.log("Feriados agregados");

  const query3 = `INSERT INTO \`Ramo\` (Nombre, Periodo) VALUES (?, ?);`;
  const bar1 = new ProgressBar('Agregando ramos [:bar] :percent', { total: nombresSecciones.length });
  for (let nombre of nombresSecciones) {
    try {
      await runQuery(connection, query3, [nombre, semestre]);
      bar1.tick();
    } catch (error) {
      return res.status(500).json({ error: 'Error ejecutando la query dentro de Ramo' });
    }
  }
  
  console.log("Ramos agregados");
  
  const query4 = `INSERT INTO \`Instancia\` (Sala, Bloque, Dia_Semana, Ramo) VALUES (?, ?, ?, ?);`;
  const bar2 = new ProgressBar('Agregando instancias [:bar] :percent', { total: instancia.length });
  for (let ins of instancia){
    const inicio = getBloqueId(ins.INICIO);
    const termino = getBloqueId(ins.TERMINO);
    for (let i = inicio; i < termino; i++) {
      const params = [ins.SALA, i, ins.DIA, ins.NOMBRE];
      try {
        await runQuery(connection, query4, params);
      } catch (error) {
        console.error('An error occurred:', error);
        return res.status(500).json({ error: 'Error ejecutando la query dentro de Instancia' });
      }
    }
    bar2.tick();
  }
  
  console.log("Instancias agregadas");

  connection.end();

  res.json({ message: 'Operación terminada con exito' });
});

app.listen(3010, () => {
  console.log('Server running on http://localhost:3010');
});

function getBloqueId(hora) {
  if (!hora) {
    return null;
  }
  const [horaH, horaM] = hora.split(':').map(Number);
  for (const bloque of bloques) {
    const [inicioH, inicioM] = bloque.inicio.split(':').map(Number);
    const [finH, finM] = bloque.fin.split(':').map(Number);
    if ((horaH > inicioH || (horaH === inicioH && horaM >= inicioM)) && (horaH < finH || (horaH === finH && horaM <= finM))) {
      return bloque.id;
    }
  }
  return null;
}

function runQuery(connection, query, params) {
  return new Promise((resolve, reject) => {
    connection.query(query, params, (error, results) => {
      if (error) {
        console.error('Error ejecutando la query: ', error);
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}