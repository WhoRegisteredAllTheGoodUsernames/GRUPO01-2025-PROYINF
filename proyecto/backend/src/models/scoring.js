// Variables:
// - Monto
// - Plazo
// - Tasa de interés
// - Cuota
//
// - Edad
// - Rubro
// - Salario
// - Genero
//
// - Nivel educativo
// - Antiguedad laboral
// - Estado civil
// - Dependientes
// - Tipo de vivienda
// - Tipo de contrato
//
// Fuente: Diseño de un modelo de scoring para el otorgamiento de crédito
// 	de consumo en una compañía de financiamiento colombiana
// Autores: L Arango Duque, D Restrepo Baena
// Url: https://repository.eafit.edu.co/server/api/core/bitstreams/cbbb78b3-7658-4583-b339-cacb72ff1ca4/content
// Nota: Sólo se consideran las variables que afectan a la función del modelo
// 	de scoring y que son recolectadas por el formulario de info del cliente.

// Estructura:
// 	{
// 		"variable1": parametro1,
// 		"variable2": parametro2,
// 		...
// 	}
// 	NOTA: Lo dejaré solo dependiente de los datos del cliente. Esto no afecta
// 		cuando se llama la función que la aplica con más parámetros.
const scoringCliente = {
	"salario": 1,
	"rubro": 1,
	"genero": 1,
	//"monto": 1,
	//"seguro": 1,
};

// Estructura:
// 	{
// 		"variable1": {
// 			"valorCualitativo1": valorCuantitativo1,
// 			"valorCualitativo2": valorCuantitativo2,
// 			...
// 		},
// 		"variable2": {...}
// 		...
// 	}
const valoresCualitativos = {
	"seguro": {
		"Desgravamen": 1,
		"Nada": 2,
	},
	"rubro": {
		"Abogado": 1,
		"Doctor": 2,
		"Obrero": 3,
		"Nada": 5,
	},
	"genero": {
		"F": 1,
		"M": 2,
		"X": 3,
	}
}

// Se utilizan sólo las llaves, para ver si se soporta la variable
// Se podría agregar una estructura con las descripciones y tipos,
// 	para pasarlas al frontend y mostrar la lista de variables soportadas
// 	dinámicamente. Haría más limpia la expansión
const variablesPrestamo = {
	"monto": 0,
	"numero-cuotas": 0,
	"tasa-interes": 0,
	"seguro": 0,
};

module.exports = {
	"scoringCliente": scoringCliente,
	"valoresCualitativos": valoresCualitativos,
	"variablesPrestamo": variablesPrestamo,
};
