const express = require('express');
const app = express();

const port = 3000;

const pool = require('./src/db/db'); // Importar la conexión
const iniciarMiddleware = require('./src/middlewares/iniciarMiddleware')
const crearTablas = require('./src/db/crearTablas')
const iniciarRutas = require('./src/routes/iniciarRutas')
const simulacionSolicitudRoutes = require('./src/simulacion_y_solicitud_routes');


crearTablas(pool);
iniciarMiddleware(express, app);
iniciarRutas(app);
//Nuevas rutas:
app.use('/', simulacionSolicitudRoutes);


console.log("HOLA desde index.js");

app.listen(port, () => {
  console.log(`App corriendo en http://localhost:${port}`);
});
