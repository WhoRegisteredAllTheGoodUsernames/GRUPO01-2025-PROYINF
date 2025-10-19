const frontDir = require('./frontend');
const registrarUsuario = require('../controllers/registrarUsuario');
const registrarSimulacion = require('../controllers/registrarSimulacion');

function iniciarRutas(app) {
  app.post('/registro', (req, res) => {
    registrarUsuario(req.body);
    res.redirect(frontDir);
  });

  app.post('/login', (req, res) => {
    console.log(req.body);
    res.redirect(frontDir);
  });


  app.post('/simulacion', async (req, res) => {
    try {
      await registrarSimulacion(req.body);
      console.log('Simulación registrada:', req.body);
      res.redirect(frontDir);
    } catch (error) {
      console.error('Error al registrar simulación:', error);
      res.status(500).send('Error al registrar simulación');
    }
  });

  app.post('/mod_scoring', (req, res) => {
    console.log(req.body);
    res.redirect(frontDir);
  });

  app.post('/logout', (req, res) => {
    console.log(req.body);
    res.redirect(frontDir);
  });
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
