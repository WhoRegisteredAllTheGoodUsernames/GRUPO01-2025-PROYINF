pool = require("../db/db");
sql = require("../db/crearUsuarios");

async function registrarUsuario(data){
	data.tipo = data.tipo[0];
	await pool.query(sql["crearUser"], Object.values(data));

	if (data.tipo == "C"){
		await pool.query(sql["crearCliente"], [data.rut]);
	} else if (data.tipo == "B"){
		await pool.query(sql["crearBancario"], [data.rut, "Funcionario"]);
	}
}

module.exports = registrarUsuario;
