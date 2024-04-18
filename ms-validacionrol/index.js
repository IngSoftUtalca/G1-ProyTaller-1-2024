const express = require('express');
const app = express();
const PORT = 3011;
app.get('/', (req, res) => {
  res.json({ message: 'Micro servicio para validacion de rol' });
});
app.listen(PORT, () => {
  console.log('Servidor corriendo en http://localhost:' + PORT);
});
