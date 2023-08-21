import React from "react";

const Spinner: React.FC = () => {
  return (
    // Contenedor que centra el spinner verticalmente en la pantalla
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <div className="text-center">
        {/* Spinner que muestra una animación de carga */}
        <div className="spinner-border" role="status">
          {/* Texto que describe la acción en pantalla para accesibilidad */}
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    </div>
  );
};

export default Spinner;
