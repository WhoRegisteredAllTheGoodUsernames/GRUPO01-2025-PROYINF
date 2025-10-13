const frontDir = require('./frontend');
const registrarUsuario = require('../controllers/registrarUsuario');

function iniciarRutas(app){
	app.post('/registro', (req, res) => {
		registrarUsuario(req.body);
		res.redirect(frontDir);
	});

	app.post('/login', (req, res) => {
		console.log(req.body);
		res.redirect(frontDir);
	});

	app.post('/simulacion', (req, res) => {
		console.log(req.body);
		res.redirect(frontDir);
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
