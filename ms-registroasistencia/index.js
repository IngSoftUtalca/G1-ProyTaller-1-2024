const express = require('express');
const mysql = require('mysql');
const dbData = require('../ENPOINTS.json').DB;
const app = express();
const endpoints = require('../ENPOINTS.json');
app.use(express.json());

const TiempoRezago = 30; // definida en minutos 
let procesandoClases = false;

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
app.use('/consultarhorario', checkOriginMiddleware);
app.use('/registrarinicio', checkOriginMiddleware);
app.use('/registrarfinal', checkOriginMiddleware);
app.use('/RevisarEstadoClases', checkOriginMiddleware);

const consultas = require('./verificaciones.js');


process.env.TZ = 'America/Santiago'; // se define la zona horaria en chile

let semestreActual;
var cursolocal = [];
CalcularSemestre();

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


    if(!req.body.Rut){
        return res.status(400).json({error: "no existe variable Rut en el Body"});

    }

    const conection = mysql.createConnection(dbData);

    const tiempoActual = new Date();
    const horaactual = consultas.GetHoraActual();
    const disS = tiempoActual.getDay(); 

    if(req.body.test){// VERSION ESTATICA        
        parametros = [req.body.semestreActual,req.body.Inicio,req.body.Inicio,req.body.Rut,req.body.semestreActual,req.body.Inicio,req.body.Inicio,req.body.Rut,req.body.diaS]
    }else{ // VERSION REAL
        parametros = [semestreActual,horaactual,horaactual,req.body.Rut,semestreActual,horaactual,horaactual,req.body.Rut,disS]

    }       

    const query = `SELECT Sala as idSala, RUT_Docente,Ramo,Bloque,Hora_Inicio as Inicio, Hora_Termino as Termino   from Asignacion INNER JOIN 
    (SELECT MIN(ID)as Bloque,MIN(Bloque.Inicio) as Hora_Inicio, MAX(Bloque.Termino) as Hora_Termino,Ramo,Sala,Semestre,Dia_Semana FROM Instancia INNER JOIN Bloque on Instancia.Bloque = Bloque.ID INNER JOIN Asignacion on Ramo = Nombre_Ramo GROUP BY Sala,Semestre,Dia_Semana,Ramo) as t1 on Ramo = Nombre_Ramo and Semestre = ? and Hora_Inicio < ? and Hora_Termino > ? and RUT_Docente = ? and (select Sala from Instancia INNER JOIN Asignacion on Nombre_Ramo = Ramo INNER JOIN Bloque on Bloque = ID where Semestre = ? and Inicio < ? and Termino > ? and Rut_Docente = ? and Dia_Semana= ? ) = Sala;`;



    conection.connect((error)=>{
        if(error){
            
            return res.status(500).json({error: "no hay conexion a la BD"});

        }
        conection.query(query,parametros,(error,results)=>{
            conection.end();
            if(error){
                return res.status(500).json({error: "no hay conexion a la BD"});

            }
            
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

app.post('/registrarinicio', async (req, res) => {


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
            queryComprobar =`select Rut_Docente,Dia,Inicio,Termino,Hora_Inicio,Hora_Termino,Ramo from Clase Inner JOIN Instancia on Ramo_Nombre = Ramo INNER JOIN Asignacion on Nombre_Ramo = Ramo INNER JOIN Bloque on Bloque = ID where Inicio <= ? and Termino >= ? and Rut_Docente = ? and Dia = ? and (Estado != 'Pendiente');`;
            conection.query(queryComprobar,parametros,(error,results)=>{
                if(error){
                    return res.status(500).json({error: "error en la query"});
                }else{
                    if(results.length != 0){
                        return res.status(400).json({error: "ya marcaste tu asistencia en esta hora"})
                    }else{

                        parametros = [req.body.Rut]
                        queryComprobar2 = `SELECT * FROM Clase where Estado = 'Pendiente' and docente = ?`;

                        conection.query(queryComprobar2,parametros,async (error,results2)=>{
                            conection.end();
                            if(error){
                                console.log(error);
                                return res.status(500).json({error: "no hay conexion a la BD 3"});
                                
                            }else{
                                if(results2.length == 0){ // se guardara como pendiente
                                    await IniciarClase([req.body.Rut,fechaActual,horaactual,horaactual,req.body.IP,'Pendiente',req.body.Ramo,semestreActual]) // (docente, Dia, Hora_Inicio, Hora_Termino, IP, Estado, Ramo_Nombre, Ramo_Periodo)
                                    return res.status(200).json({Valido:true,Iniciado: horaactual,Ramo:req.body.Ramo,Evento:"iniciado"});
                                }else{

                                    if( results2[0].Ramo_Nombre == req.body.Ramo){ // no hacec nada ya que es la misma clase 
                                        return res.status(200).json({Valido:true,Iniciado: horaactual,Ramo:req.body.Ramo,Evento:"ya iniciado"});
                                    }else{ // 

                                        //return res.status(400).json({error: 'el profesor ya tiene una clase iniciada'});

                                        await CerrarClaseIniciadaDocente(req.body.Rut,[req.body.Rut,fechaActual,horaactual,horaactual,req.body.IP,'Pendiente',req.body.Ramo,semestreActual]) // se cierra la clase que ya estaba abierta
                                        
                                        return res.status(200).json({Valido:true,Iniciado: horaactual,Ramo:req.body.Ramo,Evento:"Cerro pendiente e inicio otro"});
                                    }
                                }
                            }
                        });
                    }
                }
            });
        }
    });
});


app.post('/registrarfinal', async (req, res) => { // se necesita el rut del docente
    try{
    if(!req.body.Rut){
        return res.status(400).json({error: "no existe variable Rut en el Body"});

    }

    if(procesandoClases){
        return res.status(500).json({error:"En servidor esta en proceso de cerrado de clases. Intente mas tarde"})
    }

     let resu = await CerrarClaseIniciadaDocente(req.body.Rut,null)
    if(resu == 200){
        return res.status(200).json({ok: "registar fin de clases"});
    }else if(resu == 400){
        return res.status(400).json({error: "no se encontro clase iniciada"});
    }else{
        return res.status(500).json({error:"no hay conexion a la BD 2" });
    
    }
     
    }catch(e){
        console.log(e)
    }

});

let revisarSemestre = true



async function  CerrarClaseIniciadaDocente(rut,reemplazo){


    return new Promise((resolve,reject) => {
        let horaactual = consultas.GetHoraActual()
        const conection = mysql.createConnection(dbData);
        conection.connect((error)=>{
            if(error){
                procesandoClases = false
                return;
            }else{
                console.log(horaactual,rut)
                parametros = [horaactual,rut]
                let queryUpt = `UPDATE Clase SET Hora_Termino =? ,Estado='Asistido'  WHERE docente = ? and Estado = 'Pendiente' `
                conection.query(queryUpt,parametros,(error,results)=>{
                    if(error){
                        
                        return reject(500);
                    }else{
                        
                        if(reemplazo != null){
                            IniciarClase(reemplazo); 
                        }
                        return resolve(200)
                    }
                    
                })
            }
        });
        
        
        

    })
    

}


async function monitorearHorario(){
    var revisar = false
    let espera = await CalcularTiempo()

    

    while(conectado){
        try{
            let fecha = new Date();
            let fecha2 = new Date(fecha.getTime() + espera*60000)

            procesandoClases =  await procesarHora(espera == 0? 10000:espera*60*1000);
            espera = await CalcularTiempo()

        }catch(error){
            procesandoClases = false
            espera = await CalcularTiempo()
        }
    
    }
};


conectado = true;

function procesarHora(espera){


    return new Promise((resolve,reject) => {
        setTimeout(()=>{
            
            if(revisarSemestre){
                semestreActual = CalcularSemestre()
                revisarSemestre = false
            }

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

            revisarSemestre = true;
            const  [horaT, minutoT, segundoT] = ('8:30:00').split(':').map(Number);
            const horaDiff = horaA > horaT ? (24 - horaA + horaT) : horaT - horaA + 24; 

            return resolve((horaDiff)*60 + (minutoT-minutoA)+ TiempoRezago); 
        }else{


        }
    
        conection.connect((error)=>{
            if(error){

                return resolve(10)
            }else{

                let parametros = [horaactual]
                const query = `SELECT MIN(Inicio) as Inicio,MIN(Termino) as Termino FROM Bloque WHERE ? < Termino `;
                
                conection.query(query,parametros,(error,results)=>{
                    conection.end();
                    if(error){

                        return resolve(10) 
                    }
                    else{
                        if(results.length == 0 ){

                            return resolve(10)
                            
                        }else{
  
    
                            horaGlobalActual = horaactual;


                            

                            

                            if(consultas.CompararHorasFinDia(horaA,minutoA,segundoA)){
                                
                                const  [horaT, minutoT, segundoT] = results[0].Termino.split(':').map(Number);
                                const  [horaI, minutoI, segundoI] = results[0].Inicio.split(':').map(Number);

                                if(consultas.CompararHorasBool(horaA,minutoA,segundoA,horaI,minutoI,segundoI)){
                                   return resolve(((horaI-horaA)*60 + (minutoI-minutoA)+ TiempoRezago));

                                }else{
                                    return resolve(((horaT-horaA)*60 + (minutoT-minutoA)+ TiempoRezago));

                                }

                                    
                                
        
                                
                            }else{
                                revisarSemestre = true;
                                const  [horaT, minutoT, segundoT] = ('8:30:00').split(':').map(Number);
                                const horaDiff = horaA > horaT ? (24 - horaA + horaT) : horaT - horaA;  

                                return resolve((horaDiff)*60 + (minutoT-minutoA)+ TiempoRezago); 
                            }


                        }
                    }
                });
            }
        });



    });
}



function RevisionClasesIniciadasANTIGUA(cursolocal){


    procesandoClases = true;
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
                let parametros = [elementos.RUT_Docente,hoyFecha,elementos.Inicio,horaactual,'0.0.0.0','Ausente',elementos.Ramo,semestreActual]
                conection.query(queryInsert,parametros,(error,results)=>{
                    if(error){
                        procesandoClases = false
                        return;
                    }else{
                    }
                })
            });
            RevisionClasesNoIniciadas()
            procesandoClases = false
        }
    });



}



app.post('/RevisarEstadoClases', async (req, res) => { 

    await CalcularSemestre()

    await RevisionClasesIniciadas();

    await  RevisionClasesNoIniciadas();

    return res.status(200).json({ok: "ok"});

});

// 
function RevisionClasesIniciadas2(){

    new Promise((resolve,reject) => {
        procesandoClases = true;
        let fecha = new Date();
        let fecha2 = new Date(fecha.getTime() - TiempoRezago*60000)
        var horaactual = fecha2.getHours()+":"+fecha2.getMinutes()+":"+fecha2.getSeconds()
        var hoyFecha = consultas.GetFechaHoy()

        const conection = mysql.createConnection(dbData);
        conection.connect((error)=>{
            if(error){
                procesandoClases = false
                return;
            }else{

                const queryInsert =`UPDATE Clase SET Estado='No Finalizado' WHERE Estado = 'Pendiente'`;
                conection.query(queryInsert,(error,results)=>{
                    if(error){
                        procesandoClases = false
                        return;
                    }else{
                        
                    }
                })
                RevisionClasesNoIniciadas()
                procesandoClases = false
            }
        });
        resolve();
    }
    
    )};

    async function RevisionClasesIniciadas(){
        new Promise((resolve,reject) => {

        const horaactual = consultas.GetHoraActual()
        const fecha = new Date();
        const fecha2 = new Date(fecha.getTime() - TiempoRezago*60000)
        const hoyFecha = consultas.GetFechaHoy()
        const formatohora = fecha2.getHours()+"-"+fecha2.getMinutes()+"-"+fecha2.getSeconds();
        const disS = fecha.getDay(); 
    
    
        const conection = mysql.createConnection(dbData);
    
        conection.connect((error)=>{
            if(error){
                return;
            }else{
                console.log(disS + " "+ semestreActual+" "+ horaactual)
                //const query = `select Rut_Docente,Nombre_Ramo,Sala,MIN(Inicio) as  Inicio,MAX(Termino) as Termino from Asignacion INNER JOIN Instancia on Ramo = Nombre_Ramo INNER JOIN Bloque on ID = Bloque LEFT JOIN Clase on Ramo_Nombre = Ramo  where Hora_Inicio IS NULL and Dia_Semana = ? and Semestre = ? and Termino <= ? GROUP by RUT_Docente,Sala,Nombre_Ramo,Hora_Inicio,Hora_Termino;`
                const query = `select Rut_Docente,Nombre_Ramo,Sala,MIN(Inicio) as  Inicio,MAX(Termino) as Termino, Estado from Asignacion INNER JOIN Instancia on Ramo = Nombre_Ramo INNER JOIN Bloque on ID = Bloque INNER JOIN Clase on Ramo_Nombre = Ramo where Estado = 'Pendiente' and Dia_Semana = ? and Semestre = ? and Termino <= ? GROUP by RUT_Docente,Sala,Nombre_Ramo,Hora_Inicio,Hora_Termino,Estado;`
                
                let parametros = [disS,semestreActual,horaactual]
    
                conection.query(query,parametros,(error,results)=>{
                    if(error){
                        procesandoClases = false
                        return;
                    }else{
    
                        //console.log(results);
                        
                        results.forEach(elementos => {
    
                            let parametros = [elementos.Rut_Docente,elementos.Nombre_Ramo]

                            const queryInsert =`UPDATE Clase SET Estado='Asistido' WHERE Estado = 'Pendiente' and docente = ? and Ramo_Nombre = ?`;
                            conection.query(queryInsert,parametros,(error,results)=>{
                                if(error){
                                    procesandoClases = false
                                    return;
                                }else{
                                    
                                }
                            })
                            
    
    
                        });
                    }
        
                })
            }
        });
        resolve();
    })
    }




    async function RevisionClasesNoIniciadas(){

    new Promise((resolve,reject) => {
    let horaactual = consultas.GetHoraActual()
    let fecha = new Date();
    let fecha2 = new Date(fecha.getTime() - TiempoRezago*60000)
    let hoyFecha = consultas.GetFechaHoy()
    let formatohora = fecha2.getHours()+"-"+fecha2.getMinutes()+"-"+fecha2.getSeconds();
    let disS = fecha.getDay(); 






    const conection = mysql.createConnection(dbData);

    conection.connect((error)=>{
        if(error){
            return;
        }else{
            console.log(disS + " "+ semestreActual+" "+ horaactual)
            //const query = `select Rut_Docente,Nombre_Ramo,Sala,MIN(Inicio) as  Inicio,MAX(Termino) as Termino from Asignacion INNER JOIN Instancia on Ramo = Nombre_Ramo INNER JOIN Bloque on ID = Bloque LEFT JOIN Clase on Ramo_Nombre = Ramo  where Hora_Inicio IS NULL and Dia_Semana = ? and Semestre = ? and Termino <= ? GROUP by RUT_Docente,Sala,Nombre_Ramo,Hora_Inicio,Hora_Termino;`
            const query  = `select Rut_Docente,Nombre_Ramo,Sala,Inicio,Termino from (select Asignacion.RUT_Docente, Instancia.Dia_Semana,Nombre_Ramo,Sala,MIN(Inicio) as Inicio,MAX(Termino) as Termino,? as DiaActual from Asignacion INNER JOIN Instancia on Ramo = Nombre_Ramo INNER JOIN Bloque on ID = Bloque where Instancia.Semestre = ? GROUP by Asignacion.RUT_Docente, Sala,Nombre_Ramo,Instancia.Dia_Semana ) as THora LEFT JOIN (Select * from Clase where Clase.Dia = ? ) as TClase on THora.Nombre_Ramo = TClase.Ramo_Nombre where THora.Dia_Semana = ? and (THora.DiaActual != TClase.Dia or TClase.Dia IS NULL) and Termino < ?`;   
            //let parametros = [disS,semestreActual,horaactual]
            let parametros = [hoyFecha,semestreActual,hoyFecha,disS,horaactual]
            //let parametros = ['2024-06-15','Semestre.1-2024','2024-06-18',5,"20:00:00"]
  
            conection.query(query,parametros,(error,results)=>{
                if(error){
                    console.log(error);
                    procesandoClases = false
                    return;
                }else{

                    console.log(results);
                    
                    results.forEach(elementos => {


                        const queryInsert =`INSERT INTO Clase (docente, Dia, Hora_Inicio, Hora_Termino, IP,Estado, Ramo_Nombre, Ramo_Periodo) VALUES (?,?,?,?,?,?,?,?)`;
                        let parametros = [elementos.Rut_Docente,hoyFecha,elementos.Inicio,elementos.Termino,'0.0.0.0','Ausente',elementos.Nombre_Ramo,semestreActual]

                        conection.query(queryInsert,parametros,(error,results1)=>{
                            if(error){

                                procesandoClases = false
                                return;
                            }else{

                            }
                
                        })
                        


                    });
                }
    
            })
        }
    });
    resolve();
})
}

//monitorearHorario(); 



function EsDiaLibre(){
    const fechaActual = new Date();
    const formatofecha = consultas.GetFechaHoy();
    const conection = mysql.createConnection(dbData);
    conection.connect((error)=>{
        if(error){

            return ;
            
        }
        const query = `SELECT Dia FROM Dia_Libre where Dia = ?`
        let parametros = [formatofecha]
        conection.query(query,parametros,(error,results)=>{
            conection.end();

            if(results.length == 0){
                return false;
            }else{
                return true;
            }


        });
        return false;
    });
}



async function CalcularSemestre(){


    const fechaActual = new Date();
    const formatofecha = fechaActual.getFullYear()+"-"+fechaActual.getMonth()+"-"+fechaActual.getDay();




    const conection = mysql.createConnection(dbData);
    conection.connect((error)=>{
        if(error){

            return ;
            
        }
        const query = `SELECT ID FROM Periodo WHERE Estado = 'Activo';`
        conection.query(query,(error,results)=>{
            conection.end();
            

            if(error){


            }else{
                semestreActual = results[0].ID;


            }


        });
    });




}


async function IniciarClase(parametros){


    const conection = mysql.createConnection(dbData);
    conection.connect((error)=>{
        if(error){

            return ;
            
        }
        const query = `INSERT INTO Clase(docente, Dia, Hora_Inicio, Hora_Termino, IP, Estado, Ramo_Nombre, Ramo_Periodo) VALUES (?,?,?,?,?,?,?,?)`
        conection.query(query,parametros,(error,results)=>{
            conection.end();
            

            if(error){


            }else{

            }


        });
    });
}


function TerminarClase(){

}