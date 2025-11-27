const pool = require("../db/db");

const getHistorialSimulaciones = async (req, res) => {
  try {
    // Protección igual que resultadoSimulacion.js
    if (!req.session.user) {
      // Guardar destino para después del login
      req.session.redirectAfterLogin = "/historialSimulaciones";
      return res.status(401).send("Debes iniciar sesión para ver esta página");
    }

    const rutCliente = req.session.user.rut;

    console.log(`📚 Obteniendo historial para RUT: ${rutCliente}`);

    const query = `
      SELECT id, fecha, monto, "numero-cuotas", "tasa-interes", "scoring-requerido", seguro
      FROM "simulacion-prestamo"
      WHERE "rut-cliente" = $1
      ORDER BY fecha DESC;
    `;

    const result = await pool.query(query, [rutCliente]);

    console.log(`📤 Enviando ${result.rows.length} simulaciones al frontend`);

    return res.json({
      success: true,
      historial: result.rows,
    });

  } catch (error) {
    console.error("❌ Error al obtener historial:", error);
    return res.status(500).send("Error al obtener historial");
  }
};

module.exports = { getHistorialSimulaciones };
