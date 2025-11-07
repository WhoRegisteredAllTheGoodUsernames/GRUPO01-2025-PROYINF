const express = require('express');
const router = express.Router();

const registrarSimulacion = require('../controllers/registrarSimulacion');
const resultadoSimulacion = require('../controllers/resultadoSimulacion');
const solicitudController = require('../controllers/solicitudController');

// --------------------------
// ETAPA 1: Simulación
// --------------------------
router.post('/simulacion', async (req, res) => {
	try {
		await registrarSimulacion(req, res);
	} catch (error) {
		console.error('Error al registrar simulación:', error);
		res.status(500).send('Error al registrar simulación');
	}
});

router.get('/resultadoSimulacion', resultadoSimulacion);

// --------------------------
// ETAPA 2: Ver simulación y comenzar solicitud
// --------------------------
router.get('/solicitud/:idSimulacion', async (req, res) => {
	try {
		await solicitudController.verSimulacion(req, res);
	} catch (error) {
		console.error('Error al obtener simulación:', error);
		res.status(500).send('Error al obtener simulación');
	}
});

// --------------------------
// ETAPA 3: Datos cliente + cálculo de scoring
// --------------------------
router.get('/solicitud/:idSimulacion/datos', async (req, res) => {
	try {
		await solicitudController.verDatosCliente(req, res);
	} catch (error) {
		console.error('Error al obtener datos del cliente:', error);
		res.status(500).send('Error al obtener datos del cliente');
	}
});

router.post('/solicitud/:idSimulacion/datos', async (req, res) => {
	try {
		await solicitudController.actualizarDatosYScoring(req, res);
	} catch (error) {
		console.error('Error al actualizar datos y scoring:', error);
		res.status(500).send('Error al actualizar datos y scoring');
	}
});

module.exports = router;
