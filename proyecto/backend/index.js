const express = require('express');
const app = express();
require('dotenv').config();

const port = 3000;

const pool = require('./src/db/db'); // Importar la conexión
const iniciarMiddleware = require('./src/middlewares/iniciarMiddleware')
const crearTablas = require('./src/db/crearTablas')
const iniciarRutas = require('./src/routes/iniciarRutas')
const simulacionSolicitudRoutes = require('./src/routes/simulacion_y_solicitud_routes');
const docusignRutas = require('./src/routes/docusignRutas');
const historialSimRutas = require('./src/routes/historialSimRoutes');
const historialPrestamosRoutes = require("./src/routes/historialPrestamosRoutes");



crearTablas(pool);
iniciarMiddleware(express, app);
iniciarRutas(app);
//Nuevas rutas:
app.use('/', simulacionSolicitudRoutes);
app.use('/historialSimulaciones', historialSimRutas);
app.use("/historialPrestamos", historialPrestamosRoutes);
app.use('/api/docusign', docusignRutas);

// Lo ocupe para probar el ngrok no mais
app.get('/', (req, res)=> {
    res.status(200).send('wena ctmmmm </h1>');
})

console.log("HOLA desde index.js");

app.listen(port, () => {
    console.log(`App corriendo en http://localhost:${port}`);
});
