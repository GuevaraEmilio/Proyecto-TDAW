import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  return (
    <div>
      {/* ...existing code... */}
      <button
        style={{
          marginTop: "20px",
          background: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          padding: "10px 20px",
          cursor: "pointer",
          fontSize: "16px",
        }}
        onClick={() => navigate("/")}
      >
        Volver al inicio de sesión
      </button>
    </div>
  );
}

export default Register;