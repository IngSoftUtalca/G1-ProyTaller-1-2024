const express = require('express');
const app = express();
const PORT = 3007;
app.get('/', (req, res) => {
  res.json({ message: 'Micro servicio para asistencia docente' });
});
app.listen(PORT, () => {
  console.log('Servidor corriendo en http://localhost:' + PORT);
});
