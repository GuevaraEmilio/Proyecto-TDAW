import React from "react";
import { useEffect, useState } from "react";

function Home() {

    const [users, setUsers]= useState([]);
    useEffect = (() => {
       fetch(`http://localhost:9999/?User=${user}&password=${password}`)
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch(err => console.error(err));
    }, []);

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
          textAlign: "center"//,
          //width: "300px",
        }}
      >
        <div style={{ fontSize: "14px", marginBottom: "10px" }}>
          <table border="5" textAlign="center" width={300}>
            <thead><th><td>Administrar usuarios</td></th></thead>
            <tbody>
                {users.map((user, index) => (
                    <tr><td>{index}</td></tr>
                ))}
            </tbody>
          </table>
        </div>


      </div>
      {/* Contenedor para que los toasts se muestren */}
      <ToastContainer />
    </div>
  );
}

export default Home;
