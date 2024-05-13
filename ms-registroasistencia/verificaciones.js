const mysql = require('mysql');
process.env.TZ = 'America/Santiago'; 
const dbData = require('../ENPOINTS.json').DB;

let semestreActual;


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
                return;
            }else{
                semestreActual = results[0].ID;
                return results[0].ID;
            }


        });
    });
}


function GetFechaHoy(){
    const fechaActual = new Date();
    return fechaActual.getFullYear()+"-"+(fechaActual.getMonth()+1)+"-"+fechaActual.getUTCDate();
}


function GetHoraActual(){
    const tiempoActual = new Date();
    return tiempoActual.getHours()+":"+tiempoActual.getMinutes()+":"+tiempoActual.getSeconds();
    
}






function CompararHoras(HoraA,MinutoA,SegundoA,HoraF,MinutoF,SegundoF)
{
    var actual = new Date();
    var final = new Date();
    actual.setHours(HoraA,MinutoA,SegundoA);

    final.setHours(HoraF,MinutoF,SegundoF); 

    if( actual <= final ){
        return actual.getHours()+":"+actual.getMinutes()+":"+actual.getSeconds();
    }else{
        return final.getHours()+":"+final.getMinutes()+":"+final.getSeconds();
    }
}

function CompararHorasBool(HoraA,MinutoA,SegundoA,HoraF,MinutoF,SegundoF)
{
    var actual = new Date();
    var final = new Date();
    actual.setHours(HoraA,MinutoA,SegundoA);

    final.setHours(HoraF,MinutoF,SegundoF); 

    if( actual < final ){
        return true;
    }else{
        return false;
    }
}

function CompararHorasFinDia(HoraA,MinutoA,SegundoA)
{
    var actual = new Date();
    var inicio = new Date();
    var final = new Date();

    actual.setHours(HoraA,MinutoA,SegundoA);
    inicio.setHours(8,30,0); 
    final.setHours(22,20,0); 

    if(actual >= inicio && actual < final ){
        console.log('true')
        return true;
    }else{
        console.log('false')
        return false;
    }
}

module.exports = {
    CalcularSemestre,
    GetFechaHoy,
    GetHoraActual,
    CompararHoras,
    CompararHorasBool,
    CompararHorasFinDia
};



