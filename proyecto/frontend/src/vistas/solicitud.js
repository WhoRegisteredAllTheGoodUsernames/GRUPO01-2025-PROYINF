import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { back_dir } from "../backend";
import logo from "../img/logo.png";

export default function Solicitud() {
  const { idSimulacion } = useParams(); // 👈 ahora viene desde la URL
  const navigate = useNavigate();
  const [simulacion, setSimulacion] = useState(null);
  const [error, setError] = useState(null);


  useEffect(() => {
    const cargarSimulacion = async () => {
      if (!idSimulacion) {
        setError("No se recibió el ID de la simulación.");
        return;
      }

      try {
        const res = await fetch(`${back_dir}/solicitud/${idSimulacion}`, {
          method: "GET",
          credentials: "include",
        });

        if (res.status === 401) {
          navigate("/login");
          return;
        }

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Error al obtener la simulación");
        }

        const data = await res.json();
        setSimulacion(data.simulacion);
      } catch (err) {
        console.error("❌ Error al cargar simulación:", err);
        setError("Error al cargar los datos de la simulación.");
      }
    };

    cargarSimulacion();
  }, [idSimulacion, navigate]);

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

  if (!simulacion) {
    return (
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        height: "100vh", fontFamily: "Arial, sans-serif",
      }}>
        <h2>Cargando solicitud...</h2>
      </div>
    );
  }

  return (
    <div id="solicitud" style={{
      fontFamily: "Arial, Helvetica, sans-serif",
      backgroundColor: "#ffffff",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* barra superior */}
      <header style={{
        backgroundColor: "#1a1f3c",
        color: "white",
        padding: "clamp(15px, 4vw, 25px) clamp(15px, 4vw, 30px)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "15px",
      }}>
        <div style={{ fontSize: "25px", fontWeight: "bold" }}>
          <img
            src={logo}
            alt="Logo"
            style={{
              width: "auto",
              height: "clamp(30px, 5vw, 45px)",
              maxWidth: "120px",
            }}
          />
        </div>
        <div style={{
          display: "flex",
          gap: "clamp(15px, 3vw, 20px)",
          alignItems: "center",
          flexWrap: "wrap",
        }}>
          <a
            href="/logout"
            style={{
              color: "white",
              textDecoration: "none",
              fontWeight: "bold",
              fontSize: "clamp(14px, 2vw, 17px)",
              whiteSpace: "nowrap",
            }}
          >
            Cerrar sesión
          </a>
        </div>
      </header>

      {/* contenido principal */}
      <main style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
      }}>
        <div style={{
          backgroundColor: "#CCCDD2",
          padding: "clamp(20px, 4vw, 40px)",
          borderRadius: "18px",
          boxShadow: "0px 2px 6px rgba(0,0,0,0.1)",
          width: "min(90%, 700px)",
        }}>
          <h1 style={{
            textAlign: "center",
            color: "#1C142E",
            marginBottom: "25px",
          }}>
            Solicitud de Crédito
          </h1>

          <p style={{
            textAlign: "center",
            color: "#333",
            marginBottom: "25px",
          }}>
            Revisa la información de tu simulación antes de confirmar tu solicitud.
          </p>

          <table style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "16px",
            color: "#1C142E",
          }}>
            <tbody>
              <tr>
                <td style={{ padding: "10px", fontWeight: "bold" }}>Fecha</td>
                <td style={{ padding: "10px" }}>{simulacion.fecha}</td>
              </tr>
              <tr>
                <td style={{ padding: "10px", fontWeight: "bold" }}>Monto</td>
                <td style={{ padding: "10px" }}>${simulacion.monto.toLocaleString()}</td>
              </tr>
              <tr>
                <td style={{ padding: "10px", fontWeight: "bold" }}>Cuotas</td>
                <td style={{ padding: "10px" }}>{simulacion["numero-cuotas"]}</td>
              </tr>
              <tr>
                <td style={{ padding: "10px", fontWeight: "bold" }}>Tasa de interés</td>
                <td style={{ padding: "10px" }}>{(simulacion["tasa-interes"] * 100).toFixed(2)}%</td>
              </tr>
              <tr>
                <td style={{ padding: "10px", fontWeight: "bold" }}>Seguro</td>
                <td style={{ padding: "10px" }}>{simulacion.seguro}</td>
              </tr>
              <tr>
                <td style={{ padding: "10px", fontWeight: "bold" }}>Scoring requerido</td>
                <td style={{ padding: "10px" }}>{simulacion["scoring-requerido"]}</td>
              </tr>
            </tbody>
          </table>

          <div style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "30px",
            gap: "20px",
          }}>
            <button
              onClick={() => navigate("/resultadoSimulacion")}
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
              Volver
            </button>

            <button
              onClick={() => navigate(`/solicitud/${idSimulacion}/datos`)}
              style={{
                padding: "10px 20px",
                backgroundColor: "#1a1f3c",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Confirmar datos
            </button>
          </div>
        </div>
      </main>

      {/* barra inferior */}
      <footer style={{
        backgroundColor: "#272D48",
        color: "white",
        textAlign: "center",
        padding: "clamp(15px, 3vw, 25px) 0",
        fontSize: "clamp(12px, 2vw, 14px)",
      }}>
        © 2025 Préstamos de Consumo Digital
      </footer>
    </div>
  );
}
