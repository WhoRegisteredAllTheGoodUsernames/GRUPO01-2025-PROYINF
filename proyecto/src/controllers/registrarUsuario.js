pool = require("../db/db");
sql = require("../db/crearUsuarios");

function registrarUsuario(data){
	data.tipo = data.tipo[0];
	pool.query(sql["crearUser"], Object.values(data));

	if (data.tipo == "C"){
		pool.query(sql["crearCliente"], [data.rut]);
	} else if (data.tipo == "B"){
		pool.query(sql["crearBancario"], [data.rut, "Funcionario"]);
	}
}

module.exports = registrarUsuario;
