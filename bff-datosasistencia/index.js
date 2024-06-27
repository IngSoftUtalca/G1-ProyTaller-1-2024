const express = require('express');
const app = express();
const PORT = 3002;

const mysql = require('mysql');
const dbData = require('../ENPOINTS.json').DB;
const runParametrizedQuery = require('./query.js').runParametrizedQuery;
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

app.use('/', checkOriginMiddleware);
app.use('/horario', checkOriginMiddleware);
app.use('/datosasistenciageneral', checkOriginMiddleware);
app.use('/datosasistenciasemanas', checkOriginMiddleware);
app.use('/datoEnsemana', checkOriginMiddleware);
app.use('/getClases', checkOriginMiddleware);


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
