const express = require('express');
const router = express.Router();
const docusign = require('../controllers/docusignConttroller') // Rutas para docuSign (firma virtual)



router.post('/iniciar-firma', async (req,res) => {
    try {
		await docusign.iniciarFirma(req, res);
	} catch (error) {
		console.error('Error al registrar firma:', error);
		res.status(500).send('Error al registrar firma');
	}
});



// Ruta para recibir la señal de que los archivos fueron firmados correctamente o fueron rechazados
router.post('/webhook', async (req, res) => {
    try {
        await docusign.recibirWebhook(req, res);
    } catch (error) {
        console.error('Error al recibir la firma', error);
        res.status(500).send('Error al recibir la firma');
    }
});


module.exports = router;