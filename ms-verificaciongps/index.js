const express = require('express');
const mysql = require('mysql');
const app = express();
const cors = require('cors');
const PORT = 3012;
app.use(express.json());
const dbData = require('../ENPOINTS.json').DB;

app.use(cors({ origin: '*' }));


app.get('/', (req, res) => {
  res.json({ message: 'Micro servicio para verificacion de gps' });
});


app.listen(PORT, () => {
  console.log('Servidor corriendo en http://localhost:' + PORT);
});




app.post('/verificar', async (req, res) => {

    const rangoLatitud = 50; // este es el rango de tolerancia a la hora de verificar si esta en la ubicacion
    const rangoLongitud = 50; // este es el rango de tolerancia a la hora de verificar si esta en la ubicacion

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

      const parametros = [req.body.sala,rangoLongitud,req.body.longitud,rangoLongitud,req.body.longitud,rangoLatitud,req.body.latitud,rangoLatitud,req.body.latitud];

      const query = `SELECT * FROM Sala where ID = ? and (Longitud + ?) >= ?  and (Longitud - ?) <= ? and  (Latitud + ?) >= ?  and (Latitud - ?) <= ?;`
      connection.query(query,parametros,(error,results) =>{

        if(error){
          return res.status(500).json({error: "error en la base de datos2"})
        }
        if(results.length == 0){
          return res.status(200).json({valido: false});
        }else{
          return res.status(200).json({valido:true});
        }
      })
  


    }catch{
      return res.status(500).json({error: "error en la base de datos1"})
    }
});
