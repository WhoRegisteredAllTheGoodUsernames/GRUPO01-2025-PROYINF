import {back_dir} from '../backend';

const act = back_dir + "/registro";

export default function Registro(){

	return (
	<div id="registro">
		<form action={act} method="post">
		<label for="rut">Rut</label>
		<input required name="rut"/>
		<label for="pass">Contraseña</label>
		<input required name="pass" type="password"/>
		<label for="primer-nombre">Primer nombre</label>
		<input required name="primer-nombre"/>
		<label for="segundo-nombre">Segundo nombre</label>
		<input required name="segundo-nombre"/>
		<label for="apellido-materno">Apellido materno</label>
		<input required name="apellido-materno"/>
		<label for="apellido-paterno">Apellido paterno</label>
		<input required name="apellido-paterno"/>
		<label for="tipo">Tipo</label>
		<input name="tipo[]" type="radio" value="C"/>
		<input name="tipo[]" type="radio" value="B"/>
		<label for="fecha-nacimiento">Fecha de nacimeinto</label>
		<input required name="fecha-nacimiento" type="date"/>
		<input type="submit" value="Registrarse"/>
		</form>
	</div>
	);
}
