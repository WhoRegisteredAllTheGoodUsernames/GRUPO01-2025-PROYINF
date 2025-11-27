const express = require('express');
const router = express.Router();
const { getHistorialSimulaciones } = require('../controllers/historialSimulaciones');

router.get('/', async (req, res) => {
    try {
        await getHistorialSimulaciones(req, res);
    } catch (error) {
        console.error('Error al obtener historial de simulaciones:', error);
        res.status(500).send('Error al obtener historial');
    }
});

module.exports = router;
