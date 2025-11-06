const session = require('express-session');

function iniciarMiddleware(express, app){
	app.use(express.json()) // for parsing application/json
	app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
	app.use(session({
  		secret: 'clave',
		resave: false,
 		saveUninitialized: true
	}));
}

module.exports = iniciarMiddleware;
