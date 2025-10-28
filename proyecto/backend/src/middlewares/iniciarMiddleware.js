function iniciarMiddleware(express, app){
	app.use(express.json()) // for parsing application/json
	app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
}

module.exports = iniciarMiddleware;
