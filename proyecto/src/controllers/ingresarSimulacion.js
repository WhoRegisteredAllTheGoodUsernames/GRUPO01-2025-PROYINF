const pool = require("../db/db");
const sql = require("../db/crearSimulacion");

async function registrarSimulacion(data) {
  try {
    // Datos que vienen del formulario HTML
    const monto = data.monto;
    const numero_cuotas = data.cuotas;
    const tasa_interes = data.tasa;
    const seguro = data.seguro || "Sin seguro";

    // Datos que aún no están implementados o se generan automáticos
    const fecha = new Date().toISOString().split("T")[0]; // fecha actual (YYYY-MM-DD)
    const scoring_requerido = 600; // valor falso temporal
    const rut_cliente = null;
    const id_funcion_crediticia = null;

    // Ejecutar query
    await pool.query(sql["crearSimulacion"], [
      fecha,
      monto,
      numero_cuotas,
      tasa_interes,
      scoring_requerido,
      rut_cliente,
      id_funcion_crediticia,
      seguro,
    ]);

    console.log("✅ Simulación guardada correctamente");
  } catch (error) {
    console.error("❌ Error al registrar simulación:", error);
    throw error;
  }
}

module.exports = registrarSimulacion;



//NOTA: ESTO DEJA EN NULL LOS ID FORÁNEAS SÓLO CON EL PROPÓSITO DE LA DEMOSTRACIÓN
//SERÁ MODIFICADO POSTERIORMENTE - gracias. 