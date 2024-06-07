import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const AccessDenied = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="container mt-5">
      <div className="text-center" style={{ marginTop: "100px", marginBottom: "50px" }}>
        <h1 className="display-4">Acceso Denegado</h1>
        <p className="lead">No tienes permiso para acceder a esta página.</p>
        <h1 className="display-2">
          <i className="bi bi-emoji-frown"></i>
        </h1>
        <div className="d-inline-block mt-3" style={{ width: "15rem" }}>
          {/* Enlace al inicio */}
          <Link to="/">
            <img src="assets/img/Logo Iluminatti.jpg" alt="Logo" className="img-thumbnail" />
          </Link>
        </div>
        <h1 className="display-6">Serás redirigido a la página de inicio en 5 segundos.</h1>
      </div>
    </div>
  );
};

export default AccessDenied;
