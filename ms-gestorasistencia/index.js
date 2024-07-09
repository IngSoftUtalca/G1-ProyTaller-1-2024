const express = require('express');
const mysql = require('mysql');
const dbConfig = require('../ENPOINTS.json').DB;
const dbData = require('../ENPOINTS.json').DB;
const app = express();
const runParametrizedQuery = require('./query.js').runParametrizedQuery;
app.use(express.json());

const TiempoRezago = 30; // definida en minutos 
let procesandoClases = false;
const cors = require('cors');

const corsOptions = {
    origin: ['http://localhost:8080', 'http://localhost:8082', require('../ENPOINTS.json').webdocente, require('../ENPOINTS.json').mainpage],
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }
  
app.use(cors({ origin: corsOptions }));

const consultas = require('./verificaciones.js');


process.env.TZ = 'America/Santiago'; // se define la zona horaria en chile

let semestreActual;
var cursolocal = [];




CalcularSemestre();

const PORT = 3007;

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
    console.log(`Microservicio de registro de asistencia escuchando en http://localhost:${PORT}`);
});

app.post('/justificar', async (req, res) => {
    const { rut, ramo, dia, justificacion } = req.body;
    const fecha = new Date();
    const hora = fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds();
    try {
        connection = mysql.createConnection(dbConfig);
        connection.connect();
        const query = `
        INSERT INTO Justificacion (Fecha, Hora, RUT, Detalle, Clase_Dia, Ramo_Nombre, Ramo_Periodo)
        VALUES (?, ?, ?, ?, ?, ?, (SELECT Periodo.ID FROM Periodo WHERE Estado = 'Activo'));
        `;

        await runParametrizedQuery(connection, query, [fecha, hora, rut, justificacion, dia, ramo])
            .then((result) => {
                res.status(200).json({ message: 'Justificación registrada' });
            })
            .catch((error) => {
                res.status(501).json({ message: 'Error de consulta', error: error.message });
            })
            .finally(() => {
                if (connection && connection.state !== 'disconnected') {
                    connection.end();
                }
            });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
});

app.post('/RevisarEstadoClases', async (req, res) => { 

    //const libre = await EsDiaLibre()
    const librev= true
    
    if(libre){
        await CalcularSemestre()

        await RevisionClasesIniciadas();
    
        await  RevisionClasesNoIniciadas();
    
        return res.status(200).json({ok: "ok"});
    }else{
        return res.status(400).json({ok: "no es libre"});
    }


});



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



