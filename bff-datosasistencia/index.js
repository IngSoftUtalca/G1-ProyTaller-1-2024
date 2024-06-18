const express = require('express');
const PORT = 3002;
const app = express();
const mysql = require('mysql');
const dbData = require('../ENPOINTS.json').DB;
const runParametrizedQuery = require('./query.js').runParametrizedQuery;
app.use(express.json());
const cors = require('cors');
const moment = require('moment');
const corsOptions = {
  origin: ['http://localhost:8080', 'http://localhost:8082', require('../ENPOINTS.json').webdocente, require('../ENPOINTS.json').mainpage],
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions));
app.get('/', (req, res) => {
  res.json({ message: 'Micro servicio para datos de asistencia' });
});
app.listen(PORT, () => {
  console.log('Servidor corriendo en http://localhost:' + PORT);
});

app.post ('/datosasistenciageneral',async (req,res) =>{ // req/body.admin
  const coneccion = mysql.createConnection(dbData);
  const query = `select Clase.docente, count(Estado) as Inasistencia, Ramo_Nombre from Clase INNER JOIN Cargo On Cargo.Docente = Clase.docente where Estado = 'Ausente' and Cargo.Administrador = ? and Clase.Ramo_Periodo = (select Periodo.ID from Periodo where Periodo.Estado = "Activo") GROUP BY Clase.docente, Ramo_Nombre,Cargo.Administrador`
  coneccion.connect();
  await runParametrizedQuery(coneccion,query,[req.body.rut]).then(async (result) =>{
    if (result.length === 0) {
      res.status(404).json({ message: 'No se encontraron datos' });
    }
    const query2 = `select Clase.docente, count(Estado) as Asistido, Ramo_Nombre from Clase INNER JOIN Cargo On Cargo.Docente = Clase.docente where Estado = 'Asistido' and Cargo.Administrador = ? and Clase.Ramo_Periodo = (select Periodo.ID from Periodo where Periodo.Estado = "Activo") GROUP BY Clase.docente, Ramo_Nombre,Cargo.Administrador`
    await runParametrizedQuery(coneccion,query2,[req.body.rut]).then((resultasistencia) =>{
      if (resultasistencia.length === 0) {
        res.status(404).json({ message: 'No se encontraron datos' });
      }
      const empaquetardatos = {
        asistencia: resultasistencia,
        inasistencia: result
      }



      const agrupados = {};
      result.forEach(dato => {
        const clave = dato.Ramo_Nombre;
        
        if (!agrupados[clave]) {
            agrupados[clave] = [];
            agrupados[clave].push({Ramo:dato.Ramo_Nombre,Ausente:0,Asistido:0});
        }


        if(dato.Estado == "Ausente"){
          agrupados[clave][0].Ausente++ 
        }else{
          agrupados[clave][0].Asistido++
        }

      });
      resultasistencia.forEach(dato => {
        const clave = dato.Ramo_Nombre;
        
        if (!agrupados[clave]) {
            agrupados[clave] = [];
            agrupados[clave].push({Ramo:dato.Ramo_Nombre,Ausente:0,Asistido:0});
        }


        if(dato.Estado == "Ausente"){
          agrupados[clave][0].Ausente++ 
        }else{
          agrupados[clave][0].Asistido++
        }

      });


      res.status(200).json(agrupados);
    }).catch((error) => {
      console.log(error)
      res.status(500).json({error:'error en la base de datos2'})
    })
  }).catch((error) => {
    res.status(500).json({error:'error en la base de datos1'})
  })

})

app.post ('/datosasistenciasemanas',async (req,res) =>{ // req/body.admin
  const query = `select Clase.docente, Estado, Ramo_Nombre,Dia from Clase INNER JOIN Cargo On Cargo.Docente = Clase.docente where Cargo.Administrador = ? and Ramo_Nombre = ? and Clase.Ramo_Periodo = (select Periodo.ID from Periodo where Periodo.Estado = "Activo");;`
  const coneccion = mysql.createConnection(dbData);
  coneccion.connect();
  await runParametrizedQuery(coneccion,query,[req.body.rut,req.body.ramo]).then(async (result) =>{
    const agrupados = {};
    result.forEach(dato => {
        const fecha = moment(moment(dato.Dia).format('YYYY-MM-DD'));
        const semana = fecha.isoWeek();
        const año = fecha.year();
        const clave = año + '-' + semana;
        
        if (!agrupados[clave]) {
            agrupados[clave] = [];
            const fechaInicioSemana = moment().year(año).isoWeek(semana).startOf('isoWeek').format('YYYY-MM-DD');
            agrupados[clave].push({Semana:fechaInicioSemana,Ausente:0,Asistido:0});
        }

        console.log(dato.Estado)

        if(dato.Estado == "Ausente"){
          agrupados[clave][0].Ausente++ 
        }else{
          agrupados[clave][0].Asistido++
        }

        //agrupados[clave].push(dato);
    });
    return res.status(200).json(agrupados)
  }
  ).catch((error) => {
    res.status(500).json({error:'error en la base de datos1'})
  })
})

app.post ('/datoEnsemana',async (req,res) =>{ 
  const año = req.body.Nano;
  const numeroSemana = req.body.NSemana
  const fechaInicioSemana = moment().year(año).isoWeek(numeroSemana).startOf('isoWeek').format('YYYY-MM-DD');
  const fechaFinSemana = moment().year(año).isoWeek(numeroSemana).endOf('isoWeek').format('YYYY-MM-DD');
  // Obtener el número de días en la semana
  //return res.status(200).json({fechaInicioSemana,fechaFinSemana})
  console.log(fechaInicioSemana+ " | "+fechaFinSemana)
  const query = `select Docente.Nombre, Clase.Estado, Clase.Ramo_Nombre,Dia,Justificacion.Detalle from Clase INNER JOIN Cargo On Cargo.Docente = Clase.docente INNER JOIN Docente on (Clase.docente = Docente.RUT) LEFT JOIN Justificacion on (Justificacion.RUT = Docente.RUT and Justificacion.Clase_Dia = Clase.Dia and Justificacion.Ramo_Nombre = Clase.Ramo_Nombre ) where Cargo.Administrador = ? and Clase.Ramo_Nombre = ? and Dia >= ? and Dia <= ? and Clase.Ramo_Periodo = (select Periodo.ID from Periodo where Periodo.Estado = "Activo");`
  //const query = `select Clase.docente, Estado, Ramo_Nombre,Dia from Clase INNER JOIN Cargo On Cargo.Docente = Clase.docente where Cargo.Administrador = ? and Ramo_Nombre = ? and Dia >= ? and Dia <= ?;`
  const coneccion = mysql.createConnection(dbData);
  await runParametrizedQuery(coneccion,query,[req.body.rut,req.body.ramo,fechaInicioSemana,fechaFinSemana]).then(async (result) =>{
    if (result.length === 0) {
      return  res.status(404).json({ message: 'No se encontraron datos' });
    }

    return res.status(200).json({result})
    
  }).catch((error) => {
    return res.status(500).json({error:'error en la base de datos1'})
  })
})

app.post ('/getClases',async (req,res) =>{
  const { rut } = req.body;
  const getClases = `
    SELECT distinct Clase.Hora_Inicio, Clase.Hora_Termino, Clase.Ramo_Nombre as Curso, Clase.Dia as Fecha, Clase.Estado, COALESCE(Justificacion.Detalle, 'NULL') as Justificacion
    FROM Clase
           LEFT JOIN Justificacion ON Clase.Ramo_Nombre = Justificacion.Ramo_Nombre AND Clase.Dia = Justificacion.Clase_Dia
    WHERE Clase.docente = ?;
  `;
  const coneccion = mysql.createConnection(dbData);
  coneccion.connect();
  await runParametrizedQuery(coneccion,getClases,[rut]).then(async (result) =>{
    if (result.length === 0) {
      return  res.status(404).json({ message: 'No se encontraron clases' });
    }
      return res.status(200).json({result})
  }).catch((error) => {
    return res.status(500).json({error:'error en la base de datos1'})
  })


})
