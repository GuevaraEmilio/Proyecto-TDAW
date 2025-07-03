import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  const handleLogin = (e) => {
    e.preventDefault();
    fetch(
      `http://localhost:9999/?User=${encodeURIComponent(user)}&password=${encodeURIComponent(password)}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "yes") {
          toast.success(`Bienvenido, tipo de usuario: ${data.tipo}`, {
            position: "top-center",
            autoClose: 2000,
          });
          setTimeout(() => {
            history.push("/jugar", { user: data }); // Redirige siempre a /jugar
          }, 2000);
        } else {
          toast.error("Usuario o contraseña incorrectos.", {
            position: "top-center",
            autoClose: 3000,
          });
          setUser("");
          setPassword("");
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("Error al conectar con el servidor.", {
          position: "top-center",
          autoClose: 3000,
        });
      });
  };

  return (
    <>
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
        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            padding: "40px",
            borderRadius: "10px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
            textAlign: "center",
          }}
        >
          <h2>Iniciar sesión</h2>
          <p>
            <strong>Proyecto: Videojuego controlado por voz</strong>
          </p>
          <div style={{ fontSize: "14px", marginBottom: "10px" }}>
            <table border="0" style={{ textAlign: "center" }} width={300}>
              <tbody>
                <tr>
                  <td>Ahumada Cordero Daniela Sofía</td>
                </tr>
                <tr>
                  <td>Guevara Nambo Emilio</td>
                </tr>
                <tr>
                  <td>Ramírez Martínez Shareni</td>
                </tr>
              </tbody>
            </table>
          </div>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Usuario"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              style={{ margin: "10px 0", padding: "10px", width: "100%" }}
              autoFocus
            />
            <br />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ margin: "10px 0", padding: "10px", width: "100%" }}
            />
            <br />
            <button
              type="submit"
              style={{ padding: "10px 20px", width: "100%" }}
            >
              Iniciar sesión
            </button>
          </form>
          <p style={{ marginTop: "15px" }}>
            ¿No tienes cuenta?{" "}
            <Link to="/Register" style={{ color: "blue", cursor: "pointer" }}>
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default Login;

