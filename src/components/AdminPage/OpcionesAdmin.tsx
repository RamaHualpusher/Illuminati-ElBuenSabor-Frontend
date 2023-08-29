import React, { useState } from "react";
import Factura from "../Factura/Factura";
import Usuarios from "../Users/Usuarios/Usuarios";
import Rankings from "../Rankings/Rankings";
import Stock from "../Stock/Stock/Stock";

export default function OpcionesAdmin() {
  // Estado para controlar la opción seleccionada
  const [selectedOption, setSelectedOption] = useState("usuarios");
  // Estado para controlar la visibilidad de la barra lateral
  const [sidebarVisible, setSidebarVisible] = useState(true);

  // Función para cambiar la opción seleccionada
  const handleOptionChange = (event: React.MouseEvent<HTMLButtonElement>) => {
    setSelectedOption(event.currentTarget.value);
  };

  // Función para alternar la visibilidad de la barra lateral
  const handleSidebarToggle = () => {
    setSidebarVisible(!sidebarVisible);
  };

  // Opciones disponibles en la barra lateral
  const options = [
    { name: "Usuarios", value: "usuarios" },
    { name: "Stock", value: "stock" },
    { name: "Facturas", value: "facturas" },
    { name: "Rankings", value: "rankings" },
  ];

  return (
    <div className="d-flex flex-wrap" style={{ height: "100vh" }}>
      <div className="flex-shrink-0">
        {/* Botón para alternar la visibilidad de la barra lateral */}
        {!sidebarVisible ? (
          <button
            className="btn btn-dark position-fixed"
            style={{
              borderRadius: "0px",
              height: "100%",
              width: "3rem",
            }}
            onClick={handleSidebarToggle}
          >
            <i className="bi bi-view-list text-info h4"></i>
          </button>
        ) : (
          <div
            className="bg-dark p-3 position-fixed"
            style={{
              width: "10rem",
              height: "100vh",
              overflowY: "auto",
              marginTop: "4rem",
            }}
          >
            {/* Botón para cerrar la barra lateral */}
            <button
              className="btn btn-outline-danger my-1 w-100 "
              onClick={handleSidebarToggle}
            >
              <i className="bi bi-x-square-fill"></i>
            </button>

            {/* Renderizar las opciones de la barra lateral */}
            {options.map((option) => (
              <div
                className="row justify-content-start my-3"
                key={option.value}
              >
                <div className="col">
                  {/* Botón para seleccionar una opción */}
                  <button
                    value={option.value}
                    onClick={handleOptionChange}
                    className={`btn btn-outline-info w-100 text-center ${selectedOption === option.value ? "active p-3" : ""
                      }`}
                  >
                    {option.name}
                  </button>
                </div>
              </div>
            ))}
            <div style={{
              marginTop: "5rem",
            }}>
              <br />
            </div>
          </div>
        )}
      </div>

      <div
        className={`flex-grow-1`}
        style={{
          transition: "all 0.3s ease",
          marginTop: "5rem",
          overflowY: "auto",
          marginLeft: sidebarVisible ? "10rem" : "3rem",
        }}
      >
        {/* Contenido principal */}
        {selectedOption === "usuarios" && <Usuarios />}
        {selectedOption === "stock" && <Stock />}
        {selectedOption === "facturas" && <Factura />}
        {selectedOption === "rankings" && <Rankings />}
      </div>
    </div>
  );
}
