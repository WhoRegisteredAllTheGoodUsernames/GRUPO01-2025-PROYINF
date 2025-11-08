const frontDir = require('./frontend');
const registrarUsuario = require('../controllers/registrarUsuario');
const { obtenerUltimoScoring, registrarScoring } = require('../controllers/aplicarScoring'); 
const { login, logout } = require('../controllers/loginController');
const sessionInfo = require('../controllers/sessionController'); // ← nuevo import

function iniciarRutas(app) {
	// app.post('/registro', async (req, res) => {
	// 	try {
	// 		await registrarUsuario(req.body);
	// 		res.redirect(frontDir);
	// 	} catch (error) {
	// 		console.error("Error en /registro:", error.message);
	// 		res.status(400).send(error.message);
	// 	}
	// });
	app.post('/registro', async (req, res) => {
		try {
			await registrarUsuario(req.body);
			res.status(200).json({
			ok: true,
			mensaje: "Usuario registrado con éxito",
			});
		} catch (error) {
			console.error("Error en /registro:", error.message);
			res.status(400).json({
			ok: false,
			error: error.message || "Error inesperado al registrar usuario",
			});
		}
		});


	// Login real con sesiones
	app.post('/login', login);

	// Logout real con eliminación de sesión
	app.post('/logout', logout);

	// Nuevo endpoint para consultar sesión actual
	app.get('/session', sessionInfo);

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
