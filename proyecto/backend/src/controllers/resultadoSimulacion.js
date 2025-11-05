// src/controllers/resultadoSimulacion.js
async function resultadoSimulacion(req, res) {
  try {
    // Verificar si el usuario está loggeado
    if (!req.session.user) {
      return res.status(401).send("Debes iniciar sesión para ver esta página");
    }

    // Verificar si hay resultados en sesión
    const resultado = req.session.simulacion || req.session.simulacionPendiente;

    if (!resultado) {
      console.log("⚠️ No hay simulación disponible en la sesión");
      return res.status(404).send("No hay resultados de simulación disponibles");
    }

    // Enviar datos al frontend
    console.log("📤 Enviando resultados de simulación al frontend");
    return res.json({
      success: true,
      resultado,
    });

  } catch (error) {
    console.error("❌ Error al obtener resultado de simulación:", error);
    return res.status(500).send("Error al obtener resultado de simulación");
  }
}

module.exports = resultadoSimulacion;
