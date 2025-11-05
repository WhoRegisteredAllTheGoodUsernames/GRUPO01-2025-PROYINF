// src/controllers/ingresarSimulacion.js
const pool = require("../db/db");
const sql = require("../db/crearSimulacion");

async function registrarSimulacion(req, res) {
  try {
    const data = req.body;

    if (!data.monto || !data.cuotas || !data.tasa) {
      return res.status(400).send("Faltan datos para la simulación");
    }

    const monto = parseFloat(data.monto);
    const numero_cuotas = parseInt(data.cuotas);
    const tasa_interes = parseFloat(data.tasa);
    const seguro = data.seguro || "Sin seguro";
    const fecha = new Date().toISOString().split("T")[0];

    const valorCuota = (monto * (1 + tasa_interes * numero_cuotas / 12)) / numero_cuotas;
    const impuestos = monto * 0.02;
    const gastosNotariales = 50000;
    const totalCredito = monto + impuestos + gastosNotariales;
    const scoring_requerido = 600;

    const resultado = {
      fecha,
      monto,
      numero_cuotas,
      tasa_interes,
      scoring_requerido,
      seguro,
      valorCuota,
      impuestos,
      gastosNotariales,
      totalCredito
    };

    if (!req.session.user) {
      req.session.simulacionPendiente = resultado;
      req.session.redirectAfterLogin = '/resultadoSimulacion';
      console.log("🕓 Usuario no loggeado, simulación guardada en sesión.");
      return res.redirect('/login');
    }

    const rut_cliente = req.session.user.rut;
    const id_funcion_crediticia = null;

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

    console.log("✅ Simulación guardada correctamente en BD");

    req.session.simulacion = resultado;
    return res.redirect('/resultadoSimulacion');

  } catch (error) {
    console.error("❌ Error al registrar simulación:", error);
    return res.status(500).send("Error al registrar simulación");
  }
}

module.exports = registrarSimulacion;
