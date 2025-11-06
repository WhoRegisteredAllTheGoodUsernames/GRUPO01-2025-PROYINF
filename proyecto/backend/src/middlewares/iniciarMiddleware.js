const session = require('express-session');
const cors = require('cors');

function iniciarMiddleware(express, app){
	app.use(express.json()) // for parsing application/json
	app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
	app.use(session({
  		secret: 'clave',
		resave: false,
 		saveUninitialized: true
	}));
	app.use(cors({
		"origin": "http://localhost:3001",
		"methods": ["GET", "POST"],
		"credentials": true
	}));
}

module.exports = iniciarMiddleware;
