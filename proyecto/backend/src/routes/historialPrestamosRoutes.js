const express = require("express");
const router = express.Router();
const { getHistorialPrestamos } = require("../controllers/historialPrestamos");

router.get("/", async (req, res) => {
  try {
    await getHistorialPrestamos(req, res);
  } catch (error) {
    console.error("Error al obtener historial de préstamos:", error);
    res.status(500).send("Error al obtener historial");
  }
});

module.exports = router;
