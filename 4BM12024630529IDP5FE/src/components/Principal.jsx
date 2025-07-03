import React from "react";
import { useLocation } from "react-router-dom";

function Principal() {
  // Obtén el usuario desde la navegación o localStorage
  const location = useLocation();
  const userData = location.state?.user;
  const username = userData?.username || localStorage.getItem("username") || "Invitado";

  // Guarda el nombre en localStorage para futuras visitas
  React.useEffect(() => {
    if (userData?.username) {
      localStorage.setItem("username", userData.username);
    }
  }, [userData]);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: 'url("/media/fondo.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.85)",
          padding: "30px 50px",
          borderRadius: "12px",
          boxShadow: "0 0 16px rgba(0,0,0,0.18)",
          textAlign: "center"
        }}
      >
        <h2>Bienvenido, {username}!</h2>
        {/* ...resto de tu componente del videojuego... */}
      </div>
    </div>
  );
}

export default Principal;
