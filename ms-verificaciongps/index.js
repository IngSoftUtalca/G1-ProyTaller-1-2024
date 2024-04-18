const express = require('express');
const app = express();
const PORT = 3012;
app.get('/', (req, res) => {
  res.json({ message: 'Micro servicio para verificacion de gps' });
});
app.listen(PORT, () => {
  console.log('Servidor corriendo en http://localhost:' + PORT);
});
