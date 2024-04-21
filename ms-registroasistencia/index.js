const express = require('express');
const app = express();
const PORT = 3009;




app.get('/', (req, res) => {
  res.json({ message: 'Micro servicio para registro asistencia' });
});
app.listen(PORT, () => {
  console.log('Servidor corriendo en http://localhost:' + PORT);
});

app.use(express.json());

app.post('/', (req, res) => {
  console.log(req);
  console.log(req.body.Dia);
  console.log(req.url);
  console.log(req.method);
  res.json(req.body);

});







// este se encargara de la gestion del cierre de la clase en el caso de que el profe no lo cierre. esto se hara de manera asincrona 
async function monitorearHorario(){
    try{
        var hora = new Date();
        //console.log(hora.getHours()+":"+hora.getMinutes());
        // consultar bloque en que esta y se descontaria la hora en que esta 


        var horaespera = 360*1000 ; // se definira la hora de cierre 


        while(conectado){ // esta parte se 
            const respuesta = await procesarHora(horaespera); 
            console.log(respuesta);


            //hora = new Date();
           // console.log(hora.getHours()+":"+hora.getMinutes());
        }
    }catch(error){
    }
};
conectado = true;
function procesarHora(segundos){
    return new Promise((resolve,reject) => {
        console.log(`iniciado nuevo ciclo de 1 hora`);
        setTimeout(()=>{
            console.log(`solicitando entrada a la BD`);
            if(conectado == true){
                resolve('cerrando los horarios');
            }else{
                reject('no se puede conectar a la BD');
            }
        },segundos)
    });
}

//console.log(process.env.TZ);
process.env.TZ = 'America/Santiago'; // se define la zona horaria en chile
monitorearHorario();
