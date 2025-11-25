import { back_dir } from "../backend";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const act = back_dir + "/login";

export default function Login() {
  const navigate = useNavigate();
  const [rut, setRut] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch(act, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rut, pass }),
        credentials: "include", // mantiene la sesión
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Error al iniciar sesión");
      }

      const data = await res.json();
      if (data.ok) {
        console.log("✅ Usuario autenticado:", data.user);

        localStorage.setItem("usuario_sesion", JSON.stringify(data.user));

        const destino = data.redirect || "/simulacion"; // usa redirect del backend
        navigate(destino);
      } else {
        setError("Credenciales incorrectas");
      }
    } catch (err) {
      console.error("Error de login:", err);
      setError("Error al conectar con el servidor");
    }
  };

  return (
    <div
      id="login"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <form
        onSubmit={handleLogin}
        style={{
          backgroundColor: "#fff",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          width: "min(90%, 400px)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "20px",
            color: "#1a1f3c",
          }}
        >
          Iniciar sesión
        </h2>

        <label htmlFor="rut" style={{ fontWeight: "bold" }}>
          RUT
        </label>
        <input
          required
          name="rut"
          value={rut}
          onChange={(e) => setRut(e.target.value)}
          style={{
            display: "block",
            width: "100%",
            marginBottom: "15px",
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />

        <label htmlFor="pass" style={{ fontWeight: "bold" }}>
          Contraseña
        </label>
        <input
          required
          name="pass"
          type="password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          style={{
            display: "block",
            width: "100%",
            marginBottom: "20px",
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />

        {error && (
          <p style={{ color: "red", textAlign: "center", marginBottom: "10px" }}>
            {error}
          </p>
        )}

        <input
          type="submit"
          value="Ingresar"
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#1a1f3c",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        />
      </form>
        <div >
          
        <button 
            onClick={() => navigate('/registro')}
            style={{
            width: "100%",
            marginTop: "10px",
            padding: "10px",
            backgroundColor: "#1a1f3c",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
          }} >Registarse</button>
          </div>
    </div>
  );
}
