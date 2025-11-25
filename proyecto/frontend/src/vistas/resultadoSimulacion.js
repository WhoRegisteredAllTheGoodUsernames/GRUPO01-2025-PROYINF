import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { back_dir } from "../backend";
import logo from "../img/logo.png";
import Navbar from "./navbar";

export default function ResultadoSimulacion() {
  const [resultado, setResultado] = useState(null);
  const [idSimulacion, setIdSimulacion] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerResultado = async () => {
      try {
        const res = await fetch(`${back_dir}/resultadoSimulacion`, {
          method: "GET",
          credentials: "include",
        });

        if (res.status === 401) {
          navigate("/login");
          return;
        }

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Error al obtener resultados");
        }

        const data = await res.json();
        if (data.success && data.resultado) {
          setResultado(data.resultado);
          setIdSimulacion(data.resultado.id); // guarda el id de la simulación
        } else {
          setError("No hay resultados de simulación disponibles");
        }
      } catch (err) {
        console.error("❌ Error al obtener resultado:", err);
        setError("Error al cargar los resultados");
      }
    };

    obtenerResultado();
  }, [navigate]);

  if (error) {
    return (
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        height: "100vh", fontFamily: "Arial, sans-serif", color: "#a00",
      }}>
        <h2>{error}</h2>
      </div>
    );
  }

  if (!resultado) {
    return (
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        height: "100vh", fontFamily: "Arial, sans-serif",
      }}>
        <h2>Cargando resultados...</h2>
      </div>
    );
  }

  return (
    <div id="resultadoSimulacion" style={{
      fontFamily: "Arial, Helvetica, sans-serif",
      backgroundColor: "#ffffff",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* barra de arriba */}
      <Navbar />

      {/* contenido */}
      <main style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", padding: "40px 20px",
      }}>
        <div style={{
          backgroundColor: "#CCCDD2", padding: "clamp(20px, 4vw, 40px)",
          borderRadius: "18px", boxShadow: "0px 2px 6px rgba(0,0,0,0.1)",
          width: "min(90%, 700px)",
        }}>
          <h1 style={{
            textAlign: "center", color: "#1C142E", marginBottom: "25px",
          }}>Resultado de tu Simulación</h1>

          <table style={{
            width: "100%", borderCollapse: "collapse",
            fontSize: "16px", color: "#1C142E",
          }}>
            <tbody>
              <tr><td style={{ padding: "10px", fontWeight: "bold" }}>Fecha</td>
                <td style={{ padding: "10px" }}>{resultado.fecha}</td></tr>
              <tr><td style={{ padding: "10px", fontWeight: "bold" }}>Monto</td>
                <td style={{ padding: "10px" }}>${resultado.monto.toLocaleString()}</td></tr>
              <tr><td style={{ padding: "10px", fontWeight: "bold" }}>Cuotas</td>
                <td style={{ padding: "10px" }}>{resultado.numero_cuotas}</td></tr>
              <tr><td style={{ padding: "10px", fontWeight: "bold" }}>Tasa de interés</td>
                <td style={{ padding: "10px" }}>{(resultado.tasa_interes * 100).toFixed(2)}%</td></tr>
              <tr><td style={{ padding: "10px", fontWeight: "bold" }}>Seguro</td>
                <td style={{ padding: "10px" }}>{resultado.seguro}</td></tr>
              <tr><td style={{ padding: "10px", fontWeight: "bold" }}>Valor cuota</td>
                <td style={{ padding: "10px" }}>${resultado.valorCuota.toLocaleString()}</td></tr>
              <tr><td style={{ padding: "10px", fontWeight: "bold" }}>Total crédito</td>
                <td style={{ padding: "10px" }}>${resultado.totalCredito.toLocaleString()}</td></tr>
            </tbody>
          </table>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "25px",
            gap: "20px",
          }}
        >
          <button
            onClick={() => navigate("/simulacion")}
            style={{
              padding: "10px 20px",
              backgroundColor: "#312F55",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Nueva simulación
          </button>

          <button
            onClick={() => {
              if (idSimulacion) {
                navigate(`/solicitud/${idSimulacion}`);
              } else {
                alert("No se encontró el ID de la simulación. Intenta nuevamente.");
              }
            }}
            style={{
              padding: "10px 20px",
              backgroundColor: idSimulacion ? "#1a1f3c" : "#888",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: idSimulacion ? "pointer" : "not-allowed",
              fontWeight: "bold",
            }}
            disabled={!idSimulacion}
          >
            Solicitar crédito
          </button>
        </div>


        </div>
      </main>

      {/* barra inferior */}
      <footer style={{
        backgroundColor: "#272D48", color: "white",
        textAlign: "center", padding: "clamp(15px, 3vw, 25px) 0",
        fontSize: "clamp(12px, 2vw, 14px)",
      }}>
        © 2025 Préstamos de Consumo Digital
      </footer>
    </div>
  );
}
