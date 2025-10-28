import {back_dir} from '../backend';

const act = back_dir + "/login";

export default function Login(){

	return (
	<div id="login">
		<form action={act} method="post">
		<label for="rut">Rut</label>
		<input required name="rut"/>
		<label for="pass">Contraseña</label>
		<input required name="pass"/>
		<input type="submit" value="Iniciar sesión"/>
		</form>
	</div>
	);
}
