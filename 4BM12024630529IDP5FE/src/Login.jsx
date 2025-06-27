import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom"; // <- ESTE es el correcto
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const [user, setUser] = useState("");
  const [name, setName] = useState("Invitado");
  const [password, setPassword] = useState("");
  const history = useHistory();

  const handleLogin2 = () => {
    history.push({pathname:"/jugar", nm:{name}});
  }

  const handleLogin = () => {
    fetch(`http://localhost:9999/?User=${user}&password=${password}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "yes") {
          toast.success(`Bienvenido, tipo de usuario: ${data.tipo}`, {
            position: "top-center",
            autoClose: 3000,
          });
          setTimeout(() => {
            if (data.tipo === "admin") {
              history.push("/Home", { user: data });
            } else if (data.tipo === "user") {
              history.push("/Perfil", {user:data});
            }
          }, 3000);

          //navigate("/Home")
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
          textAlign: "center", //,
          //width: "300px",
        }}
      >
        <h2>Iniciar sesión</h2>
        <p>
          <strong>Proyecto: Videojuego controlado por voz</strong>
        </p>
        <div style={{ fontSize: "14px", marginBottom: "10px" }}>
          <table border="0" textAlign="center" width={300}>
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
       {/* <input
          type="text"
          placeholder="Usuario"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          style={{ margin: "10px 0", padding: "10px", width: "100%" }}
        />
        <br />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ margin: "10px 0", padding: "10px", width: "100%" }}
        />
        <br />*/}
        <input
          type="password"
          placeholder="invitado"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ margin: "10px 0", padding: "10px", width: "100%" }}
        />
        <br />
        <button
          onClick={handleLogin2}
          style={{ padding: "10px 20px", width: "100%" }}
        >
          Iniciar sesión
        </button>
        <p style={{ marginTop: "15px" }}>
          ¿No tienes cuenta?{" "}
          <Link to="/Register" style={{ color: "blue", cursor: "pointer" }}>
            Regístrate aquí
          </Link>
        </p>
      </div>
      {/* Contenedor para que los toasts se muestren */}
      <ToastContainer />
    </div>
  );
}

export default Login;
