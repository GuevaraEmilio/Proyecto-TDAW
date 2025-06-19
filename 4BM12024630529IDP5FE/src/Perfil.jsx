import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";

function Perfil(props) {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [userId, setUserId] = useState(null);
  useEffect(() => {
    // Revisamos si llegó el usuario desde history.push
    const user = props.location.state?.user;

    if (user) {
      setForm({
        username: user.username,
        email: user.email,
        password: "",
      });
      setUserId(user.id);
    } else {
      // Si no hay usuario, redirige al login
      props.history.push("/");
    }
  }, [props.location.state, props.history]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleUpdate = () => {
  if (!userId) return;

  fetch(`http://localhost:9999/users/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: form.password }), // Solo cambia la contraseña
  })
    .then((res) => {
      if (!res.ok) throw new Error("Error al actualizar");
      return res.json();
    })
    .then(() => {
      toast.success("Contraseña actualizada exitosamente");
      setForm({ ...form, password: "" });
    })
    .catch(() => toast.error("No se pudo actualizar la contraseña"));
};

  const handleDelete = () => {
  if (!userId) return;

  if (window.confirm("¿Seguro quieres eliminar tu cuenta?")) {
    fetch(`http://localhost:9999/users/${userId}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al eliminar");
        return res.json();
      })
      .then(() => {
        toast.success("Cuenta eliminada exitosamente");
        setTimeout(() => props.history.push("/"), 2000);
      })
      .catch(() => toast.error("No se pudo eliminar la cuenta"));
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
