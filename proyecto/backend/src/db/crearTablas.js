const fs = require('fs');

const sql = fs.readFileSync("./src/models/crearTablas.sql").toString();

function crearTablas(pool){
	try {
		pool.query(sql);
	} catch (err) {
		console.error(err);
	}
}

module.exports = crearTablas;
