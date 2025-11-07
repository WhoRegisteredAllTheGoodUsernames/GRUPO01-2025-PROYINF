// src/controllers/ingresarSimulacion.js
const pool = require("../db/db");
const sql = require("../db/crearSimulacion");
//const obtenerDatosCliente = require("./obtenerDatosCliente");
const scoring = require("./aplicarScoring");

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
<<<<<<< HEAD
    //Notar que aquí se tendrá que usar la función!!!!!!
    const scoring_requerido = 60;
=======
	const functScoring = await scoring.obtenerUltimoScoring();
    const scoring_requerido = scoring.aplicarScoring(functScoring["funcion"], {
		"monto": monto,
		"numero-cuotas": numero_cuotas,
		"tasa-interes": tasa_interes,
		"seguro": seguro
	});
	//const datosScoringCliente = await obtenerDatosCliente(req, false);
	//datosScoringCliente["monto"] = monto;
	//datosScoringCliente["seguro"] = seguro;
	//const scoringCliente = scoring.aplicarScoringCliente(datosScoringCliente);
>>>>>>> scoring

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

    await pool.query(sql["crearSimulacion"], [
      fecha,
      monto,
      numero_cuotas,
      tasa_interes,
      scoring_requerido,
      rut_cliente,
      functScoring["id"],
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
