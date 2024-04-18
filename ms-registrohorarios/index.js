const express = require('express');
const app = express();
const PORT = 3010;
app.get('/', (req, res) => {
  res.json({ message: 'Micro servicio para registro de horarios' });
});
app.listen(PORT, () => {
  console.log('Servidor corriendo en http://localhost:' + PORT);
});
