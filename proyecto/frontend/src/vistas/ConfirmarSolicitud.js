import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { back_dir } from "../backend";
import logo from "../img/logo.png";

export default function ConfirmarSolicitud() {
  const { idSimulacion } = useParams();
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  // Obtener el resumen de la simulación al montar la vista
  const obtenerResumen = async () => {
    try {
      setCargando(true);
      const res = await fetch(`${back_dir}/solicitud/${idSimulacion}`, {
        method: "GET",
        credentials: "include",
      });

      if (res.status === 401) {
        navigate("/login");
        return;
      }

      if (!res.ok) throw new Error("Error al cargar los datos de la simulación");

      const data = await res.json();
      setResultado(data.simulacion || data);
    } catch (err) {
      console.error("❌ Error al obtener resumen:", err);
      setError("No se pudieron cargar los datos de la simulación.");
    } finally {
      setCargando(false);
    }
  };

  // Procesar confirmación (POST)
  const confirmarSolicitud = async () => {
    try {
      setCargando(true);
      const res = await fetch(`${back_dir}/solicitud/${idSimulacion}/confirmar`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Error al confirmar la solicitud");

      const data = await res.json();
      setResultado(data.prestamo);
      alert(data.message);
    } catch (err) {
      console.error("❌ Error en confirmación:", err);
      alert("Error al procesar la confirmación.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerResumen();
  }, [idSimulacion]);

  if (error) {
    return (
      <div style={{ textAlign: "center", marginTop: "25vh", color: "red" }}>
        <h2>{error}</h2>
      </div>
    );
  }

  if (cargando || !resultado) {
    return (
      <div style={{ textAlign: "center", marginTop: "25vh" }}>
        <h2>Cargando...</h2>
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
      {/* Header */}
      <header
        style={{
          backgroundColor: "#1a1f3c",
          color: "white",
          padding: "20px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <img src={logo} alt="Logo" style={{ height: "40px" }} />
        <h2>Confirmar solicitud #{idSimulacion}</h2>
        <a
          href="/logout"
          style={{
            color: "white",
            textDecoration: "none",
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          Cerrar sesión
        </a>
      </header>

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
            Resumen de la solicitud
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
              {Object.entries(resultado).map(([key, value]) => (
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

          {!resultado["estado-aprobacion"] && (
            <button
              onClick={confirmarSolicitud}
              disabled={cargando}
              style={{
                marginTop: "30px",
                width: "100%",
                padding: "10px",
                backgroundColor: "#1a1f3c",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              {cargando ? "Procesando..." : "Confirmar solicitud"}
            </button>
          )}

          {resultado["estado-aprobacion"] && (
            <h2
              style={{
                marginTop: "30px",
                textAlign: "center",
                color:
                  resultado["estado-aprobacion"] === "Aprobado"
                    ? "green"
                    : "red",
              }}
            >
              Solicitud {resultado["estado-aprobacion"]}
            </h2>
          )}
        </div>
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
