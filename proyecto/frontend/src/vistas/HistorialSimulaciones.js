import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { back_dir } from "../backend";
import Navbar from "./navbar";

export default function HistorialSimulaciones() {
  const navigate = useNavigate();
  const [simulaciones, setSimulaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerHistorial = async () => {
      try {
        const res = await fetch(`${back_dir}/historialSimulaciones`, {
          method: "GET",
          credentials: "include",
        });

        if (res.status === 401) {
          navigate("/login");
          return;
        }

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Error al cargar historial");
        }

        const data = await res.json();
        setSimulaciones(data.historial || []);
      } catch (err) {
        console.error("Error al cargar historial:", err);
        setError("Error cargando historial");
      } finally {
        setLoading(false);
      }
    };

    obtenerHistorial();
  }, [navigate]);

  if (loading) return <h2 style={{ textAlign: "center" }}>Cargando historial...</h2>;
  if (error) return <h2 style={{ textAlign: "center" }}>{error}</h2>;

  // 🔹 Función para formatear fecha en DD/MM/YYYY
  const formatearFecha = (isoDate) => {
    const fecha = new Date(isoDate);
    return fecha.toLocaleDateString("es-CL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };

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

      <main style={{ padding: "30px", flex: 1 }}>
        <h2 style={{ color: "#1C142E", marginBottom: "25px" }}>
          Historial de Simulaciones
        </h2>

        {simulaciones.length === 0 && <p>No tienes simulaciones previas.</p>}

        <div
        style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",   // centra los elementos en cada fila
            alignItems: "flex-start",
        }}
        >
        {simulaciones.map((sim) => (
            <div
            key={sim.id}
            style={{
                width: "30%",  
                boxSizing: "border-box",
                border: "3px solid #1a1f3c",
                borderRadius: "10px",
                padding: "20px",
                minWidth: "350px",
                margin:"auto",
                marginTop:"25px"

            }}
            >
            {/* Aquí dentro va tu tarjeta, tú le das estilos */}
            <div style={{ padding: "20px" }}>
                <p><strong>ID:</strong> {sim.id}</p>
                <p><strong>Monto:</strong> ${sim.monto.toLocaleString()}</p>
                <p><strong>Cuotas:</strong> {sim["numero-cuotas"]}</p>
                <p><strong>Tasa interés:</strong> {Number(sim["tasa-interes"]).toFixed(3)}%</p>
                <p><strong>Fecha:</strong> {formatearFecha(sim.fecha)}</p>

                <button
                onClick={() => navigate(`/solicitud/${sim.id}`)}
                style={{
                    padding: "10px 20px",
                    backgroundColor: "#1a1f3c",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    minWidth:"250px",
                }}
                >
                Solicitar crédito
                </button>
            </div>
            </div>
        ))}
        </div>


      </main>

      <footer
        style={{
          backgroundColor: "#272D48",
          color: "white",
          textAlign: "center",
          padding: "20px 0",
          fontSize: "14px",
        }}
      >
        © 2025 Préstamos de Consumo Digital
      </footer>
    </div>
  );
}
