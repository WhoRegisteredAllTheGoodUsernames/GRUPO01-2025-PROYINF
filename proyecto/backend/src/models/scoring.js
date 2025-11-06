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
const scoringCliente = {
	"salario": 0,
	"rubro": 0,
	"genero": 0,
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
		"Muerte": 0,
		"Nada": 0,
	},
	"rubro": {
		"Abogado": 0,
		"Doctor": 0,
		"Obrero": 0,
	},
	"genero": {
		"F": 0,
		"M": 0,
		"X": 0,
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
