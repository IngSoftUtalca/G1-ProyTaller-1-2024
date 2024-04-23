const express = require('express');
const mysql = require('mysql');
const app = express();
app.use(express.json());

const dbData = require('../ENPOINTS.json').DB;

process.env.TZ = 'America/Santiago'; // se define la zona horaria en chile

var cola = [];

; // día lunes



var semestreActual;
CalcularSemestre();

function CalcularSemestre(){
    const fechaActual = new Date();

    const formatofecha = fechaActual.getFullYear()+"-"+fechaActual.getMonth()+"-"+fechaActual.getDay();
    console.log(formatofecha);
    const conection = mysql.createConnection(dbData);
    conection.connect((error)=>{
        if(error){
            console.log(error);
            res.end(error);
        }

        const query = `SELECT ID, FechaInicio, FechaTermino FROM Periodo ORDER BY FechaTermino DESC LIMIT 1;`

        
        conection.query(query,(error,results)=>{
            conection.end();
            console.log(results[0].ID);

            if(error){

            }else{
                
            }
            semestreActual = results[0].ID;

        });
        
    });
    

}




const PORT = 3009;


const cursolocal = [];

app.get('/', (req, res) => {
  res.json({ message: 'Micro servicio para registro asistencia' });
});
app.listen(PORT, () => {
  console.log('Servidor corriendo en http://localhost:' + PORT);
});


app.post('/consultarhorario', (req, res) => {
    const tiempoActual = new Date();
    const horaactual = tiempoActual.getHours()+":"+tiempoActual.getMinutes()+":"+tiempoActual.getSeconds();
    const disS = tiempoActual.getDay(); 
    
    //como deberia venir el req
    /** 
    {
        // solo ejemplo 
        "Rut": '2222222222'
    }
*/

    // como body sera  identificaion profe | id sala | 
    //SELECT `Bloque`,`Inicio`,`Termino`,`Ramo` FROM `Sala`  INNER JOIN `Instancia` ON `Sala` = Sala.ID INNER JOIN `Bloque` ON Bloque.ID = Instancia.Bloque INNER JOIN `Ramo` ON `Nombre` = `Ramo` INNER JOIN `Asignacion` ON `Nombre` = `Nombre_Ramo` WHERE RUT_Docente = '100' AND `Latitud` = '10' AND `Longitud` = '10' AND `Inicio` < '03:00:00' AND `Termino` > '03:00:00';
    //const query = `SELECT Bloque,Sala,Ramo,Nombre,RUT_Docente FROM Sala INNER JOIN Instancia ON Sala = ID INNER JOIN Ramo ON Nombre = Ramo INNER JOIN Asignacion ON Nombre = Nombre_Ramo WHERE RUT_Docente = '${req.body.RUT_Docente}' AND Latitud = '${req.body.Latitud}' AND Longitud = '${req.body.Longitud}'`;
    //SELECT * FROM `Sala`  INNER JOIN `Instancia` ON `Sala` = Sala.ID INNER JOIN `Bloque` ON Bloque.ID = Instancia.Bloque INNER JOIN `Ramo` ON `Nombre` = `Ramo` WHERE  `Inicio` < '10:00:00' AND `Termino` > '10:00:00' AND `Latitud` = -35.0025 AND `Longitud` = -71.2303 AND `Periodo` = 'Semestre.1-2024';
    //const query = `SELECT Bloque,Inicio,Termino,Ramo FROM Sala  INNER JOIN Instancia ON Sala = Sala.ID INNER JOIN Bloque ON Bloque.ID = Instancia.Bloque INNER JOIN Ramo ON Nombre = Ramo WHERE  Inicio < '${horaactual}' AND Termino > '${horaactual}' AND Latitud = '${req.body.Latitud}' AND Longitud = '${req.body.Longitud}' AND Dia_Semana = ${disS} AND Periodo = '${semestreActual}' LIMIT 1`;
    const query = `SELECT Bloque,Inicio,Termino,Ramo FROM Sala  INNER JOIN Instancia ON Sala = Sala.ID INNER JOIN Bloque ON Bloque.ID = Instancia.Bloque INNER JOIN Ramo ON Nombre = Ramo WHERE  Inicio < '10:00:00' AND Termino > '10:00:00' AND Latitud = ${req.body.Latitud} AND Longitud = ${req.body.Longitud}  AND Dia_Semana = ${disS} AND Periodo = '${semestreActual}' LIMIT 1`;
    //SELECT * FROM `Sala`  INNER JOIN `Instancia` ON `Sala` = Sala.ID INNER JOIN `Bloque` ON Bloque.ID = Instancia.Bloque INNER JOIN `Ramo` ON `Nombre` = `Ramo` WHERE  `Inicio` < '10:00:00' AND `Termino` > '10:00:00' AND `Latitud` = -35.0025 AND `Longitud` = -71.2303  LIMIT 1
    //const query = `SELECT Bloque,Sala.ID,Inicio,Termino,Ramo,Dia_Semana FROM Sala  INNER JOIN Instancia ON Sala = Sala.ID INNER JOIN Bloque ON Bloque.ID = Instancia.Bloque INNER JOIN Ramo ON Nombre = Ramo INNER JOIN Asignacion ON Nombre = Nombre_Ramo WHERE RUT_Docente = ${req.body.Rut} AND Inicio < ${horaactual} AND Termino > ${horaactual}`;
    //const query = `SELECT * FROM Bloque WHERE '${horaactual}' < Termino AND '${horaactual}' > Inicio`; // se uso la tabla de bloque por simple hecho de demostracion 
    const conection = mysql.createConnection(dbData);

    // esto es una version de prueba que envia este json 
    let envioestatico = {
        'Bloque': 'B1',
        'Sala': 'E2',
        'Inicio': '8:30:00',
        'Termino': '9:40:00',
        'Ramo': "Taller de Software",
        'Dia_Semana': '1' ,
        'Iniciada': false
    }

    conection.connect((error)=>{
        if(error){
            console.log(error);
            res.end(error);
        }
        conection.query(query,(error,results)=>{
            conection.end();
            if(error){
                res.end(error);
            }
            if(results.length != 0){
                console.log(results);
                res.end(JSON.stringify(results));

            }else{
                res.end("no hay clase");
            }

        });

    });

});


app.post('/registrarinicio', (req, res) => {
    let hola = {
        "titulo":  "aprendiedo React.js",
        "numeroVistas": 567834,
        "numLikes": 4523456,
        "temas":[
            "Javascript",
            "Node.js"
        ],
        "publico":true
    }

    cursolocal.push(req.body);

    cursolocal.forEach(element => {
        console.log(element);
    });

    // insert

        /** 
        {
            "Dia_Semana": 4,
            "Sala": 'E2',
            "Bloque": 'B1',
            "IP": '192.168.0,50'

        }// sacado de la  consulta 
        */

        
        // obtiene la hora actual 

        //const tiempoActual = new Date();
        //const diaactual = tiempoActual.getDay()+"/"+tiempoActual.getMonth()+"/"+tiempoActual.getFullYear();
        //const horaactual = tiempoActual.getHours()+":"+tiempoActual.getMinutes()+":"+tiempoActual.getSeconds();
        //const query = `INSERT INTO Clase (Dia, Hora_Inicio, IP, Estado) VALUES ('${diaactual}','${horaactual}','${req.body.IP}','Pendiente')`

        res.end("registar inicio de clases")

});


app.post('/registrarfinal', (req, res) => {

    var desc = cursolocal.find(function(e) {
        return e.Dia_Semana == req.body.Dia_Semana;
      })

      if(cursolocal.length != 0){
        cursolocal.pop();
      }
      
      console.log(cursolocal);
    // selection y modificar las columnas de la tabla clase para definir la columna de termino y estado
    res.end("registar fin de clases")
});





// este se encargara de la gestion del cierre de la clase en el caso de que el profe no lo cierre. esto se hara de manera asincrona 
async function monitorearHorario(){
    
    var hora = new Date();
    //console.log(hora.getHours()+":"+hora.getMinutes()+":"+hora.getSeconds());
    
    var esperaMin = 0;

    while(conectado){
        
  
        try{

            
            esperaMin = await procesarHora(esperaMin == 0? 10000:esperaMin*60*1000);
            console.log('la siguiente revision de salas no cerradas es en '+esperaMin+" minutos");

            // seguiria aca si se llega a un horario ded no clase (los 10 minutos entre bloques o fuera de un horario de clase establecida)
            // por lo que cerraria todas las clases sin terminar y diferenciar entre cursos que si terminarian y los qei estan en receso

        }catch(error){
            console.log(error);
        }
    
    }
};







conectado = true;
function procesarHora(espera){
    
    return new Promise((resolve,reject) => {
        console.log(`iniciado espera`);
        setTimeout(()=>{
        conection = mysql.createConnection(dbData);
            conection.connect((error)=>{
                if(error){
                    console.log("no hay conexion");
                    reject('no se puede conectar a la BD');
                }else{
                    const tiempoActual = new Date();
                    // obtiene la hora actual 
                    const horaactual = tiempoActual.getHours()+":"+tiempoActual.getMinutes()+":"+tiempoActual.getSeconds();
                    
        
                    
                    //console.log(horaactual);
                    //const horaactual = "11:00:00";

                    // se busca si esta dentro de algun bloque la hora actual
                    const query = `SELECT (Termino) FROM Bloque WHERE '${horaactual}' < Termino AND '${horaactual}' > Inicio`;
                    
                    conection.query(query,(error,results)=>{
                        conection.end();
                        //console.log(results[0].Termino);
                        if(error){
                            reject('no se puede conectar a la BD');
                        }
                        else{
                            if(results.length == 0){
                                if('22:20:00' < horaactual){

                                    
                                    const [horaA, minutoA, segundoA] = (horaactual).split(':').map(Number);
                                    const  [horaT, minutoT, segundoT] = ('8:30:00').split(':').map(Number);
                                    const horaDiff = horaA > horaT ? (24 - horaA + horaT) : horaT - horaA;  
                                    console.log((horaDiff)+':'+(minutoT-minutoA)+':00');

                                    
                                    resolve((horaDiff)*60 + (minutoT-minutoA)+ 2); // 1o horas si ya no hay mas horarios para hoy
                                }else{
                                    // aca se cerrarian todas las salas que no fueron terminadas

                                    cursolocal = [];
                                    resolve(12); 
                                }
                                
                            }else{




                                const [horaA, minutoA, segundoA] = horaactual.split(':').map(Number);
                                const  [horaT, minutoT, segundoT] = results[0].Termino.split(':').map(Number);
                        
                                resolve((horaT-horaA)*60 + (minutoT-minutoA)+ 2);
                            }
                        }
                    });
                }
            });


        },espera)
    });
}



//console.log(process.env.TZ);

monitorearHorario(); // por ahora esta desactivado el monitoreo



