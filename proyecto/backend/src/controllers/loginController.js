// src/controllers/loginController.js

const pool = require('../db/db');

let bcrypt;
try {
  bcrypt = require('bcrypt');
} catch (e) {
  bcrypt = null;
}

async function login(req, res) {
  try {
    const { rut, pass } = req.body;

    if (!rut || !pass) {
      return res.status(400).json({ error: 'Faltan credenciales' });
    }

    const query = `
      SELECT rut, pass, "primer-nombre", "apellido-paterno", tipo
      FROM "user"
      WHERE rut = $1
      LIMIT 1
    `;
    const result = await pool.query(query, [rut]);

    if (!result.rows || result.rows.length === 0) {
      return res.status(401).json({ error: 'Usuario o contraseña inválidos' });
    }

    const userRow = result.rows[0];
    const storedPass = userRow.pass;

    let passwordMatches = false;

    if (bcrypt) {
      try {
        passwordMatches = await bcrypt.compare(pass, storedPass);
      } catch (err) {
        passwordMatches = false;
      }
    }

    if (!passwordMatches) {
      if (typeof storedPass === 'string' && storedPass === pass) {
        passwordMatches = true;
      }
    }

    if (!passwordMatches) {
      return res.status(401).json({ error: 'Usuario o contraseña inválidos' });
    }

    req.session.user = {
      rut: userRow.rut,
      primer_nombre: userRow['primer-nombre'],
      apellido_paterno: userRow['apellido-paterno'],
      tipo: userRow.tipo
    };
    console.log("Sesion iniciada con exito");

    const destino = req.session.redirectAfterLogin || '/';
    if (req.session.redirectAfterLogin) delete req.session.redirectAfterLogin;

    return res.json({
      ok: true,
      redirect: destino,
      user: {
        rut: userRow.rut,
        primer_nombre: userRow['primer-nombre'],
        apellido_paterno: userRow['apellido-paterno'],
        tipo: userRow.tipo
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({ error: 'Error en el servidor' });
  }
}

function logout(req, res) {
  req.session.destroy(err => {
    if (err) {
      console.error('Error destruyendo sesión:', err);
      res.clearCookie('connect.sid');
      return res.status(500).json({ error: 'Error al cerrar sesión' });
    }

    res.clearCookie('connect.sid');
    console.log("Sesion Cerrada con exito");
    return res.json({ ok: true, message: 'Sesion cerrada' });
  });
}

module.exports = { login, logout };
