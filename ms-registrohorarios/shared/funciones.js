const bloques = require('./constantes.json').bloques;

function getBloqueId(hora) {
    if (!hora) {
      return null;
    }
    const [horaH, horaM] = hora.split(':').map(Number);
    for (const bloque of bloques) {
      const [inicioH, inicioM] = bloque.inicio.split(':').map(Number);
      const [finH, finM] = bloque.fin.split(':').map(Number);
      if ((horaH > inicioH || (horaH === inicioH && horaM >= inicioM)) && (horaH < finH || (horaH === finH && horaM <= finM))) {
        return bloque.id;
      }
    }
    return null;
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

function getInstancia(jsonData){
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
          return {SALA: 'SIN SALA'};
        }
        return {SALA: `${edificio}-${sala}`, INICIO: `${inicio}`, TERMINO: `${termino}`,DIA: `${dia}` , NOMBRE: `${nombre} Seccion ${seccion}`};
        
      }).filter(inst => inst !== null);
    
}

module.exports = {
    getBloqueId,
    runQuery,
    getInstancia
};