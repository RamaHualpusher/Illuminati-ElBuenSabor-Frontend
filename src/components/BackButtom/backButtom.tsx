import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Componente de botón para retroceder en la navegación
function BackButton() {
  const navigate = useNavigate(); // Hook para navegar entre rutas
  const location = useLocation(); // Hook para obtener la ubicación actual

  // Función para retroceder en la navegación
  const goBack = () => {
    navigate(-1); // Utiliza el hook navigate para retroceder en la navegación
  };

  return (
    <button className="btn btn-primary" onClick={goBack}>
      {/* Icono de flecha hacia atrás */}
      <i className="bi bi-arrow-left"></i>
    </button>
  );
}

export default BackButton;
