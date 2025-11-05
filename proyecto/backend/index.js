const express = require('express');
const app = express();

const port = 3000;
//Para tener sesiones de usuario:
const session = require('express-session');
app.use(session({
  secret: 'clave',
  resave: false,
  saveUninitialized: true
}));



//para poder usar todo tipo de formularios:
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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
