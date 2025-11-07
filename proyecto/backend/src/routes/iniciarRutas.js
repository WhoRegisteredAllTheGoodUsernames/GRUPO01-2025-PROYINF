const frontDir = require('./frontend');
const registrarUsuario = require('../controllers/registrarUsuario');
const { obtenerUltimoScoring, registrarScoring } = require('../controllers/aplicarScoring'); 
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

	// Logout real con eliminación de sesión
	app.post('/logout', logout);

	// Registrar o modificar función de scoring (solo bancarios)
	app.post('/mod_scoring', async (req, res) => {
		const fechaHora = new Date();
		if (!req.session.user || req.session.user.tipo != "B") {
			res.status(401).send("Tiene que iniciar sesión o no puede acceder al recurso");
			return;
		}

		await registrarScoring([req.body["funcion"], fechaHora, req.session.user.rut]);
		res.redirect(frontDir);
	});

	// Obtener última función de scoring
	app.get('/mod_scoring', async (req, res) => {
		const func = await obtenerUltimoScoring();
		
		if (func == {}){
			res.send("");
		} else {
			res.send(func["funcion"]);
		}
	});
}

module.exports = iniciarRutas;




//Versión con todas las rutas:


// const frontDir = require('./frontend');
// const registrarUsuario = require('../controllers/registrarUsuario');
// const registrarSimulacion = require('../controllers/registrarSimulacion');
// const resultadoSimulacion = require('../controllers/resultadoSimulacion');
// const { obtenerUltimoScoring, registrarScoring } = require('../controllers/aplicarScoring'); 
// const { login, logout } = require('../controllers/loginController');
// const solicitudController = require('../controllers/solicitudController');


// function iniciarRutas(app) {
// 	app.post('/registro', async (req, res) => {
// 		try {
// 			await registrarUsuario(req.body);
// 			res.redirect(frontDir);
// 		} catch (error) {
// 			console.error("Error en /registro:", error.message);
// 			res.status(400).send(error.message);
// 		}
// 	});

// 	// Login real con sesiones
// 	app.post('/login', login);

// 	// Logout real con eliminación de sesión
// 	app.post('/logout', logout);

// 	// Simulación existente
// 	app.post('/simulacion', async (req, res) => {
// 		try {
// 			await registrarSimulacion(req, res);
// 		} catch (error) {
// 			console.error('Error al registrar simulación:', error);
// 			res.status(500).send('Error al registrar simulación');
// 		}
// 	});

// 	// ver resultados de simulación
// 	app.get('/resultadoSimulacion', resultadoSimulacion);
// 	// Ver detalle de simulación y comenzar solicitud
// 	app.get('/solicitud/:idSimulacion', async (req, res) => {
// 		try {
// 			await solicitudController.verSimulacion(req, res);
// 		} catch (error) {
// 			console.error('Error al obtener simulación:', error);
// 			res.status(500).send('Error al obtener simulación');
// 		}
// 	});


// 	app.post('/mod_scoring', async (req, res) => {
// 		const fechaHora = new Date();
// 		if (!req.session.user || req.session.user.tipo != "B"){
// 			res.status(401).send("Tiene que iniciar sesión o no puede acceder al recurso");
// 			return;
// 		}

// 		await registrarScoring([req.body["funcion"], fechaHora, req.session.user.rut]);
// 		res.redirect(frontDir);
// 	});
	
// 	app.get('/mod_scoring', async (req, res) => {
// 		const func = await obtenerUltimoScoring();
// 		res.send(func["funcion"]);
// 	});
// }

// module.exports = iniciarRutas;
