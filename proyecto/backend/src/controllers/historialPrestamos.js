const pool = require("../db/db");

const getHistorialPrestamos = async (req, res) => {
  try {
    if (!req.session.user) {
      req.session.redirectAfterLogin = "/historialPrestamos";
      return res.status(401).send("Debes iniciar sesión para ver esta página");
    }

    const rutCliente = req.session.user.rut;

    const query = `
      SELECT id, fecha, monto, "numero-cuotas", "tasa-interes",
             "estado-aprobacion", "estado-pago", seguro
      FROM prestamo
      WHERE "rut-cliente" = $1
      ORDER BY fecha DESC;
    `;

    const result = await pool.query(query, [rutCliente]);

    return res.json({
      success: true,
      prestamos: result.rows
    });

  } catch (error) {
    console.error("❌ Error obteniendo historial de préstamos:", error);
    return res.status(500).send("Error al obtener historial");
  }
};

module.exports = { getHistorialPrestamos };
