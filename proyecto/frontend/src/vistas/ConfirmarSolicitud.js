import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { back_dir } from "../backend";
import Navbar from "./navbar";

export default function ConfirmarSolicitud() {
  const { idSimulacion } = useParams();
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();
// Agregados para la firma virtual
  const [enviandoFirma, setEnviandoFirma] = useState(false);
  const [firmaEnviada, setFirmaEnviada] = useState(false);

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
      alert(data.message);
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

  // Proceso de firma virtual
  const inciarProcesoFirma = async () => {
    if (!resultado.email_cliente || !resultado.nombre_cliente){
      alert("Error: Faltan datos del cliente (email o nombre)");
      return;
    }
    setEnviandoFirma(true);
    try {
      const res = await fetch(`${back_dir}/api/docusign/firma`, {
        method: "POST",
        headers: { 'Content-Type' : 'application/json'},
        body: JSON.stringify({
          idSolicitud : resultado.id,
          emailCliente:resultado.email_cliente,
          nombreCliente: resultado.nombre_cliente
        })
      });
      const data = await res.json();
      if(!res.ok) throw new Error(data.error || "Error al conectar con docusign");
      setFirmaEnviada(true);
    } catch (error) {
      console.error("Erorr firma: ", error);
      alert("Hubo un error al enviar la solicitud de firma")
    } finally {
      setEnviandoFirma(false);
    }

  }



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

            // Modifique esta parte para agregar un boton, despues de confirmar la solicitud y esta es aprobada, aparece abajo el boton de ir a firmar documentos
            // En ese momento inicia toda la comunicacion con la API de docusign, si esta todo correcto se le manda al correo los documentos para firmar y se muestra en pantalla
            <>
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
            
            {resultado["estado-aprobacion"] === "Aprobado" && !firmaEnviada && (
              <button
                onClick={inciarProcesoFirma}
                disabled={enviandoFirma}
                style={{
                  marginTop: "15px",
                  width:"100%",
                  padding: "12px",
                  backgroundColor: "#2463eb",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "16px",
                  boxShadow: "0 4px 6px rgba(0,0,0,0,1)"
                }}>
                  {enviandoFirma ? "Conectando con Dosusign..." : "Ir a firmar documentos"}
                </button> )}

              {firmaEnviada && (
                <div style={{
                      marginTop: "20px",
                      padding: "15px",
                      backgroundColor: "#d1fae5",
                      border: "1px solid #34d399",
                      borderRadius: "8px",
                      color: "#065f46",
                      textAlign: "center"
                }}>
                  <p style={{margin: 0, fontWeight: "bold"}}>Documentos enviados al correo</p>
                  <p style={{marginTop: "5px", fontSize: "0.9em"}}>
                      Revisa el correo <strong>{resultado.email_cliente}</strong> para firmar</p>
                </div>
              )}
              </>
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
