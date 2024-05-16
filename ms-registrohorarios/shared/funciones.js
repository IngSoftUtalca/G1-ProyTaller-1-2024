const bloques = require('./constantes.json').bloques;
const moment = require("moment-timezone");

function getBloqueId(hora) {
  if (!hora) {
    return 12;
  }
  for (let i = 0; i < bloques.length; i++) {
    const horaInicioBloque = moment(bloques[i].inicio, "HH:mm:ss");
    const horaFinBloque = moment(bloques[i].fin, "HH:mm:ss");
    const horaActual = moment(hora, "HH:mm");
    // console.log(horaActual.format("HH:mm")+" Bloque: "+bloques[i].id+" | "+bloques[i].inicio+" - "+bloques[i].fin);
    if (horaActual.isBetween(horaInicioBloque, horaFinBloque, null, '[]')) {
      return bloques[i].id;
    }
  }
  return 12;
}

async function runQuery(connection, query, params) {
  return new Promise((resolve, reject) => {
    connection.query(query, params, (error, results) => {
      if (error) {
        console.error('Error ejecutando la query: ', error);
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

function getInstancia(jsonData) {
  return jsonData.map(obj => {
    let sala = obj.SALA;
    let edificio = obj.EDIFICIO;
    const inicioDecimal = obj["HORA INICIO"];
    const terminoDecimal = obj["HORA FIN"];
    const seccion = obj.LIGA.split("-")[1];
    const nombre = obj.NOMBRE.replace('(CURICO)', '').trim();

    const inicio = inicioDecimal ? `${Math.floor(inicioDecimal * 24)}:${Math.round((inicioDecimal * 24 - Math.floor(inicioDecimal * 24)) * 60).toString().padStart(2, '0')}` : '';
    const termino = terminoDecimal ? `${Math.floor(terminoDecimal * 24)}:${Math.round((terminoDecimal * 24 - Math.floor(terminoDecimal * 24)) * 60).toString().padStart(2, '0')}` : '';
    if (inicio === 'NaN' || termino === 'NaN') {
      return null;
    }
    const dia = obj.DIA;
    if (!sala && !edificio) {
      return { SALA: 'SIN SALA' };
    }
    return { SALA: `${edificio}-${sala}`, INICIO: `${inicio}`, TERMINO: `${termino}`, DIA: `${dia}`, NOMBRE: `${nombre} Seccion ${seccion}` };

  }).filter(inst => inst !== null);

}

module.exports = {
  getBloqueId,
  runQuery,
  getInstancia
};