import React, { useState } from "react";
import Employee from "../Users/Empleado/Empleado";
import ProductosTable from "../Stock/Producto/ProductosTable";
import IngredientesTable from "../Stock/Ingrediente/IngredientesTable";
import Factura from "../Factura/Factura";
import Cliente from "../Users/Clientes/Clientes";
import RankingClientes from "../RankingClientes/RankingClientes";
import RankingProductos from "../RankingProductos/RankingProductos";

export default function OpcionesAdmin() {
    //A MEDIDA QUE AGREGUEN NUEVOS OPTIONS CON RUTAS CAMBIEN EL
    //VALOR DEL BOTON (value="employee")
    const [selectedOption, setSelectedOption] = useState("Null");

    const handleOptionChange = (event: React.MouseEvent<HTMLButtonElement>) => {
        setSelectedOption(event.currentTarget.value);
    };

    const options = [
        { name: 'Empleados', value: 'employee' },
        { name: 'Clientes', value: 'clientes' },
        { name: 'Ranking Clientes', value: 'rankingClientes' },
        { name: 'Ranking Productos', value: 'rankingProductos' },
        { name: 'Ranking Ventas', value: 'rankingVentas' },
        { name: 'Productos', value: 'productos' },
        { name: 'Ingredientes', value: 'ingredientes' },
        { name: 'Categorías', value: 'categorias' },
        { name: 'Usuarios', value: 'usuarios' },
        { name: 'Facturas', value: 'facturas' },
      ];
      
      return (
        <div className="d-flex flex-row bd-highlight mb-3">
          <div className="d-flex flex-column bd-highlight mb-3 bg-secondary p-3"
            style={{ width: "250px", height: "100vh", overflowY: "scroll" }}>
            {options.map(option => (
              <div className="row justify-content-start mb-3" key={option.value}>
                <div className="col">
                  <button
                    value={option.value}
                    onClick={handleOptionChange}
                    className="btn btn-light btn-lg"
                    style={{ color: "black", textDecoration: "none", width: "100%", border: "1px solid black" }}
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
      
          <div>
            {selectedOption === "employee" && <Employee />}
            {selectedOption === "productos" && <ProductosTable />}
            {selectedOption === "ingredientes" && <IngredientesTable />}
            {selectedOption === "facturas" && <Factura />}
            {selectedOption === "clientes" && <Cliente />}
            {selectedOption === "rankingClientes" && <RankingClientes/>}
            {selectedOption === "rankingProductos" && <RankingProductos/>}
          </div>
      
        </div>
      )
}
