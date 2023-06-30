import React, { useState } from "react";
import Empleado from "../Users/Empleado/Empleado";
import Productos from "../Stock/Producto/Productos";
import Ingredientes from "../Stock/Ingrediente/Ingrediente";
import Factura from "../Factura/Factura";
import Cliente from "../Users/Clientes/Clientes";
import RankingClientes from "../RankingClientes/RankingClientes";
import RankingProductos from "../RankingProductos/RankingProductos";
import Stock from "../Stock/Stock";

export default function OpcionesAdmin() {
  const [selectedOption, setSelectedOption] = useState("facturas");
  const [sidebarVisible, setSidebarVisible] = useState(true); // Agrega el estado para controlar la visibilidad de la barra lateral

  const handleOptionChange = (event: React.MouseEvent<HTMLButtonElement>) => {
    setSelectedOption(event.currentTarget.value);
  };

  const handleSidebarToggle = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const options = [
    { name: "Empleados", value: "employee" },
    { name: "Clientes", value: "clientes" },
    { name: "Ranking Clientes", value: "rankingClientes" },
    { name: "Ranking Productos", value: "rankingProductos" },
    { name: "Ranking Ventas", value: "rankingVentas" },
    { name: "Productos", value: "productos" },
    { name: "Ingredientes", value: "ingredientes" },
    { name: "Rubros Ingredientes", value: "rubrosIngrediente" },
    { name: "Rubros Productos", value: "rubrosProducto" },
    { name: "Categorías", value: "categorias" },
    { name: "Usuarios", value: "usuarios" },
    { name: "Facturas", value: "facturas" },
    { name: "Stock", value: "stock" },
  ];

  return (
    <div className="d-flex flex-wrap" style={{height:"100vh"}}>
      <div className="flex-shrink-0">
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
            <button
              className="btn btn-outline-danger my-1 w-100 "
              onClick={handleSidebarToggle}
            >
              <i className="bi bi-x-square-fill"></i>
            </button>

            {options.map((option) => (
              <div
                className="row justify-content-start my-3"
                key={option.value}
              >
                <div className="col">
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
        }
        }

      >
        {/* Contenido principal */}
        {selectedOption === "employee" && <Empleado />}
        {selectedOption === "productos" && <Productos />}
        {selectedOption === "ingredientes" && <Ingredientes />}
        {selectedOption === "facturas" && <Factura />}
        {selectedOption === "clientes" && <Cliente />}
        {selectedOption === "rankingClientes" && <RankingClientes />}
        {selectedOption === "rankingProductos" && <RankingProductos />}
        {selectedOption === "stock" && <Stock />}
      </div>
    </div>
  );
}