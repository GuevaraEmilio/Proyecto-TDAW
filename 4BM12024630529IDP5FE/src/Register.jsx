import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();

    if (!form.username || !form.email || !form.password || !form.confirmPassword) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    fetch("http://localhost:9999/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: form.username,
        email: form.email,
        password: form.password,
        type_user: "user",  // Por defecto, o puedes poner selector para tipo
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al registrar");
        return res.json();
      })
      .then((data) => {
        toast.success("Registro exitoso, ya puedes iniciar sesión");
        setForm({ username: "", email: "", password: "", confirmPassword: "" });
      })
      .catch(() => toast.error("Error al registrar usuario"));
  };

  return (
    <div
      style={{
        backgroundImage: 'url("/media/oceano.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <form
        onSubmit={handleRegister}
        style={{
          backgroundColor: "rgba(255,255,255,0.9)",
          padding: "40px",
          borderRadius: "10px",
          boxShadow: "0 0 10px rgba(0,0,0,0.3)",
          width: "400px",
          textAlign: "center",
        }}
      >
        <h2>Registrate</h2>
        <p>
          <strong>Proyecto: Videojuego controlado por voz</strong>
        </p>

        <input
          type="text"
          name="username"
          placeholder="Usuario"
          value={form.username}
          onChange={handleChange}
          style={{ marginBottom: "10px", width: "100%", padding: "10px" }}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          style={{ marginBottom: "10px", width: "100%", padding: "10px" }}
        />

        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          style={{ marginBottom: "10px", width: "100%", padding: "10px" }}
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirmar contraseña"
          value={form.confirmPassword}
          onChange={handleChange}
          style={{ marginBottom: "20px", width: "100%", padding: "10px" }}
        />

        <button type="submit" style={{ padding: "10px 20px", width: "100%" }}>
          Registrarse
        </button>
      </form>
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}

export default Register;
