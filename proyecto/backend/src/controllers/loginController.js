// src/controllers/loginController.js

const pool = require('../db/db');

/**
 * Requiere opcionalmente bcrypt. Si no está instalado, el controlador
 * seguirá funcionando con comparación en texto plano.
 * Recomiendo instalar bcrypt para producción: `npm install bcrypt`
 */
let bcrypt;
try {
  bcrypt = require('bcrypt');
} catch (e) {
  bcrypt = null;
}

/**
 * login(req, res)
 * - espera en req.body: { rut, pass }
 * - busca el usuario en la tabla "user" (la columna de contraseña es `pass`)
 * - si coincide la contraseña (bcrypt o texto plano) pone en req.session.user
 *   un objeto con campos útiles y redirige al destino guardado en sesión
 *   o a la raíz '/'.
 */
async function login(req, res) {
  try {
    const { rut, pass } = req.body;

    if (!rut || !pass) {
      return res.status(400).send('Faltan credenciales');
    }

    // Buscar usuario por rut
    const query = `SELECT rut, pass, "primer-nombre", "apellido-paterno", tipo FROM "user" WHERE rut = $1 LIMIT 1`;
    const result = await pool.query(query, [rut]);

    if (!result.rows || result.rows.length === 0) {
      return res.status(401).send('Usuario o contraseña inválidos');
    }

    const userRow = result.rows[0];
    const storedPass = userRow.pass;

    let passwordMatches = false;

    // Intentamos comparar con bcrypt si está disponible
    if (bcrypt) {
      try {
        passwordMatches = await bcrypt.compare(pass, storedPass);
      } catch (err) {
        // Si bcrypt arroja error (p.ej. formato inesperado), lo ignoramos y probamos el fallback
        passwordMatches = false;
      }
    }

    // Fallback: comparación en texto plano
    if (!passwordMatches) {
      // Protección mínima: si storedPass es null/undefined, evitar crash
      if (typeof storedPass === 'string' && storedPass === pass) {
        passwordMatches = true;
      }
    }

    if (!passwordMatches) {
      return res.status(401).send('Usuario o contraseña inválidos');
    }

    // Autenticación OK -> guardar datos en sesión (elige lo que necesites)
    req.session.user = {
      rut: userRow.rut,
      primer_nombre: userRow['primer-nombre'],
      apellido_paterno: userRow['apellido-paterno'],
      tipo: userRow.tipo
    };

    // Si venía de una simulación pendiente, redirigir ahí
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
    return res.status(500).send('Error en el servidor');
  }
}

/**
 * logout(req, res)
 * - destruye la sesión y redirige a '/' (o a frontDir si prefieres)
 */
function logout(req, res) {
  // destroy acepta callback
  req.session.destroy(err => {
    if (err) {
      console.error('Error destruyendo sesión:', err);
      // aún así intentamos limpiar la cookie y redirigir
      res.clearCookie('connect.sid');
      return res.status(500).send('Error al cerrar sesión');
    }
    // limpiar cookie y redirigir
    res.clearCookie('connect.sid');
    return res.redirect('/');
  });
}

module.exports = {
  login,
  logout
};
