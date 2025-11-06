const express = require('express');
const app = express();

const port = 3000;

const pool = require('./src/db/db'); // Importar la conexión
const iniciarMiddleware = require('./src/middlewares/iniciarMiddleware')
const crearTablas = require('./src/db/crearTablas')
const iniciarRutas = require('./src/routes/iniciarRutas')

crearTablas(pool);
iniciarMiddleware(express, app);
iniciarRutas(app);

console.log("HOLA desde index.js");

app.listen(port, () => {
  console.log(`App corriendo en http://localhost:${port}`);
});
