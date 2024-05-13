const express = require('express');
const mysql = require('mysql');
const dbData = require('../ENPOINTS.json').DB;
const app = express();
app.use(express.json());

const TiempoRezago = 30; // definida en minutos 
let procesandoClases = false;
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
    



    if(req.body.test){// VERSION ESTATICA        
        parametros = [req.body.semestreActual,req.body.Inicio,req.body.Inicio,req.body.Rut,req.body.semestreActual,req.body.Inicio,req.body.Inicio,req.body.Rut,req.body.diaS]
    }else{ // VERSION REAL
        parametros = [semestreActual,horaactual,horaactual,req.body.Rut,semestreActual,horaactual,horaactual,req.body.Rut,disS]

    }       

    const query = `SELECT Sala as iDSala, RUT_Docente,Ramo,Bloque,Hora_Inicio as Inicio, Hora_Termino as Termino   from Asignacion INNER JOIN 
    (SELECT MIN(ID)as Bloque,MIN(Bloque.Inicio) as Hora_Inicio, MAX(Bloque.Termino) as Hora_Termino,Ramo,Sala,Semestre,Dia_Semana FROM Instancia INNER JOIN Bloque on Instancia.Bloque = Bloque.ID INNER JOIN Asignacion on Ramo = Nombre_Ramo GROUP BY Sala,Semestre,Dia_Semana,Ramo) as t1 on Ramo = Nombre_Ramo and Semestre = ? and Hora_Inicio < ? and Hora_Termino > ? and RUT_Docente = ? and (select Sala from Instancia INNER JOIN Asignacion on Nombre_Ramo = Ramo INNER JOIN Bloque on Bloque = ID where Semestre = ? and Inicio < ? and Termino > ? and Rut_Docente = ? and Dia_Semana= ? ) = Sala;`;



    conection.connect((error)=>{
        if(error){
            console.log(error);
            return res.status(500).json({error: "no hay conexion a la BD"});

        }
        conection.query(query,parametros,(error,results)=>{
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

                if(desc != null){
                    results[0].Iniciado = desc.Inicio;
                }else{
                    results[0].Iniciado = '';
                }
                

        
                res.status(200);
                res.end(JSON.stringify(results[0]));

            }else{
                return res.status(400).json({error: "no hay clase registrada"});
                
            }
        });
    });
});

app.post('/registrarinicio', (req, res) => {


    if(!req.body.Rut){
        return res.status(400).json({error: "no existe variable Rut en el Body"});
 
    }





 



    const fechaActual = consultas.GetFechaHoy()
    const tiempoActual = new Date();
    const diaS = tiempoActual.getDay(); 
    const horaactual = consultas.GetHoraActual(); // este se usaria como referencia para tomar la hora actual que estaria iniciando el profesor
    let parametros


    const conection = mysql.createConnection(dbData);

   // comprobar si ya hizo presente en esta hora
   conection.connect((error)=>{
        if(error){
            return res.status(500).json({error: "no hay conexion a la BD 1"});
        }
        else{
            let queryComprobar;
            if(req.body.test){// VERSION ESTATICA  

                parametros = [req.body.Inicio,req.body.Inicio,req.body.Rut,req.body.fecha]
            }else{
                
                parametros = [horaactual,horaactual,req.body.Rut,fechaActual]
            }
            queryComprobar =`select Rut_Docente,Dia,Inicio,Termino,Hora_Inicio,Hora_Termino,Ramo from Clase Inner JOIN Instancia on Ramo_Nombre = Ramo INNER JOIN Asignacion on Nombre_Ramo = Ramo INNER JOIN Bloque on Bloque = ID where Inicio <= ? and Termino >= ? and Rut_Docente = ? and Dia = ?;`;
            conection.query(queryComprobar,parametros,(error,results)=>{
                if(error){
                    return res.status(500).json({error: "error en la query"});
                }else{
                    if(results.length != 0){
                        return res.status(400).json({error: "ya marcaste tu asistencia en esta hora"})
                    }else{
                        // VERSION ESTATICA     
                     
                        
                        let queryComprobar2;
                        if(req.body.test){// VERSION ESTATICA        
                            parametros = [req.body.semestreActual,req.body.Inicio,req.body.Inicio,req.body.Rut,req.body.semestreActual,req.body.Inicio,req.body.Inicio,req.body.Rut,req.body.diaS]
                        }else{ // VERSION REAL
                            parametros = [semestreActual,horaactual,horaactual,req.body.Rut,semestreActual,horaactual,horaactual,req.body.Rut,diaS]

                        }       

                        queryComprobar2 = `SELECT Sala as iDSala, RUT_Docente,Ramo,Bloque,Hora_Inicio as Inicio, Hora_Termino as Termino   from Asignacion INNER JOIN 
                        (SELECT MIN(ID)as Bloque,MIN(Bloque.Inicio) as Hora_Inicio, MAX(Bloque.Termino) as Hora_Termino,Ramo,Sala,Semestre,Dia_Semana FROM Instancia INNER JOIN Bloque on Instancia.Bloque = Bloque.ID INNER JOIN Asignacion on Ramo = Nombre_Ramo GROUP BY Sala,Semestre,Dia_Semana,Ramo) as t1 on Ramo = Nombre_Ramo and Semestre = ? and Hora_Inicio < ? and Hora_Termino > ? and RUT_Docente = ? and (select Sala from Instancia INNER JOIN Asignacion on Nombre_Ramo = Ramo INNER JOIN Bloque on Bloque = ID where Semestre = ? and Inicio < ? and Termino > ? and Rut_Docente = ? and Dia_Semana= ? ) = Sala;`;

                        conection.query(queryComprobar2,parametros,(error,results)=>{
                            conection.end();
                            if(error){
                                return res.status(500).json({error: "no hay conexion a la BD 3"});
                                
                            }
                            if(results.length != 0){
                                valido = true;
                                var desc = null;
                                var desc = cursolocal.find(function(e) {
                                    return e.RUT_Docente == req.body.Rut;
                                })
                                if(desc == null){ // se guardara localmente como pendiente
                                    console.log("se guardara:")
                                    results[0].Inicio = horaactual;
                                    cursolocal.push(results[0]);
                                    console.log('cursos actuales en pendiente:')
                                    cursolocal.forEach(element => {
                                        console.log(element);
                                    });
                                    return res.status(200).json({Iniciado: horaactual});
                                }else{
                                    return res.status(400).json({error: 'el profesor ya tiene una clase iniciada'});

                                }
                            }else{
                                return res.status(400).json({error: 'no se ha encontrado clase para este profesor'});
                            }
                        });
                    }
                }
            });
        }
    });
});


app.post('/registrarfinal', (req, res) => { // se necesita el rut del docente

    if(!req.body.Rut){
        return res.status(400).json({error: "no existe variable Rut en el Body"});

    }

    if(procesandoClases){
        return res.status(500).json({error:"En servidor esta en proceso de cerrado de clases. Intente mas tarde"})
    }


    const conection = mysql.createConnection(dbData);

    conection.connect((error)=>{
        if(error){
            return res.status(500).json({error: "no hay conexion a la BD 1"});
        }else{

            // obtiene la hora actual 
            const horaactual = consultas.GetHoraActual();

            // se busca si esta dentro de algun bloque la hora actual


            //



            var desc = null
            desc = cursolocal.find(function(e) {
                return e.RUT_Docente == req.body.Rut;
            })
                    
            if(desc != null){
                if(cursolocal.length != 0){
                    console.log("finalizando..."); 

                    const formatofecha = consultas.GetFechaHoy();

                    const [horaA, minutoA, segundoA] = horaactual.split(':').map(Number);
                    const  [horaF, minutoF, segundoF] = desc.Termino.split(':').map(Number);

                    const horafinal = consultas.CompararHoras(horaA, minutoA, segundoA,horaF, minutoF, segundoF)

                    let parametros
                    let queryInsert
                    if(req.body.test){
                        queryInsert =`INSERT INTO Clase (docente,Dia, Hora_Inicio, Hora_Termino, IP,Estado, Ramo_Nombre, Ramo_Periodo) VALUES ('${req.body.Rut}','${req.body.fecha}','${desc.Inicio}','${horafinal}','192.178.0.0','Asistido','${desc.Ramo}','${semestreActual}')`;
                        parametros = [req.body.Rut,req.body.fecha,desc.Inicio,horafinal,'192.178.0.0','Asistido',desc.Ramo,semestreActual]
                    }else{
                        queryInsert =`INSERT INTO Clase (docente,Dia, Hora_Inicio, Hora_Termino, IP,Estado, Ramo_Nombre, Ramo_Periodo) VALUES ('${req.body.Rut}','${formatofecha}','${desc.Inicio}','${horafinal}','192.178.0.0','Asistido','${desc.Ramo}','${semestreActual}')`;
                        parametros = [req.body.Rut,formatofecha,desc.Inicio,horafinal,'192.178.0.0','Asistido',desc.Ramo,semestreActual]
                    }
                    queryInsert = `INSERT INTO Clase (docente, Dia, Hora_Inicio, Hora_Termino, IP,Estado, Ramo_Nombre, Ramo_Periodo) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`
                    
                    conection.query(queryInsert,parametros,(error,results)=>{
                        conection.end();
                        if(error){
                            console.log(error);
                            return res.status(500).json({error: "no hay conexion a la BD 2"});
                        }else{
                            cursolocal = cursolocal.filter(cursosel => cursosel.RUT_Docente != req.body.Rut);
                            desc.Termino = horafinal;
                            console.log("curso finalizazo:" +desc.RUT_Docente+" / "+desc.Inicio+" / "+desc.Termino+" / "+desc.Ramo)
                            console.log('cursos actuales en pendiente:')
                            cursolocal.forEach(element => {
                            console.log(element.RUT_Docente+" / "+element.Inicio+" / "+element.Ramo);

                            });

                            // selection y modificar las columnas de la tabla clase para definir la columna de termino y estado
                            return res.status(200).json({ok: "registar fin de clases"});
                        }
                    });
                }


            }else{
                return res.status(400).json({error: "no se encontro clase iniciada"});
            }
        }
    });
});

let revisarSemestre = true


// este se encargara de la gestion del cierre de la clase en el caso de que el profe no lo cierre. esto se hara de manera asincrona 
async function monitorearHorario(){
    var revisar = false
    let espera = await CalcularTiempo()

    

    while(conectado){
        try{
            let fecha = new Date();
            let fecha2 = new Date(fecha.getTime() + espera*60000)

            console.log('la siguiente revision de salas no cerradas es en '+espera+" minutos ( a las "+fecha2.getHours()+":"+fecha2.getMinutes()+":"+fecha2.getSeconds()+")");


            
            procesandoClases =  await procesarHora(espera == 0? 10000:espera*60*1000);
            espera = await CalcularTiempo()

        }catch(error){
            console.log(error);
            procesandoClases = false
            espera = await CalcularTiempo()
        }
    
    }
};


conectado = true;

function procesarHora(espera){


    return new Promise((resolve,reject) => {
        console.log(`iniciado espera`);
        setTimeout(()=>{
            
            if(revisarSemestre){
                semestreActual = CalcularSemestre()
                revisarSemestre = false
            }

            console.log("Comienza Revision Clases Iniciadas")
            RevisionClasesIniciadas(cursolocal)

            resolve(false)

            
        },espera)
    });
}

function CalcularTiempo(){
    
    return new Promise((resolve,reject) => {
        conection = mysql.createConnection(dbData);
        const horaactual = consultas.GetHoraActual();
        const [horaA, minutoA, segundoA] = (horaactual).split(':').map(Number);




        if(EsDiaLibre()){
            console.log("si")
            revisarSemestre = true;
            const  [horaT, minutoT, segundoT] = ('8:30:00').split(':').map(Number);
            const horaDiff = horaA > horaT ? (24 - horaA + horaT) : horaT - horaA + 24; 
            console.log((minutoT >= minutoA? horaDiff : horaDiff - 1)+':'+(minutoT >= minutoA? (minutoT-minutoA):(60+minutoT-minutoA))+':00');
            return resolve((horaDiff)*60 + (minutoT-minutoA)+ TiempoRezago); // 1o horas si ya no hay mas horarios para hoy
        }else{
            console.log("no")

        }
    
        conection.connect((error)=>{
            if(error){
                console.log("no hay conexion");
                return resolve(10)
            }else{
                // obtiene la hora actual 
                
    
                // se busca si esta dentro de algun bloque la hora actual

                let parametros = [horaactual]
                const query = `SELECT MIN(Inicio) as Inicio,MIN(Termino) as Termino FROM Bloque WHERE ? < Termino `;
                
                conection.query(query,parametros,(error,results)=>{
                    conection.end();
                    if(error){
                        console.log('no se puede conectar a la BD');
                        return resolve(10) // intentar en 10 minutos
                    }
                    else{
                        if(results.length == 0){//error
                            console.log('error');
                            return resolve(10)// intentar en 10 minutos
                            
                        }else{
                            console.log('aca estoy '+results[0].Inicio+' | '+results[0].Termino);
    
                            horaGlobalActual = horaactual;


                            

                            

                            if(consultas.CompararHorasFinDia(horaA,minutoA,segundoA)){
                                
                                const  [horaT, minutoT, segundoT] = results[0].Termino.split(':').map(Number);
                                const  [horaI, minutoI, segundoI] = results[0].Inicio.split(':').map(Number);

                                if(consultas.CompararHorasBool(horaA,minutoA,segundoA,horaI,minutoI,segundoI)){
                                   return resolve(((horaI-horaA)*60 + (minutoI-minutoA)+ TiempoRezago));
                                   //return resolve(1)
                                }else{
                                    return resolve(((horaT-horaA)*60 + (minutoT-minutoA)+ TiempoRezago));
                                    //return resolve(1)
                                }

                                    
                                
        
                                
                            }else{
                                revisarSemestre = true;
                                const  [horaT, minutoT, segundoT] = ('8:30:00').split(':').map(Number);
                                const horaDiff = horaA > horaT ? (24 - horaA + horaT) : horaT - horaA;  
                                console.log((minutoT >= minutoA? horaDiff : horaDiff - 1)+':'+(minutoT >= minutoA? (minutoT-minutoA):(60+minutoT-minutoA))+':00');
                                return resolve((horaDiff)*60 + (minutoT-minutoA)+ TiempoRezago); // 1o horas si ya no hay mas horarios para hoy
                            }


                        }
                    }
                });
            }
        });



    });
}



function RevisionClasesIniciadas(cursolocal){


    procesandoClases = true;
    
    console.log("iniciando cierre de clases aun no terminadas")


    let fecha = new Date();

    let fecha2 = new Date(fecha.getTime() - TiempoRezago*60000)

    var horaactual = fecha2.getHours()+":"+fecha2.getMinutes()+":"+fecha2.getSeconds()



    var hoyFecha = consultas.GetFechaHoy()
    var Acerrar = cursolocal.filter(ele => ele.Termino <= horaactual)
    cursolocal = cursolocal.filter(ele => ele.Termino > horaactual)


    const conection = mysql.createConnection(dbData);
    conection.connect((error)=>{
        if(error){
            procesandoClases = false
            return;
        }else{
            const queryInsert =`INSERT INTO Clase (docente, Dia, Hora_Inicio, Hora_Termino, IP,Estado, Ramo_Nombre, Ramo_Periodo) VALUES (? ,? ,? ,? ,? ,? ,? ,? )`;
            Acerrar.forEach(elementos => {
                
                
                let parametros = [elementos.RUT_Docente,hoyFecha,elementos.Inicio,horaactual,'192.178.0.0','No Terminado',elementos.Ramo,semestreActual]

                conection.query(queryInsert,parametros,(error,results)=>{
                    if(error){
                        procesandoClases = false
                        return;
                    }else{
                        console.log(elementos.Ramo+" terminado")
                    }
        
                })
                
        
            });
            RevisionClasesNoIniciadas()
            procesandoClases = false
        }
    });



}

function RevisionClasesNoIniciadas(){
    console.log("Iniciando revision de clases no iniciadas ");

    const horaactual = consultas.GetHoraActual()
    const fecha = new Date();
    const fecha2 = new Date(fecha.getTime() - TiempoRezago*60000)
    const hoyFecha = consultas.GetFechaHoy()
    const formatohora = fecha2.getHours()+"-"+fecha2.getMinutes()+"-"+fecha2.getSeconds();
    
    console.log("La revision se hara en esta hora: "+ formatohora)

    const conection = mysql.createConnection(dbData);

    conection.connect((error)=>{
        if(error){
            return;
        }else{
            const query = `select Rut_Docente,Nombre_Ramo,Sala,MIN(Inicio) as  Inicio,MAX(Termino) as Termino from Asignacion INNER JOIN Instancia on Ramo = Nombre_Ramo INNER JOIN Bloque on ID = Bloque LEFT JOIN Clase on Ramo_Nombre = Ramo  where Hora_Inicio IS NULL and Dia_Semana = 4 and Semestre = 'Semestre.2-2024' and Termino <= ? GROUP by RUT_Docente,Sala,Nombre_Ramo,Hora_Inicio,Hora_Termino;`
            
            let parametros = [horaactual]

            conection.query(query,parametros,(error,results)=>{
                if(error){
                    procesandoClases = false
                    return;
                }else{


                    console.log(results)
                    results.forEach(elementos => {
                        console.log( elementos.Rut_Docente+" | "+elementos.Nombre_Ramo+" | "+elementos.Sala+" | "+elementos.Inicio+" | "+elementos.Termino)

                        const queryInsert =`INSERT INTO Clase (docente, Dia, Hora_Inicio, Hora_Termino, IP,Estado, Ramo_Nombre, Ramo_Periodo) VALUES (?,?,?,?,?,?,?,?)`;
                        let parametros = [elementos.Rut_Docente,hoyFecha,elementos.Inicio,horaactual,'192.178.0.0','No Iniciado',elementos.Nombre_Ramo,semestreActual]

                        conection.query(queryInsert,parametros,(error,results)=>{
                            if(error){
                                console.log(error)
                                procesandoClases = false
                                return;
                            }else{
                                console.log(elementos.Nombre_Ramo+" terminado")
                            }
                
                        })
                        


                    });
                }
    
            })
        }
    });
}

monitorearHorario(); 



function EsDiaLibre(){
    const fechaActual = new Date();
    const formatofecha = consultas.GetFechaHoy();
    const conection = mysql.createConnection(dbData);
    conection.connect((error)=>{
        if(error){
            console.log(error);
            return ;
            
        }
        const query = `SELECT Dia FROM Dia_Libre where Dia = ?`
        let parametros = [formatofecha]
        conection.query(query,parametros,(error,results)=>{
            conection.end();
            console.log(results)
            if(results.length == 0){
                return false;
            }else{
                return true;
            }


        });
        return false;
    });
}



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
        const query = `SELECT ID FROM Periodo WHERE Estado = 'Activo';`
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
