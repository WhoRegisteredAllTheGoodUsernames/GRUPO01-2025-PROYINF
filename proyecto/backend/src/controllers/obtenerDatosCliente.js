const pool = require("../db/db");
const sql = require("../db/usuarios");
const modeloScoring = require('../models/scoring');

// Lo dejé separado por si después se prefiere obtener los datos desde la bd
async function obtenerDatosCliente(rec, sesion){
	if (sesion){
		// Lo que se haría si los datos estuvieran en la sesión
	} else {
		if (!rec.session.user) throw "Se debe iniciar sesión para obtener los datos del usuario";

		const resp = await pool.query(sql["obtenerDatosCliente"], [rec.session.user.rut]);
		if (resp.rows.length == 0) throw `No existe el cliente con el rut ${rec.session.user.rut}`;

		// 🧩 Normalizar valores cualitativos usando el diccionario global
		const scoring = require("../controllers/aplicarScoring");
		const valoresCualitativos = modeloScoring.valoresCualitativos;

		// --- Normalizar rubro ---
		let rubroNormalizado = resp.rows[0]["rubro"];
		const dicRubro = valoresCualitativos["rubro"];

		if (dicRubro && dicRubro[rubroNormalizado] === undefined) {
			console.warn(`⚠️ Rubro no reconocido ("${rubroNormalizado}"), se usará "Nada".`);
			if (dicRubro["Nada"] !== undefined) rubroNormalizado = "Nada";
		}


		return {
			"salario": resp.rows[0]["salario"],
			"rubro": rubroNormalizado,
			"genero": resp.rows[0]["genero"],
			"email": resp.rows[0]["email"],
			"telefono": resp.rows[0]["telefono"],
			"scoring": resp.rows[0]["scoring"],
		};
	}
}

module.exports = obtenerDatosCliente;
