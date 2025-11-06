import {back_dir} from '../backend';
import { useState } from 'react';

const act = back_dir + "/mod_scoring";

export default function ModScoring(){
	const [functScoring, setFunctScoring] = useState();

	try {
		fetch(act)
			.then(response => response.text())
			.then(data => setFunctScoring(data));
	} catch (error) {
		console.log(error);
	}

	return (
	<div id="mod_scoring">
		<p>Función de Scoring actual: {functScoring}</p>
		<form action={act} method="post">
		<label for="funcion">Función de scoring</label>
		<input required name="funcion" />
		<input type="submit" value="Guardar" />
		</form>
		<p>Parámetros soportados:</p>
		<ul>
			<li>monto (cuantitativa): Monto bruto del préstamo</li>
			<li>numero_cuotas (cuantitativa): Número de cuotas en que se paga el préstamo</li>
			<li>tasa_interes (cuantitativa): Tasa de interes del préstamo</li>
			<li>seguro (cualitativa): Tipo de seguro: Muerte o ninguno</li>
		</ul>
		<p>Ejemplo: -5monto+0.1cuotas-tasa_interes+4.5seguro+5</p>
	</div>
	);
}
