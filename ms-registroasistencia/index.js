const express = require('express');
const mysql = require('mysql');
const app = express();
app.use(express.json());

const dbData = require('../ENPOINTS.json').DB;

process.env.TZ = 'America/Santiago'; // se define la zona horaria en chile

var cola = [];



// consulta de cursos

/** 
POST http://localhost:3009/consultarhorario  HTTP/1.1
Content-Type: application/json

{
    "Rut": "33061234-1"
}*/



//solicitud de registro inicia

/**
 POST http://localhost:3009/registrarinicio  HTTP/1.1
Content-Type: application/json

{
    "Rut": "33061234-1",
    "Inicio": "12:20:00"
}
 
 
 */


// solicitud de registro final

/**
 POST http://localhost:3009/registrarfinal HTTP/1.1
Content-Type: application/json

{
    "Rut": "33061234-1"
}
 
 
 */







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


var cursolocal = [];

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
    //const query = `SELECT Bloque,Inicio,Termino,Ramo FROM Sala  INNER JOIN Instancia ON Sala = Sala.ID INNER JOIN Bloque ON Bloque.ID = Instancia.Bloque INNER JOIN Ramo ON Nombre = Ramo WHERE  Inicio < '10:00:00' AND Termino > '10:00:00' AND Latitud = ${req.body.Latitud} AND Longitud = ${req.body.Longitud}  AND Dia_Semana = ${disS} AND Periodo = '${semestreActual}' LIMIT 1`;
    //SELECT * FROM `Sala`  INNER JOIN `Instancia` ON `Sala` = Sala.ID INNER JOIN `Bloque` ON Bloque.ID = Instancia.Bloque INNER JOIN `Ramo` ON `Nombre` = `Ramo` WHERE  `Inicio` < '10:00:00' AND `Termino` > '10:00:00' AND `Latitud` = -35.0025 AND `Longitud` = -71.2303  LIMIT 1
    //const query = `SELECT Bloque,Sala.ID,Inicio,Termino,Ramo,Dia_Semana FROM Sala  INNER JOIN Instancia ON Sala = Sala.ID INNER JOIN Bloque ON Bloque.ID = Instancia.Bloque INNER JOIN Ramo ON Nombre = Ramo INNER JOIN Asignacion ON Nombre = Nombre_Ramo WHERE RUT_Docente = ${req.body.Rut} AND Inicio < ${horaactual} AND Termino > ${horaactual}`;
    //const query = `SELECT * FROM Bloque WHERE '${horaactual}' < Termino AND '${horaactual}' > Inicio`; // se uso la tabla de bloque por simple hecho de demostracion 
    const conection = mysql.createConnection(dbData);
    console.log(req.body);
    const query = `SELECT RUT_Docente, Bloque,Inicio,Termino,Ramo FROM Sala  INNER JOIN Instancia ON Sala = Sala.ID INNER JOIN Bloque ON Bloque.ID = Instancia.Bloque INNER JOIN Ramo ON Nombre = Ramo INNER JOIN Asignacion ON Nombre_Ramo = Nombre WHERE  Inicio < '12:30:00' AND Termino > '12:30:00'  AND Dia_Semana = 2 AND Periodo = '${semestreActual}' AND RUT_Docente = '${req.body.Rut}'`;
    //const query = `SELECT Bloque,Inicio,Termino,Ramo FROM Sala  INNER JOIN Instancia ON Sala = Sala.ID INNER JOIN Bloque ON Bloque.ID = Instancia.Bloque INNER JOIN Ramo ON Nombre = Ramo WHERE  Inicio < '${horaactual}' AND Termino > '${horaactual}'  AND Dia_Semana = ${disS} AND Periodo = '${semestreActual}' LIMIT 1`;
    //const query = `SELECT Bloque,Inicio,Termino,Ramo FROM Sala  INNER JOIN Instancia ON Sala = Sala.ID INNER JOIN Bloque ON Bloque.ID = Instancia.Bloque INNER JOIN Ramo ON Nombre = Ramo WHERE  Inicio < '10:00:00' AND Termino > '10:00:00' AND Latitud = ${req.body.Latitud} AND Longitud = ${req.body.Longitud}  AND Dia_Semana = ${disS} AND Periodo = '${semestreActual}' LIMIT 1`;


    // esto es una version de prueba que envia este json 

    conection.connect((error)=>{
        if(error){
            console.log(error);
            res.end("no hay conexion 1");
        }
        conection.query(query,(error,results)=>{
            conection.end();
            if(error){
                res.end("no hay conexion 2");
            }
            console.log(results);
            if(results.length != 0){

                var desc = null;
                var desc = cursolocal.find(function(e) {
                    return e.RUT_Docente == req.body.Rut;
                  })
                
                results[0].Iniciado = (desc != null);


                res.end(JSON.stringify(results[0]));

            }else{
                res.end("no hay clase");
            }

        });

    });

});


app.post('/registrarinicio', (req, res) => {

    const tiempoActual = new Date();
    //const horaactual = tiempoActual.getHours()+":"+tiempoActual.getMinutes()+":"+tiempoActual.getSeconds();
    
    const diaS = tiempoActual.getDay(); 

    const conection = mysql.createConnection(dbData);


    conection.connect((error)=>{
        if(error){
            console.log(error);
            res.end(error);
        }
        else{
            //const queryComprobar = `SELECT RUT_Docente, Bloque,Inicio,Termino,Ramo FROM Sala  INNER JOIN Instancia ON Sala = Sala.ID INNER JOIN Bloque ON Bloque.ID = Instancia.Bloque INNER JOIN Ramo ON Nombre = Ramo INNER JOIN Asignacion ON Nombre_Ramo = Nombre WHERE  Inicio < '12:30:00' AND Termino > '12:30:00'  AND Dia_Semana = 2 AND Periodo = 'Semestre.1-2024' AND RUT_Docente = '33061234-1'`;

            // VERSION ESTATICA
                                   
            const queryComprobar = `SELECT RUT_Docente, Bloque,Inicio,Termino,Ramo FROM Sala  INNER JOIN Instancia ON Sala = Sala.ID INNER JOIN Bloque ON Bloque.ID = Instancia.Bloque INNER JOIN Ramo ON Nombre = Ramo INNER JOIN Asignacion ON Nombre_Ramo = Nombre WHERE  Inicio < '${req.body.Inicio}'  AND Termino > '${req.body.Inicio}' AND Dia_Semana = 2 AND Periodo = '${semestreActual}' AND RUT_Docente = '${req.body.Rut}'`; 

            // VERSION REAL
            //const queryComprobar = `SELECT RUT_Docente, Bloque,Inicio,Termino,Ramo FROM Sala  INNER JOIN Instancia ON Sala = Sala.ID INNER JOIN Bloque ON Bloque.ID = Instancia.Bloque INNER JOIN Ramo ON Nombre = Ramo INNER JOIN Asignacion ON Nombre_Ramo = Nombre WHERE  Inicio < ${req.body.Inicio}  AND Termino > ${req.body.Inicio}  AND Inicio < ${horaactual} AND Termino > ${horaactual} AND Dia_Semana = ${diaS} AND Periodo = ${semestreActual} AND RUT_Docente = ${req.body.Rut}`;
            conection.query(queryComprobar,(error,results)=>{
                conection.end();
                if(error){
                    console.log(error);
                    res.end(error);
                }
                
                if(results.length != 0){
                    valido = true;
                    var desc = null;
                    var desc = cursolocal.find(function(e) {
                        return e.RUT_Docente == req.body.Rut;
                      })


                    if(desc == null){ // se guardara localmente como pendiente
                        console.log("se guardara:")
                        results[0].Inicio = req.body.Inicio;
                        cursolocal.push(results[0]);
                        console.log('cursos actuales en pendiente:')
                        cursolocal.forEach(element => {
                            console.log(element.RUT_Docente+" / "+element.Inicio+" / "+element.Ramo);
                        });
                        res.end('se guardo tu registro');
                    }else{
                        res.end('el profesor ya tiene una clase iniciada');
                    }
        
        
                

                }else{
                    valido = false;
                    res.end(error);
                }


    
            });
        }


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



});


app.post('/registrarfinal', (req, res) => { // se necesita el rut del docente



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
                if(error){
                    res.end(error);
                }else{
                    if(results.length != 0){

                        var desc = null
                        desc = cursolocal.find(function(e) {
                            return e.RUT_Docente == req.body.Rut;
                          })
                        console.log("finalizando...");         
                        if(desc != null){
                            if(cursolocal.length != 0){
                              //RUT_Docente, Bloque,Inicio,Termino,Ramo
                              const fechaActual = new Date();
                              const formatofecha = fechaActual.getFullYear()+"-"+fechaActual.getMonth()+"-"+fechaActual.getDay();
                              const queryInsert =`INSERT INTO Clase (Dia, Hora_Inicio, Hora_Termino, IP, Ramo_Nombre, Ramo_Periodo) VALUES ('${formatofecha}','${desc.Inicio}','${horaactual}','192.178.0.0','${desc.Ramo}','${semestreActual}')`;
                              conection.query(queryInsert,(error,results)=>{
                                conection.end();
                                if(error){
                                  console.log(error);
                                }else{
                                  cursolocal = cursolocal.filter(cursosel => cursosel.RUT_Docente != req.body.Rut);
                                }
                              });
                              


                            }
                    
                            desc.Termino = horaactual;
                            console.log("curso finalizazo:" +desc.RUT_Docente+" / "+desc.Inicio+" / "+desc.Termino+" / "+desc.Ramo)
                            console.log('cursos actuales en pendiente:')
                            cursolocal.forEach(element => {
                                console.log(element.RUT_Docente+" / "+element.Inicio+" / "+element.Ramo);
                            });
                    
                    
                            // selection y modificar las columnas de la tabla clase para definir la columna de termino y estado
                            res.end("registar fin de clases");
                        }else{
                            res.end("no se encontro clase iniciada");
                        }
                    }else{
                        res.end("registro fuera de horario de clase");
                    }
                }
            });
        }
    
    });
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
                    //const horaactual = '23:30:00';
        
                    
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
                                const [horaA, minutoA, segundoA] = (horaactual).split(':').map(Number);
                                // aca se cerrarian todas las salas que no fueron terminadas
                                cursolocal = [];




                                // aca se definiria la nueva espera
                                if(CompararHoras(horaA,minutoA,segundoA)){
                                    resolve(12); 
                                }else{
                                    const  [horaT, minutoT, segundoT] = ('8:30:00').split(':').map(Number);
                                    const horaDiff = horaA > horaT ? (24 - horaA + horaT) : horaT - horaA;  
                                    console.log((minutoT >= minutoA? horaDiff : horaDiff - 1)+':'+(minutoT >= minutoA? (minutoT-minutoA):(60+minutoT-minutoA))+':00');
                                    resolve((horaDiff)*60 + (minutoT-minutoA)+ 2); // 1o horas si ya no hay mas horarios para hoy
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


function CompararHoras(HoraA,MinutoA,SegundoA)
{
    var actual = new Date();
    var inicio = new Date();
    var final = new Date();

    actual.setHours(HoraA,MinutoA,SegundoA);
    inicio.setHours(8,30,0); 
    final.setHours(22,20,0); 

    if(actual >= inicio && actual < final ){
        return true;
    }else{
        return false;
    }
}


//console.log(process.env.TZ);

monitorearHorario(); // por ahora esta desactivado el monitoreo



