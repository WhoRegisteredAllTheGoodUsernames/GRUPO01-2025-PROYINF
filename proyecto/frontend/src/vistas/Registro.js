import { back_dir } from "../backend";
import { useState } from "react";

export default function Registro() {
  const [form, setForm] = useState({
    rut: "",
    pass: "",
    "primer-nombre": "",
    "segundo-nombre": "",
    "apellido-paterno": "",
    "apellido-materno": "",
    "fecha-nacimiento": "",
  });

  const [error, setError] = useState(null);
  const [exito, setExito] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
	e.preventDefault();
	setError(null);

	try {
		const data = {
		rut: form.rut,
		pass: form.pass,
		"primer-nombre": form["primer-nombre"],
		"segundo-nombre": form["segundo-nombre"],
		"apellido-paterno": form["apellido-paterno"],
		"apellido-materno": form["apellido-materno"],
		"tipo[]": "C",
		"fecha-nacimiento": form["fecha-nacimiento"],
		};

		const formData = new URLSearchParams(data);

		const res = await fetch(`${back_dir}/registro`, {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: formData.toString(),
		});

		if (!res.ok) throw new Error("Error al registrar usuario");

		const result = await res.json();
		console.log("✅ Registro exitoso:", result);

		alert("Registro exitoso. Ahora puedes iniciar sesión.");
		window.location.href = "/";
	} catch (err) {
		console.error(err);
		alert("Error al conectar con el servidor o datos inválidos");
	}
};


  return (
    <div
      id="registro"
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
        onSubmit={handleSubmit}
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
          Registro
        </h2>

        <label style={{ fontWeight: "bold" }}>RUT</label>
        <input
          name="rut"
          required
          onChange={handleChange}
          style={inputStyle}
        />

        <label style={{ fontWeight: "bold" }}>Contraseña</label>
        <input
          name="pass"
          type="password"
          required
          onChange={handleChange}
          style={inputStyle}
        />

        <label style={{ fontWeight: "bold" }}>Primer nombre</label>
        <input
          name="primer-nombre"
          required
          onChange={handleChange}
          style={inputStyle}
        />

        <label style={{ fontWeight: "bold" }}>Segundo nombre</label>
        <input
          name="segundo-nombre"
          onChange={handleChange}
          style={inputStyle}
        />

        <label style={{ fontWeight: "bold" }}>Apellido paterno</label>
        <input
          name="apellido-paterno"
          required
          onChange={handleChange}
          style={inputStyle}
        />

        <label style={{ fontWeight: "bold" }}>Apellido materno</label>
        <input
          name="apellido-materno"
          required
          onChange={handleChange}
          style={inputStyle}
        />

        <label style={{ fontWeight: "bold" }}>Tipo</label>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ marginRight: "10px" }}>
            <input type="radio" name="tipo[]" value="C" defaultChecked /> C
          </label>
        </div>

        <label style={{ fontWeight: "bold" }}>Fecha de nacimiento</label>
        <input
          name="fecha-nacimiento"
          type="date"
          required
          onChange={handleChange}
          style={inputStyle}
        />

        {error && (
          <p style={{ color: "red", textAlign: "center", marginBottom: "10px" }}>
            {error}
          </p>
        )}
        {exito && (
          <p
            style={{
              color: "green",
              textAlign: "center",
              marginBottom: "10px",
              fontWeight: "bold",
            }}
          >
            {exito}
          </p>
        )}

        <input
          type="submit"
          value="Registrarse"
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
    </div>
  );
}

const inputStyle = {
  display: "block",
  width: "100%",
  marginBottom: "15px",
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
};
