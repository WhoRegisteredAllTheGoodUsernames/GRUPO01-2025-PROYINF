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
		<form action={act} method="post">
		<p>Función de Scoring actual: {functScoring}</p>
		<label for="funcion">Función de scoring</label>
		<input required name="funcion" />
		<input type="submit" value="Guardar" />
		</form>
	</div>
	);
}
