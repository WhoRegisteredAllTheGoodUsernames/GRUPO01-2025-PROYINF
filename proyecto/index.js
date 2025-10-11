const express = require('express');
const pool = require('./db'); // Importar la conexión
const front_dir = require('./frontend');
const app = express();
const port = 3000;

// Ruta de prueba que guarda un mensaje en la base de datos
//app.get('/save', async (req, res) => {
//  try {
//    await pool.query('CREATE TABLE IF NOT EXISTS messages (id SERIAL PRIMARY KEY, content TEXT)');
//    await pool.query('INSERT INTO messages (content) VALUES ($1)', ['Hola desde PostgreSQL!']);
//    res.send('Mensaje guardado en la base de datos');
//  } catch (err) {
//    console.error(err);
//    res.status(500).send('Error');
//  }
//});
//
//// Ruta para obtener todos los mensajes
//app.get('/messages', async (req, res) => {
//  try {
//    const result = await pool.query('SELECT * FROM messages');
//    res.json(result.rows);
//  } catch (err) {
//    console.error(err);
//    res.status(500).send('Error');
//  }
//});

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.post('/registro', (req, res) => {
	console.log(req.body);
	res.redirect(front_dir);
});

app.post('/login', (req, res) => {
	console.log(req.body);
	res.redirect(front_dir);
});

app.post('/simulacion', (req, res) => {
	console.log(req.body);
	res.redirect(front_dir);
});

app.post('/mod_scoring', (req, res) => {
	console.log(req.body);
	res.redirect(front_dir);
});

app.post('/logout', (req, res) => {
	console.log(req.body);
	res.redirect(front_dir);
});

app.listen(port, () => {
  console.log(`App corriendo en http://localhost:${port}`);
});
