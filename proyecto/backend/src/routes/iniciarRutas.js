const frontDir = require('./frontend');
const registrarUsuario = require('../controllers/registrarUsuario');
const registrarSimulacion = require('../controllers/ingresarSimulacion');
const resultadoSimulacion = require('../controllers/resultadoSimulacion');
const { login, logout } = require('../controllers/loginController');

function iniciarRutas(app) {
  app.post('/registro', async (req, res) => {
  try {
    await registrarUsuario(req.body);
    res.redirect(frontDir);
  } catch (error) {
    console.error("Error en /registro:", error.message);
    res.status(400).send(error.message);
  }
});


  // Login real con sesiones
  app.post('/login', login);

  // Simulación existente
  app.post('/simulacion', async (req, res) => {
    try {
      await registrarSimulacion(req, res);
    } catch (error) {
      console.error('Error al registrar simulación:', error);
      res.status(500).send('Error al registrar simulación');
    }
  });

  // ver resultados de simulación
  app.get('/resultadoSimulacion', resultadoSimulacion);

  app.post('/mod_scoring', (req, res) => {
    console.log(req.body);
    res.redirect(frontDir);
  });

  // Logout real con eliminación de sesión
  app.post('/logout', logout);
}

module.exports = iniciarRutas;


//Antiguo:

// const frontDir = require('./frontend');
// const registrarUsuario = require('../controllers/registrarUsuario');

// function iniciarRutas(app){
// 	app.post('/registro', (req, res) => {
// 		registrarUsuario(req.body);
// 		res.redirect(frontDir);
// 	});

// 	app.post('/login', (req, res) => {
// 		console.log(req.body);
// 		res.redirect(frontDir);
// 	});

// 	app.post('/simulacion', (req, res) => {
// 		console.log(req.body);
// 		res.redirect(frontDir);
// 	});

// 	app.post('/mod_scoring', (req, res) => {
// 		console.log(req.body);
// 		res.redirect(frontDir);
// 	});

// 	app.post('/logout', (req, res) => {
// 		console.log(req.body);
// 		res.redirect(frontDir);
// 	});
// }

// module.exports = iniciarRutas;
