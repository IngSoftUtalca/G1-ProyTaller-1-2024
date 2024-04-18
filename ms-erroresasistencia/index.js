const express = require('express');
const app = express();
const PORT = 3005;
app.get('/', (req, res) => {
  res.json({ message: 'Micro servicio para error de asistencia' });
});
app.listen(PORT, () => {
  console.log('Servidor corriendo en http://localhost:' + PORT);
});
