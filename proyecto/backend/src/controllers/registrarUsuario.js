// src/controllers/registrarUsuario.js
const pool = require("../db/db");
const sql = require("../db/usuarios");
const bcrypt = require("bcrypt");

async function registrarUsuario(data) {
  try {
    // Normalizar tipo
    data.tipo = data.tipo[0];

    // Hashear contraseña antes de guardar
    const saltRounds = 10;
    const hashedPass = await bcrypt.hash(data.pass, saltRounds);
    data.pass = hashedPass;

    // Insertar usuario principal
    await pool.query(sql["crearUser"], Object.values(data));

    // Crear registros asociados según tipo
    if (data.tipo === "C") {
      await pool.query(sql["crearCliente"], [data.rut]);
    } else if (data.tipo === "B") {
      await pool.query(sql["crearBancario"], [data.rut, "Funcionario"]);
    }

    console.log("✅ Usuario registrado con contraseña encriptada");
  } catch (error) {
  console.error("❌ Error al registrar usuario:", error);

  // Detectar duplicado de rut (PostgreSQL code 23505)
  if (error.code === "23505") {
    throw new Error("El RUT ya está registrado");
  }

  // Lanzar otros errores genéricos
  throw new Error("Error inesperado al registrar usuario");
}
}

module.exports = registrarUsuario;



//Versión antigua, pero funcional: (sin bcrypt)
// pool = require("../db/db");
// sql = require("../db/crearUsuarios");

// async function registrarUsuario(data){
// 	data.tipo = data.tipo[0];
// 	await pool.query(sql["crearUser"], Object.values(data));

// 	if (data.tipo == "C"){
// 		await pool.query(sql["crearCliente"], [data.rut]);
// 	} else if (data.tipo == "B"){
// 		await pool.query(sql["crearBancario"], [data.rut, "Funcionario"]);
// 	}
// }

// module.exports = registrarUsuario;
