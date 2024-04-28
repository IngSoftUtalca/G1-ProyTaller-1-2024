const express = require('express');
const mysql = require('mysql');
const dbData = require('../ENPOINTS.json').DB;
const app = express();
app.use(express.json());



const cors = require('cors');
app.use(cors({ origin: '*' }));

const consultas = require('./verificaciones.js');


process.env.TZ = 'America/Santiago'; // se define la zona horaria en chile

let semestreActual;
var cursolocal = [];
let horaGlobalActual = '';



CalcularSemestre();

console.log(semestreActual);


const PORT = 3009;

app.get('/', (req, res) => {
  res.json({ message: 'Micro servicio para registro asistencia' });
 
});

app.post('/', (req, res) => {
        
        if(req.body.rut){
            res.status(200);
            res.end("es valido");
        }else{
            res.status(400);
            res.end("no es valido");
        }
        
  });

app.listen(PORT, () => {
  console.log('Servidor corriendo en http://localhost:' + PORT);
});


app.post('/consultarhorario', (req, res) => {



    console.log(req.body);

    if(!req.body.Rut){
        return res.status(400).json({error: "no existe variable Rut en el Body"});

    }

    const conection = mysql.createConnection(dbData);

    const tiempoActual = new Date();
    const horaactual = consultas.GetHoraActual();
    const disS = tiempoActual.getDay(); 
    console.log(horaactual+" "+disS+" "+req.body.Rut+" "+semestreActual);


    // VERSION ESTATICA
    const query = `SELECT RUT_Docente, Bloque,Inicio,Termino,Ramo FROM Sala  INNER JOIN Instancia ON Sala = Sala.ID INNER JOIN Bloque ON Bloque.ID = Instancia.Bloque INNER JOIN Ramo ON Nombre = Ramo INNER JOIN Asignacion ON Nombre_Ramo = Nombre WHERE  Inicio < '${req.body.Inicio}'  AND Termino > '${req.body.Inicio}' AND Dia_Semana = ${req.body.diaS} AND Periodo = '${req.body.semestreActual}' AND Semestre = Periodo AND RUT_Docente = '${req.body.Rut}'`; 
    // VERSION REAL
    //const query = `SELECT RUT_Docente, Bloque,Inicio,Termino,Ramo FROM Sala  INNER JOIN Instancia ON Sala = Sala.ID INNER JOIN Bloque ON Bloque.ID = Instancia.Bloque INNER JOIN Ramo ON Nombre = Ramo INNER JOIN Asignacion ON Nombre_Ramo = Nombre WHERE  Inicio < '${horaactual}' AND Termino > '${horaactual}'  AND Dia_Semana = ${disS} AND Periodo = '${semestreActual}' AND RUT_Docente = '${req.body.Rut}'`;


    conection.connect((error)=>{
        if(error){
            console.log(error);
            return res.status(500).json({error: "no hay conexion a la BD"});

        }
        conection.query(query,(error,results)=>{
            conection.end();
            if(error){
                return res.status(500).json({error: "no hay conexion a la BD"});

            }
            console.log(results);
            if(results.length != 0){
                var desc = null;
                var desc = cursolocal.find(function(e) {
                    return e.RUT_Docente == req.body.Rut;
                  })
                results[0].Iniciado = (desc != null);

        
                res.status(200);
                res.end(JSON.stringify(results[0]));

            }else{
                return res.status(400).json({error: "no hay clase registrada"});
                
            }
        });
    });
});

app.post('/registrarinicio', (req, res) => {


    if(!req.body.Rut || !req.body.Inicio){
        return res.status(400).json({error: "no existe variable Rut en el Body"});
 
    }






 








    const conection = mysql.createConnection(dbData);
/** 
   // comprobar si ya hizo presente en esta hora
   conection.connect((error)=>{
        if(error){
            return res.status(500).json({error: "no hay conexion a la BD"});
        }
        else{
            const queryComprobar = 'select * from Clase';
         conection.query(queryComprobar,(error,results)=>{
            conection.end();
            if(error){
                return res.status(500).json({error: "no hay conexion a la BD"});
            }
        });
    }
    });
*/


    const tiempoActual = new Date();
    const diaS = tiempoActual.getDay(); 



    conection.connect((error)=>{
        if(error){
            return res.status(500).json({error: "no hay conexion a la BD"});
            
        }
        else{

            // VERSION ESTATICA
                                   
            queryComprobar = `SELECT RUT_Docente, Bloque,Inicio,Termino,Ramo FROM Sala  INNER JOIN Instancia ON Sala = Sala.ID INNER JOIN Bloque ON Bloque.ID = Instancia.Bloque INNER JOIN Ramo ON Nombre = Ramo INNER JOIN Asignacion ON Nombre_Ramo = Nombre WHERE  Inicio < '${req.body.Inicio}'  AND Termino > '${req.body.Inicio}' AND Dia_Semana = ${req.body.diaS} AND Periodo = '${req.body.semestreActual}' AND Semestre = Periodo AND RUT_Docente = '${req.body.Rut}'`; 

            // VERSION REAL
            //const queryComprobar = `SELECT RUT_Docente, Bloque,Inicio,Termino,Ramo FROM Sala  INNER JOIN Instancia ON Sala = Sala.ID INNER JOIN Bloque ON Bloque.ID = Instancia.Bloque INNER JOIN Ramo ON Nombre = Ramo INNER JOIN Asignacion ON Nombre_Ramo = Nombre WHERE  Inicio < ${req.body.Inicio}  AND Termino > ${req.body.Inicio}  AND Inicio < ${horaactual} AND Termino > ${horaactual} AND Dia_Semana = ${diaS} AND Periodo = ${semestreActual} AND Semestre = Periodo AND RUT_Docente = ${req.body.Rut}`;
            conection.query(queryComprobar,(error,results)=>{
                conection.end();
                if(error){
                    return res.status(500).json({error: "no hay conexion a la BD"});
                    
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
                        return res.status(200).json({ok: "se guardo tu registro"});
                    }else{
                        return res.status(400).json({error: 'el profesor ya tiene una clase iniciada'});

                    }
                }else{
                    return res.status(400).json({error: 'no se ha encontrado clase para este profesor'});
                }
            });
        }
    });
});


app.post('/registrarfinal', (req, res) => { // se necesita el rut del docente

    if(!req.body.Rut){
        return res.status(400).json({error: "no existe variable Rut en el Body"});

    }

    const conection = mysql.createConnection(dbData);

    conection.connect((error)=>{
        if(error){
            return res.status(500).json({error: "no hay conexion a la BD"});
        }else{

            // obtiene la hora actual 
            const horaactual = consultas.GetHoraActual();

            // se busca si esta dentro de algun bloque la hora actual
            const query = `SELECT (Termino) FROM Bloque WHERE '${horaactual}' < Termino AND '${horaactual}' > Inicio`;
            
            conection.query(query,(error,results)=>{
                if(error){
                    res.status(500);
                    res.end(error.message);
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

                              const formatofecha = consultas.GetFechaHoy();
                              const queryInsert =`INSERT INTO Clase (Dia, Hora_Inicio, Hora_Termino, IP, Ramo_Nombre, Ramo_Periodo) VALUES ('${formatofecha}','${desc.Inicio}','${horaactual}','192.178.0.0','${desc.Ramo}','${semestreActual}')`;
                              conection.query(queryInsert,(error,results)=>{
                                conection.end();
                                if(error){
                                    return res.status(500).json({error: "no hay conexion a la BD"});
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
                            return res.status(200).json({ok: "registar fin de clases"});

                        }else{
                            return res.status(400).json({error: "no se encontro clase iniciada"});
                        }
                    }else{
                        return res.status(400).json({error: "registro fuera de horario de clase"});
                    }
                }
            });
        }
    });
});

// este se encargara de la gestion del cierre de la clase en el caso de que el profe no lo cierre. esto se hara de manera asincrona 
async function monitorearHorario(){
    
    var esperaMin = 0;

    while(conectado){
        try{
            esperaMin = await procesarHora(esperaMin == 0? 10000:esperaMin*60*1000);
            console.log('la siguiente revision de salas no cerradas es en '+esperaMin+" minutos");


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
                    // obtiene la hora actual 
                    const horaactual = consultas.GetHoraActual();

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
                                
                                // aca se definiria la nueva espera

                                if(!horaGlobalActual){
                                    horaGlobalActual = ((minutoA-20 >= 0? (horaA+':'+(minutoA-20)+':00') : ((horaA - 1)+':'+(minutoA+50)+':00')));
                                    
                                }

                                console.log(horaGlobalActual);
                                // seguiria aca si se llega a un horario ded no clase (los 10 minutos entre bloques o fuera de un horario de clase establecida)
                                // por lo que cerraria todas las clases sin terminar y diferenciar entre cursos que si terminarian y los qei estan en receso
                                RevisionClasesNoIniciadas();
                                RevisionClasesIniciadas(cursolocal);


                                if(consultas.CompararHoras(horaA,minutoA,segundoA)){
                                    cursolocal = [];
                                    resolve(12); 
                                }else{
                                    CalcularSemestre(); // se vuelve a preguntar

                                    const  [horaT, minutoT, segundoT] = ('8:30:00').split(':').map(Number);
                                    horaDiff = horaA > horaT ? (24 - horaA + horaT) : horaT - horaA;  
                                    console.log((minutoT >= minutoA? horaDiff : horaDiff - 1)+':'+(minutoT >= minutoA? (minutoT-minutoA):(60+minutoT-minutoA))+':00');
                                    resolve((horaDiff)*60 + (minutoT-minutoA)+ 2); // 1o horas si ya no hay mas horarios para hoy
                                }
                                
                            }else{
                                horaGlobalActual = horaactual;
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




function RevisionClasesIniciadas(cursolocal){

    cursolocal.forEach(elementos => {


    });

}

function RevisionClasesNoIniciadas(){

}

monitorearHorario(); 

function CalcularSemestre(){


    const fechaActual = new Date();
    const formatofecha = fechaActual.getFullYear()+"-"+fechaActual.getMonth()+"-"+fechaActual.getDay();
    console.log(formatofecha);



    const conection = mysql.createConnection(dbData);
    conection.connect((error)=>{
        if(error){
            console.log(error);
            return ;
            
        }
        const query = `SELECT ID, FechaInicio, FechaTermino FROM Periodo ORDER BY FechaInicio DESC LIMIT 1;`
        conection.query(query,(error,results)=>{
            conection.end();
            

            if(error){
                console.log("error.message");

            }else{
                semestreActual = results[0].ID;
                console.log(results[0].ID);

            }


        });
    });
}
