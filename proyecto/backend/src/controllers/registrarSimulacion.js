// src/controllers/ingresarSimulacion.js

// src/controllers/registrarSimulacion.js
const pool = require("../db/db");
const sql = require("../db/crearSimulacion");
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

    const functScoring = { funcion: "20monto+seguro" };
    const scoring_requerido = scoring.aplicarScoring(functScoring["funcion"], {
      "monto": monto,
      "numero-cuotas": numero_cuotas,
      "tasa-interes": tasa_interes,
      "seguro": seguro
    });

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

    // 🔹 Solo guardar en sesión, no en la BD
    req.session.simulacionPendiente = resultado;
    req.session.redirectAfterLogin = '/resultadoSimulacion';
    console.log("🧠 Simulación almacenada en sesión (sin guardar en BD).");

    // Redirigir al resultado (será protegido por login)
    return res.redirect("/resultadoSimulacion");

  } catch (error) {
    console.error("❌ Error al registrar simulación:", error);
    return res.status(500).send("Error al registrar simulación");
  }
}

module.exports = registrarSimulacion;




// const pool = require("../db/db");
// const sql = require("../db/crearSimulacion");

// const scoring = require("./aplicarScoring");

// async function registrarSimulacion(req, res) {
//   try {
//     const data = req.body;

//     if (!data.monto || !data.cuotas || !data.tasa) {
//       return res.status(400).send("Faltan datos para la simulación");
//     }

//     const monto = parseFloat(data.monto);
//     const numero_cuotas = parseInt(data.cuotas);
//     const tasa_interes = parseFloat(data.tasa);
//     const seguro = data.seguro || "Sin seguro";
//     const fecha = new Date().toISOString().split("T")[0];

//     const valorCuota = (monto * (1 + tasa_interes * numero_cuotas / 12)) / numero_cuotas;
//     const impuestos = monto * 0.02;
//     const gastosNotariales = 50000;
// 	const totalCredito = monto + impuestos + gastosNotariales;

// 	const functScoring = {"funcion": "20monto+seguro"};
//     const scoring_requerido = scoring.aplicarScoring(functScoring["funcion"], {
// 		"monto": monto,
// 		"numero-cuotas": numero_cuotas,
// 		"tasa-interes": tasa_interes,
// 		"seguro": seguro
// 	});


//     const resultado = {
//       fecha,
//       monto,
//       numero_cuotas,
//       tasa_interes,
//       scoring_requerido,
//       seguro,
//       valorCuota,
//       impuestos,
//       gastosNotariales,
//       totalCredito
//     };

//     if (!req.session.user) {
//       req.session.simulacionPendiente = resultado;
//       req.session.redirectAfterLogin = '/resultadoSimulacion';
//       console.log("🕓 Usuario no loggeado, simulación guardada en sesión.");
//       return res.redirect('/login');
//     }

//     const rut_cliente = req.session.user.rut;

//     // Inserta en la base de datos y captura el ID generado
//     const insert = await pool.query(
//       sql["crearSimulacion"],
//       [
//         fecha,
//         monto,
//         numero_cuotas,
//         tasa_interes,
//         scoring_requerido,
//         rut_cliente,
//         functScoring["id"],
//         seguro,
//       ]
//     );

//     // 👇 Nuevo: guardar ID de la simulación insertada
//     const idSimulacion = insert.rows[0]?.id;
//     console.log(`💾 Simulación creada con ID ${idSimulacion}`);

//     // Guardar en sesión
//     req.session.simulacion = { ...resultado, id: idSimulacion };
//     console.log("🧠 Guardando en sesión:", { ...resultado, id: idSimulacion });
//     return res.redirect("/resultadoSimulacion");


//   } catch (error) {
//     console.error("❌ Error al registrar simulación:", error);
//     return res.status(500).send("Error al registrar simulación");
//   }
// }

// module.exports = registrarSimulacion;
