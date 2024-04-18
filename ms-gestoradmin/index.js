const express = require('express');
const app = express();
const PORT = 3006;
app.get('/', (req, res) => {
  res.json({ message: 'Micro servicio para gestor de admin' });
});
app.listen(PORT, () => {
  console.log('Servidor corriendo en http://localhost:' + PORT);
});
