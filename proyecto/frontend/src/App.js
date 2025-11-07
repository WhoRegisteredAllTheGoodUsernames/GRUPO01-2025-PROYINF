import Registro from './vistas/Registro';
import Index from './vistas/Index';
import Login from './vistas/Login';	
import Simulacion from './vistas/Simulacion';
import ModScoring from './vistas/ModScoring';
import ResultadoSimulacion from './vistas/resultadoSimulacion';
import Solicitud from './vistas/solicitud';
//import logo from './logo.svg';
import './App.css';
import {
	BrowserRouter as Router,
	Routes,
	Route} from "react-router-dom";

function App() {
  return (
	  <	Router>
			<Routes>
				<Route exact path="/" element={<Index />} />
				<Route path="/registro" element={<Registro />} />
				<Route path="/login" element={<Login />} />
				<Route path="/simulacion" element={<Simulacion />} />
				<Route path="/mod_scoring" element={<ModScoring />} />
				<Route path="/resultadoSimulacion" element={<ResultadoSimulacion />} />
				<Route path="/solicitud" element={<Solicitud />} />
			</Routes>
	  </Router>
  );
}

export default App;
