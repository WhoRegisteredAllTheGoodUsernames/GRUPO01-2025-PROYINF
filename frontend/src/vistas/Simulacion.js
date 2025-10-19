import {back_dir} from '../backend';
import {useState} from "react";
import logo from '../img/logo.png';

const act = back_dir + "/simulacion";

export default function Simulacion(){
	const [tasa, setTasa] = useState(1.32); // con esto es lo que parte una vez ingresa a la pag, tipo, 1.32% de interes
	const handleTasaChange = (e) => {
		setTasa(e.target.value);
	};
	return (
	<div
		id="simulacion"
		style={{
			fontFamily: "Arial, Helvetica, sans-serif",
			backgroundColor: "#ffffff",
			minHeight: "100vh",
			display: "flex",
			flexDirection: "column",
		}}
	>
		
		{/* barra de arriba */}
		<header
			style={{
				backgroundColor: "#1a1f3c",
				color: "white",
				padding: "clamp(15px, 4vw, 25px) clamp(15px, 4vw, 30px)",
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center",
				flexWrap: "wrap",
				gap: "15px",
				'@media (max-width: 768px)': { 
					flexDirection: "column",
					textAlign: "center",
				},
			}}
			>

			{/* logo */}
			<div style={{ fontSize: "25px", fontWeight: "bold" }}> 
				<img 
				src={logo} 
				alt="Logo"
				style={{
					width: "auto",   
					height: "clamp(30px, 5vw, 45px)",
					maxWidth: "120px"   
				}}
				/>
			</div>
			
			{/* links */}
			<div style={{display: "flex", gap: "clamp(15px, 3vw, 20px)", alignItems: "center", flexWrap: "wrap"}}>			
				<a
					href="/login"
					style={{
						color: "white",
						textDecoration: "none",
						fontWeight: "bold",
						fontSize: "clamp(14px, 2vw, 17px)",
						whiteSpace: "nowrap",
					}}
				>
				Iniciar sesión
				</a>
			</div>
		</header>
	
		{/* titulo */}
		<div style={{
			flex: 1,
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			justifyContent: "center",
			padding: "40px 20px",
		}}>
		<div
			style={{
				backgroundColor: "#CCCDD2",
				padding: "clamp(20px, 4vw, 30px)",
				borderRadius: "18px",
				boxShadow: "0px 2px 6px rgba(0,0,0,0.1)",
				marginBottom: "clamp(20px, 5vw, 40px)",
				textAlign: "top",
				width: "80%",
				width: "min(90%, 1000px)",
				marginTop: "clamp(-30px, -15vw, -160px)",
		}}
		>
			<h1
				style={{
					fontSize: "clamp(40px, 8vw, 80px)",
					margin: "0",
					color: "#1C142E",
					fontWeight: "bold",
					lineHeight: "1.1",
				}}
				>
				Simula <span style={{ fontSize:"clamp(20px, 4vw, 35px)"}}>tu</span>
			</h1>
			<h2
				style={{
					fontSize: "clamp(24px, 5vw, 50px)",
					margin: "clamp(5px, 1vw, 10px) 0 0",
					color: "#1C142E",
					fontWeight: "normal",
					lineHeight: "1.2",
				}}
			> 
				<strong>Crédito Aquí</strong>
			</h2>
		</div>
			

    <div id="simulacion" style={{ maxWidth: '600px', margin: '0 auto 0 25%', padding: '10px 30px', fontFamily: 'Arial, sans-serif'}}>
		{/* formulario */}
      	<form action={act} method="post">
			<div style={{
				backgroundColor: '#CCCDD2',
				borderRadius: '8px',
				marginBottom: '20px',
				width: '100%',
				maxWidth: '400px',
				padding: "clamp(20px, 5vw, 40px) clamp(150px, 3vw, 100px)",
				
			}}>
				{/* monto */}
				<h2 style={{
					fontSize: '18px',
					fontWeight: 'bold',
					color: '#1C142E',
					marginBottom: '15px'
				}}>
				Monto
				</h2>
				<input
					required
					name="monto"
					type="number"
					placeholder="Ingresar monto"
					style={{
						display: 'block',
						width: '100%',
						maxWidth: "375px",
						padding: '12px',
						border: '1px solid #ddd',
						borderRadius: '4px',
						marginBottom: '15px', 
						fontSize: '16px'
					}}
				/>

				{/* cant de cuotas */}
				<h2 style={{
						fontSize: '18px',
						fontWeight: 'bold',
						color: '#1C142E',
						marginBottom: '15px'
					}}>
					Número de cuotas
				</h2>
				<input
					required
					name="cuotas"
					type="number"
					placeholder="Número de cuotas"
					style={{
						display: 'block',
						width: '100%',
						maxWidth: "375px",
						padding: '12px',
						border: '1px solid #ddd',
						borderRadius: '4px',
						fontSize: '16px'
				}}
				/>

				{/* mes primer pago */}
				<h2 style={{
						fontSize: '18px',
						fontWeight: 'bold',
						color: '#1C142E',
						marginBottom: '15px'
					}}>
					Mes primer pago
				</h2>
				<select
				name="mes-pago"
				style={{
					display: 'block',
					width: '100%',
					maxWidth: '600px',
					padding: "clamp(12px, 5vw, 12px) clamp(15px, 3vw, 20px)",
					border: '1px solid #ddd',
					borderRadius: '4px',
					marginBottom: '15px',
					fontSize: '16px',
					backgroundColor: 'white'
				}}
				>
					<option value="1">Enero</option>
					<option value="2">Febrero</option>
					<option value="3">Marzo</option>
					<option value="4">Abril</option>
					<option value="5">Mayo</option>
					<option value="6">Junio</option>
					<option value="7">Julio</option>
					<option value="8">Agosto</option>
					<option value="9">Septiembre</option>
					<option value="10">Octubre</option>
					<option value="11">Noviembre</option>
					<option value="12">Diciembre</option> 
				</select>

				{/* primer dia de pago */}
				<h2 style={{
						fontSize: '18px',
						fontWeight: 'bold',
						color: '#1C142E',
						marginBottom: '15px'
					}}>
					Primer día de pago
				</h2>
				<select
				name="dia-pago"
				style={{
					display: 'block',
					width: '100%',
					padding: "clamp(12px, 5vw, 12px) clamp(15px, 3vw, 20px)",
					border: '1px solid #ddd',
					borderRadius: '4px',
					marginBottom: '15px',
					fontSize: '16px',
					backgroundColor: 'white'
				}}
				>
				<option value="1">1</option>
				<option value="2">2</option>
				<option value="3">3</option>
				<option value="4">4</option>
				<option value="5">5</option>
				<option value="6">6</option>
				<option value="7">7</option>
				<option value="8">8</option>
				<option value="9">9</option>
				<option value="10">10</option>
				<option value="11">11</option>
				<option value="12">12</option>
				<option value="13">13</option>
				<option value="14">14</option>
				<option value="15">15</option>
				<option value="16">16</option>
				<option value="17">17</option>
				<option value="18">18</option>
				<option value="19">19</option>
				<option value="20">20</option>
				<option value="21">21</option>
				<option value="22">22</option>
				<option value="23">23</option>
				<option value="24">24</option>
				<option value="25">25</option>
				<option value="26">26</option>
				<option value="27">27</option>
				<option value="28">28</option>
				</select>

				{/* tipo de seguro */}
				<h2 style={{
					fontSize: '18px',
					fontWeight: 'bold',
					color: '#1C142E',
					marginBottom: '15px'
				}}>
					Tipo de seguro
				</h2>
				<div style={{ marginBottom: '10px' }}>
					<input 
						type="radio" 
						name="seguro" 
						value="Muerte" 
						style={{ marginRight: '10px' }}
					/> 
					<span style={{ fontSize: '16px' }}>Desgravamen</span>
				</div>
				<div>
					<input 
						type="radio" 
						name="seguro" 
						value="Nada" 
						style={{ marginRight: '10px' }}
					/> 
					<span style={{ fontSize: '16px' }}>Nada</span>
				</div>
			
				{/* tasa de interes */}
				<div style={{
					backgroundColor: '#CCCDD2',
					padding: '20px',
					borderRadius: '8px',
					marginBottom: '30px'
				}}>
					<h2 style={{
					fontSize: '18px',
					fontWeight: 'bold',
					color: '#1C142E',
					marginBottom: '15px'
					}}>
					Tasa de interés
					</h2>
					
					<div style={{
					display: 'flex',
					alignItems: 'center',
					gap: '15px',
					marginBottom: '15px'
					}}>
						<input
							type="range"
							name="tasa"
							min="1"
							max="20"
							step="0.01"
							value={tasa}
							onChange={(e) => setTasa(e.target.value)}
							style={{
							flex: '1',
							height: '6px',
							borderRadius: '3px',
							background: '#d8d9dfff'
							}}
						/>
						<span style={{
							fontSize: '16px',
							fontWeight: 'bold',
							color: '#1C142E',
							minWidth: '50px'
						}}>
							{tasa}%
						</span>
					</div>
				</div>
				
				<input
				type="submit"
				value="Simular"
				style={{
					display: 'block',
					width: '100%',
					padding: '10px',
					backgroundColor: '#312F55',
					color: '#fff',
					border: 'none',
					borderRadius: '4px',
					cursor: 'pointer'
				}}
				/>
			</div>
    	</form>
    </div>
	</div>

	{/* barra de abajo */}
	<footer
		style={{
		backgroundColor: "#272D48",
		color: "white",
		textAlign: "center",
		padding: "clamp(15px, 3vw, 25px) 0",
		fontSize: "clamp(12px, 2vw, 14px)",
		}}
	>
		© 2025 Préstamos de Consumo Digital
	</footer>
	</div>
  );
}
