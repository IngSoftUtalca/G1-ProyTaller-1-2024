const express = require('express');
const mysql = require('mysql');
const app = express();
app.use(express.json());

const dbData = require('../ENPOINTS.json').DB;

process.env.TZ = 'America/Santiago'; // se define la zona horaria en chile



const PORT = 3009;




app.get('/', (req, res) => {
  res.json({ message: 'Micro servicio para registro asistencia' });
});
app.listen(PORT, () => {
  console.log('Servidor corriendo en http://localhost:' + PORT);
});


app.post('/consultarhorario', (req, res) => {
    const tiempoActual = new Date();
    const horaactual = tiempoActual.getHours()+":"+tiempoActual.getMinutes()+":"+tiempoActual.getSeconds();

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
    
    //const query = `SELECT Bloque,Sala.ID,Inicio,Termino,Ramo,Dia_Semana FROM Sala  INNER JOIN Instancia ON Sala = Sala.ID INNER JOIN Bloque ON Bloque.ID = Instancia.Bloque INNER JOIN Ramo ON Nombre = Ramo INNER JOIN Asignacion ON Nombre = Nombre_Ramo WHERE RUT_Docente = ${req.body.Rut} AND Inicio < ${horaactual} AND Termino > ${horaactual}`;
    const query = `SELECT * FROM Bloque WHERE '${horaactual}' < Termino AND '${horaactual}' > Inicio`; // se uso la tabla de bloque por simple hecho de demostracion 
    const conection = mysql.createConnection(dbData);
    conection.connect((error)=>{
        if(error){
            console.log(error);
            res.end(error);
        }
        conection.query(query,(error,results)=>{
            conection.end();

            if(query.length != 0){
                results[0].iniciado = false;  // aca nos definiriamos si la clase ya esta iniciada
                res.end(JSON.stringify(results));

            }else{
                res.end("no hay datos");
            }

        });

    });

});


app.post('/registrarinicio', (req, res) => {
    // insert

        /** 
        {
            "Dia_Semana": 4,
            "Sala": 'E2',
            "Bloque": 'B1',
            "IP": '192.168.0,50'
            "hora_iniciada": '11:00:00'

        }// sacado de la  consulta 
        */


        //const tiempoActual = new Date();
        // obtiene la hora actual 
        //const diaactual = tiempoActual.getDay()+"/"+tiempoActual.getMonth()+"/"+tiempoActual.getFullYear();
        //const query = `INSERT INTO Clase (Dia, Hora_Inicio, IP, Estado) VALUES ('${diaactual}','${req.body.hora_iniciada}','${req.body.IP}','Pendiente')`
        res.end("registar inicio de clases")

});


app.post('/registrarfinal', (req, res) => {
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
                }
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
                    
                    if(results.length == 0){
                        if('22:20:00' < horaactual){
                            resolve(10*60); // 1o horas si ya no hay mas horarios para hoy
                        }else{
                            resolve(12); 
                        }
                        
                    }else{
                        // aca se cerrarian todas las salas que no fueron terminadas

                        const [horaA, minutoA, segundoA] = horaactual.split(':').map(Number);
                        const  [horaT, minutoT, segundoT] = results[0].Termino.split(':').map(Number);
                        console.log((horaT-horaA)+':'+(minutoT-minutoA)+':'+(segundoT-segundoA));
                        console.log((horaT-horaA)*60 + (minutoT-minutoA) + 2);
                  
                        resolve((horaT-horaA)*60 + (minutoT-minutoA)+ 2);
                    }
                    
                });
            });


        },espera)
    });
}



//console.log(process.env.TZ);

monitorearHorario(); // por ahora esta desactivado el monitoreo



