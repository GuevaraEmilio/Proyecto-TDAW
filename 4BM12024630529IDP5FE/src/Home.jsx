import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Home() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ username: "", email: "" });
  const [editId, setEditId] = useState(null); // id del usuario en edición

  // Cargar usuarios al montar
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    fetch("http://localhost:9999/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch(() => toast.error("Error cargando usuarios"));
  };

  // Manejar inputs del formulario
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Crear nuevo usuario o actualizar existente
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.username || !form.email) {
      toast.error("Completa todos los campos");
      return;
    }

    if (editId === null) {
      // Crear
      fetch("http://localhost:9999/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
        .then((res) => {
          if (!res.ok) throw new Error();
          return res.json();
        })
        .then(() => {
          toast.success("Usuario creado");
          setForm({ username: "", email: "" });
          fetchUsers();
        })
        .catch(() => toast.error("Error creando usuario"));
    } else {
      // Actualizar
      fetch(`http://localhost:9999/users/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
        .then((res) => {
          if (!res.ok) throw new Error();
          return res.json();
        })
        .then(() => {
          toast.success("Usuario actualizado");
          setForm({ username: "", email: "" });
          setEditId(null);
          fetchUsers();
        })
        .catch(() => toast.error("Error actualizando usuario"));
    }
  };

  // Cargar usuario en formulario para edición
  const handleEdit = (user) => {
    setForm({ username: user.username, email: user.email });
    setEditId(user.id);
  };

  // Eliminar usuario
  const handleDelete = (id) => {
    if (!window.confirm("¿Eliminar este usuario?")) return;

    fetch(`http://localhost:9999/users/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        toast.success("Usuario eliminado");
        fetchUsers();
      })
      .catch(() => toast.error("Error eliminando usuario"));
  };

  return (
    <div
      style={{
        backgroundImage: 'url("/media/oceano.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        padding: "20px",
        boxSizing: "border-box",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          borderRadius: "10px",
          padding: "20px",
          boxShadow: "0 0 10px rgba(0,0,0,0.3)",
        }}
      >
        <h2>Administrar Usuarios</h2>

        {/* Formulario Crear/Editar */}
        <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
          <input
            name="username"
            placeholder="Usuario"
            value={form.username}
            onChange={handleChange}
            style={{ marginRight: "10px", padding: "8px", width: "40%" }}
          />
          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            style={{ marginRight: "10px", padding: "8px", width: "40%" }}
          />
          <button type="submit" style={{ padding: "8px 16px" }}>
            {editId === null ? "Crear" : "Actualizar"}
          </button>
          {editId !== null && (
            <button
              type="button"
              onClick={() => {
                setForm({ username: "", email: "" });
                setEditId(null);
              }}
              style={{ marginLeft: "10px", padding: "8px 16px" }}
            >
              Cancelar
            </button>
          )}
        </form>

        {/* Tabla de usuarios */}
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "left",
          }}
        >
          <thead>
            <tr>
              <th>#</th>
              <th>Usuario</th>
              <th>Email</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  No hay usuarios para mostrar
                </td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr key={user.id || index}>
                  <td>{index + 1}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    <button onClick={() => handleEdit(user)}>Editar</button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      style={{ marginLeft: "10px", color: "red" }}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}

export default Home;
