import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { back_dir } from "../backend";
import Navbar from "./navbar";

export default function HistorialPrestamos() {
  const navigate = useNavigate();
  const [prestamos, setPrestamos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerHistorial = async () => {
      try {
        const res = await fetch(`${back_dir}/historialPrestamos`, {
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
        setPrestamos(data.prestamos || []);
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

  // Formatear fechas
  const formatearFecha = (isoDate) => {
    const fecha = new Date(isoDate);
    return fecha.toLocaleDateString("es-CL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
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
          Historial de Créditos Personales
        </h2>

        {prestamos.length === 0 && (
          <p>No tienes créditos personales registrados.</p>
        )}

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          {prestamos.map((p) => (
            <div
              key={p.id}
              style={{
                width: "33.33%",
                boxSizing: "border-box",
                padding: "20px",
              }}
            >
              <div
                style={{
                    boxSizing: "border-box",
                    border: "3px solid #1a1f3c",
                    borderRadius: "10px",
                    padding: "20px",
                    minWidth: "350px",
                    margin:"auto",
                    marginTop:"25px"
                }}
              >
                <p><strong>ID:</strong> {p.id}</p>
                <p><strong>Monto:</strong> ${p.monto.toLocaleString()}</p>
                <p><strong>Cuotas:</strong> {p["numero-cuotas"]}</p>
                <p><strong>Interés:</strong> {Number(p["tasa-interes"]).toFixed(3)}%</p>
                <p><strong>Fecha:</strong> {formatearFecha(p.fecha)}</p>
                <p><strong>Estado:</strong> {p["estado-aprobacion"]}</p>
                <p><strong>Pago:</strong> {p["estado-pago"]}</p>
                <p><strong>Seguro:</strong> {p.seguro}</p>
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
