const express = require('express');
const mysql = require('mysql');
const app = express();
const ProgressBar = require('progress');

const funciones = require('./shared/funciones.js');
const { get } = require('http');
const runQuery = funciones.runQuery;
const getBloqueId = funciones.getBloqueId;
const getInstancia = funciones.getInstancia;

app.use(express.json({ limit: '50mb' }));

const dbData = require('../ENPOINTS.json').DB;

app.post('/', async (req, res) => {
  const connection = mysql.createConnection(dbData);

  connection.connect(error => {
    if (error) {
      console.error('No se a podido conectar la base de datos: ', error);
      return res.status(500).json({ error: 'No se ha podido conectar la base de datos' });
    }
  });

  const XLSX = require('xlsx');
  const fs = require('fs');

  // Get data from request body
  const fechaInicio = req.body.fechaInicio;
  const fechaTermino = req.body.fechaTermino;
  const feriados = req.body.feriados;
  const horario_periodo = req.body.horario_periodo;

  const buffer = Buffer.from(horario_periodo, 'base64');


  // Get all the dates between fechaInicio and fechaTermino
  const datesInRange = [];
  const currentDate = new Date(fechaInicioDate);
  while (currentDate <= fechaTerminoDate) {
    datesInRange.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Filter out the weekends (Saturday and Sunday)
  const filteredDates = datesInRange.filter(date => date.getDay() !== 0 && date.getDay() !== 6);

  // Filter out the dates that are already in feriados
  const newFeriados = filteredDates.filter(date => !feriados.includes(date.toISOString().split('T')[0]));

  // Add the new feriados to the existing feriados array
  feriados.push(...newFeriados);
  // Guardar el archivo .xlsx
  fs.writeFileSync('archivo.xlsx', buffer);

  // Leer el archivo
  const workbook = XLSX.readFile('archivo.xlsx');

  // Obtener el nombre de la primera hoja
  const sheetName = workbook.SheetNames[0];

  // Convertir la hoja a JSON
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(worksheet);
  
  const nombresSecciones = [...new Set(jsonData.map(obj => {
    const seccion = obj.LIGA.split("-")[1];
    const nombre = obj.NOMBRE.replace('(CURICO)', '').trim();
    return `${nombre} Seccion ${seccion}`;
  }))];

  // Extraer las salas
  const instancia = getInstancia(jsonData);

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

  const queryLimpieza = `DELETE FROM \`Periodo\` WHERE ID = ?;`;
  try{
    await runQuery(connection, queryLimpieza, [semestre]);
  }catch(error){
    console.log("no se pudo borrar semestre: ", error.message);
  }

  const query1 = `INSERT INTO \`Periodo\` (ID, fechaInicio, fechaTermino) VALUES (?, ?, ?);`;
  try {
    await funciones.runQuery(connection, query1, [semestre, fechaInicioDate, fechaTerminoDate]);
  } catch (error) {
    return res.status(500).json({ error: 'Error ejecutando la query dentro de Periodo: '+error.message });
  }

  console.log("Periodo creado");

  const query2 = `INSERT INTO \`Dia_Libre\` (Dia, ID_periodo ) VALUES (?, ?);`;
  const bar = new ProgressBar('Agregando feriados [:bar] :percent', { total: feriados.length });
  for (let feriado of feriados) {
    try {
      await runQuery(connection, query2, [feriado, semestre]);
      bar.tick();
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
