const express = require('express');
const mysql = require('mysql');
const app = express();
const cors = require('cors');
const math = require("mathjs")
const PORT = 3012;
app.use(express.json());
const dbData = require('../ENPOINTS.json').DB;

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
app.use('/verificar', checkOriginMiddleware);
app.use('/verificarIP', checkOriginMiddleware);


// la ip de la utalca
const ipValida = ['190.110.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)']


app.get('/', (req, res) => {
  res.json({ message: 'Micro servicio para verificacion de gps' });
});


app.listen(PORT, () => {
  console.log('Servidor corriendo en http://localhost:' + PORT);
});




app.post('/verificar', async (req, res) => {

    let validaIP = false
    let validaGPS = false

    if(req.body.IP){
      const verificacionIP = new RegExp(ipValida[0]);
      if(verificacionIP.test(req.body.IP)){
        validaIP = true
      }else{
        validaIP = false
      }
    }

    const rango = 0.0002; // este es el rango de tolerancia a la hora de verificar si esta en la ubicacion

    if(!req.body.latitud || !req.body.longitud || !req.body.sala){
      return res.status(400).json({error: "faltan datos"})
    }
    try {
      const connection = mysql.createConnection(dbData);
  
      connection.connect(error => {
        if (error) {
          console.error('No se a podido conectar la base de datos: ', error);
          return res.status(500).json({ error: 'No se ha podido conectar la base de datos' });
        }
      });

      const parametros = [req.body.sala];
      console.log(req.body)
      const query = `SELECT * FROM Sala where ID = ? `

      connection.query(query,parametros,(error,results) =>{

        if(error){
          return res.status(500).json({error: "error en la base de datos2"})
        }
        if(results.length == 0){


          
          return res.status(400).json({error: "no existe la sala"});
        }else{
          
          console.log(results[0])
          const tolerancia = math.pow(rango,2) + math.pow(rango,2)
          console.log(req.body.latitud+' - '+parseFloat(results[0].Latitud)+'= '+(req.body.latitud - parseFloat(results[0].Latitud)))
          console.log(req.body.longitud+' - '+parseFloat(results[0].Longitud)+'= '+(req.body.longitud - parseFloat(results[0].Longitud)))
          const modulo = Math.pow(req.body.latitud - parseFloat(results[0].Latitud),2) + Math.pow(req.body.longitud - parseFloat(results[0].Longitud),2)
          // (xa - xb)2 + (ya - yb)2 <= tolerancia

          console.log(modulo+' | '+tolerancia);
          if(modulo <= tolerancia){
            validaGPS = true
            //return res.status(200).json({valido: true});
          }else{
            validaGPS = false
            //return res.status(200).json({valido: false,error:"fuera de rango"});
          }

          if(validaGPS && validaIP){
            return res.status(200).json({validoIP: validaIP,validoGPS: validaGPS})
          }else{
            return res.status(200).json({validoIP: validaIP,validoGPS: validaGPS})
          }
          

        }
      })

    }catch{
      return res.status(500).json({error: "error en la base de datos1"})
    }
});

app.post('/verificarIP',async (req,res) => {

  if(req.body.IP){
    const verificacionIP = new RegExp(ipValida[0]);
    if(verificacionIP.test(req.body.IP)){
      return res.status(200).json({valido:true,ok:"valida la IP"})
      //return true
    }else{
      return res.status(400).json({valido: false,error:"ip no valida"});
      //return false
    }
  }

});

function VerificarIp(IP){
  if(IP){
    const verificacionIP = new RegExp(ipValida[0]);
    if(verificacionIP.test(IP)){
      return true
    }else{
      return false
    }
  }
}