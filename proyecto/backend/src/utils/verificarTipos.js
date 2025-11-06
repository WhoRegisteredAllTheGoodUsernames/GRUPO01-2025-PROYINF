function esString(x){
	if (typeof x === "string" || x instanceof String) return true;
	return false;
}

// Lo dejo como lista por si se quieren agregar más métodos
module.exports = {
	"esString": esString,
}
