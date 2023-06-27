import React, { useState } from "react";
import { BsList, BsX } from "react-icons/bs"; // Importa los iconos de Bootstrap

import Empleado from "../Users/Empleado/Empleado";
import ProductosTable from "../Stock/Producto/ProductosTable";
import IngredientesTable from "../Stock/Ingrediente/IngredientesTable";
import Factura from "../Factura/Factura";
import Cliente from "../Users/Clientes/Clientes";
import RankingClientes from "../RankingClientes/RankingClientes";
import RankingProductos from "../RankingProductos/RankingProductos";

export default function OpcionesAdmin() {
  const [selectedOption, setSelectedOption] = useState("Null");
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
    { name: "Categorías", value: "categorias" },
    { name: "Usuarios", value: "usuarios" },
    { name: "Facturas", value: "facturas" },
  ];

  return (
    <div className="d-flex" style={{marginTop:"3.5rem"}}>
      <button className="btn btn-primary my-2" onClick={handleSidebarToggle}><i className="bi bi-view-list"></i></button>
      {/* Agrega el botón para mostrar/ocultar la barra lateral */}

      {/* Agrega la barra lateral */}
      <div
        className={`flex-grow-0 bg-secondary p-3 ${
          sidebarVisible ? "d-none d-lg-block" : "d-none d-lg-none"
        } position-fixed top-0`}
        style={{ width: "10rem", height: "100vh", overflowY: "auto", marginTop: "4rem" }}
      >
        <button className="btn btn-primary my-1 w-100" onClick={handleSidebarToggle}><i className="bi bi-x-square-fill"></i></button>

        {options.map((option) => (
          <div className="row justify-content-start my-3" key={option.value}>
            <div className="col">
              <button
                value={option.value}
                onClick={handleOptionChange}
                className="btn btn-light btn-lg"
                style={{
                  color: "black",
                  textDecoration: "none",
                  width: "100%",
                  border: "1px solid black",
                }}
              >
                <div className="card-body p-1">
                  <h6 className="card-title mb-0" style={{ color: "black" }}>
                    {option.name}
                  </h6>
                </div>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className={`flex-grow-1 ms-4 ${sidebarVisible ? "d-lg-block" : ""}`}>
        {selectedOption === "employee" && <Empleado />}
        {selectedOption === "productos" && <ProductosTable />}
        {selectedOption === "ingredientes" && <IngredientesTable />}
        {selectedOption === "facturas" && <Factura />}
        {selectedOption === "clientes" && <Cliente />}
        {selectedOption === "rankingClientes" && <RankingClientes />}
        {selectedOption === "rankingProductos" && <RankingProductos />}
      </div>
      
    </div>
  );
}
