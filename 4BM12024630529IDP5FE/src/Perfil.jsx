import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";

function Perfil(props) {
  const [form, setForm] = useState({ username: "", email: "", password: "" });

  useEffect(() => {
    // Revisamos si llegó el usuario desde history.push
    const user = props.location.state?.user;

    if (user) {
      setForm({
        username: user.username,
        email: "",  // si tienes el email en user, ponlo aquí
        password: "",
      });
    } else {
      // Si no hay usuario, redirige al login
      props.history.push("/");
    }
  }, [props.location.state, props.history]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleUpdate = () => {
    toast.success("Datos actualizados (simulado)");
  };

  const handleDelete = () => {
    if (window.confirm("¿Seguro quieres eliminar tu cuenta?")) {
      toast.success("Cuenta eliminada (simulado)");
      props.history.push("/");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Mi Perfil</h2>
      <input
        name="username"
        value={form.username}
        onChange={handleChange}
        placeholder="Usuario"
      />
      <input
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
      />
      <input
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Nueva contraseña"
      />
      <button onClick={handleUpdate}>Actualizar</button>
      <button onClick={handleDelete} style={{ marginLeft: 10, color: "red" }}>
        Eliminar cuenta
      </button>
      <ToastContainer />
    </div>
  );
}

export default Perfil;
