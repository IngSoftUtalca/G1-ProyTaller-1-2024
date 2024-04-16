const express = require('express');
const app = express();
const PORT = 3004;
app.get('/', (req, res) => {
  res.json({ message: 'Micro servicio para horarios' });
});
app.listen(PORT, () => {
  console.log('Servidor corriendo en http://localhost:' + PORT);
});
