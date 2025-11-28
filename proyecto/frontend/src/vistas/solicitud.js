import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { back_dir } from "../backend";
import Navbar from "./navbar";

export default function VerSimulacion() {
  const { idSimulacion } = useParams();
  const [simulacion, setSimulacion] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarSimulacion = async () => {
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
          const msg = await res.text();
          throw new Error(msg || "Error al obtener simulación");
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
      <div style={{ textAlign: "center", marginTop: "25vh", color: "red" }}>
        <h2>{error}</h2>
      </div>
    );
  }

  if (!simulacion) {
    return (
      <div style={{ textAlign: "center", marginTop: "25vh" }}>
        <h2>Cargando simulación...</h2>
      </div>
    );
  }

  return (
    <div
      style={{
        fontFamily: "Arial, Helvetica, sans-serif",
        backgroundColor: "#ffffff",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Navbar />


      {/* Contenido principal */}
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
        }}
      >
        <div
          style={{
            backgroundColor: "#CCCDD2",
            padding: "clamp(20px, 4vw, 40px)",
            borderRadius: "18px",
            boxShadow: "0px 2px 6px rgba(0,0,0,0.1)",
            width: "min(90%, 700px)",
          }}
        >
          <h1
            style={{
              textAlign: "center",
              color: "#1C142E",
              marginBottom: "25px",
            }}
          >
            Detalle de Simulación
          </h1>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "16px",
              color: "#1C142E",
            }}
          >
            <tbody>
              {Object.entries(simulacion).map(([key, value]) => (
                <tr key={key}>
                  <td
                    style={{
                      padding: "10px",
                      fontWeight: "bold",
                      borderBottom: "1px solid #ddd",
                      textTransform: "capitalize",
                    }}
                  >
                    {key.replace(/_/g, " ")}
                  </td>
                  <td
                    style={{
                      padding: "10px",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    {String(value)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          onClick={() => navigate(`/solicitud/${idSimulacion}/datos`)}
          style={{
            marginTop: "30px",
            padding: "10px 20px",
            backgroundColor: "#1a1f3c",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Continuar solicitud
        </button>
      </main>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: "#272D48",
          color: "white",
          textAlign: "center",
          padding: "15px 0",
        }}
      >
        © 2025 Préstamos de Consumo Digital
      </footer>
    </div>
  );
}
