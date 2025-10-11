import {back_dir} from '../backend';

const act = back_dir + "/simulacion";

export default function Simulacion(){

	return (
	<div id="simulacion">
		<form action={act} method="post">
		<label for="monto">Monto</label>
		<input required name="monto" type="number"/>
		<label for="cuotas">Cantidad de cuotas</label>
		<select name="cuotas">
			<option value="6">6</option>
			<option value="8">8</option>
		</select>
		<label for="primer-pago">Mes primer pago</label>
		<select name="primer-pago">
			<option value="1">Enero</option>
			<option value="2">Febrero</option>
		</select>
		<label for="dia-pago">Día de pago</label>
		<select name="dia-pago">
			<option value="1">1</option>
			<option value="2">2</option>
		</select>
		<label for="seguro">Tipo de seguro</label>
		<input name="seguro[]" type="radio" value="Muerte"/>
		<input name="seguro[]" type="radio" value="Nada"/>
		<input type="submit" value="Simular"/>
		</form>
	</div>
	);
}
