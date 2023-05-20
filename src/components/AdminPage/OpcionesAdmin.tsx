import React, { useState } from "react";
import Employee from "../Users/Employees/Employee";
import ProductosTable from "../Stock/Producto/ProductosTable";
import IngredientesTable from "../Stock/Ingrediente/IngredientesTable";
import Bill from "../Bill/Bill";

export default function OpcionesAdmin() {
    //A MEDIDA QUE AGREGUEN NUEVOS OPTIONS CON RUTAS CAMBIEN EL
    //VALOR DEL BOTON (value="employee")
    const [selectedOption, setSelectedOption] = useState("Null");

    const handleOptionChange = (event: React.MouseEvent<HTMLButtonElement>) => {
        setSelectedOption(event.currentTarget.value);
    };

    return (
        <div className="d-flex flex-row bd-highlight mb-3">
            <div className="d-flex flex-column bd-highlight mb-3 bg-secondary p-3"
                style={{ width: "250px", height: "100vh", overflowY: "scroll" }}>

                <div className="row justify-content-start mb-3">
                    <div className="col">
                        <button
                            value="employee"
                            onClick={handleOptionChange}
                            className="btn btn-light btn-lg"
                            style={{ color: "black", textDecoration: "none", width: "100%", border: "1px solid black" }}
                        >
                            <div className="card-body p-1">
                                <h6 className="card-title mb-0" style={{ color: "black" }}>
                                    Empleados
                                </h6>
                            </div>
                        </button>
                    </div>
                </div>

                <div className="row justify-content-start mb-3">
                    <div className="col">
                        <button
                            value="employee"
                            onClick={handleOptionChange}
                            className="btn btn-light btn-lg"
                            style={{ color: "black", textDecoration: "none", width: "100%", border: "1px solid black" }}
                        >
                            <div className="card-body p-1">
                                <h6 className="card-title mb-0" style={{ color: "black" }}>
                                    Clientes
                                </h6>
                            </div>
                        </button>
                    </div>
                </div>


                <div className="row justify-content-start mb-3">
                    <div className="col">
                        <button
                            value="employee"
                            onClick={handleOptionChange}
                            className="btn btn-light btn-lg"
                            style={{ color: "black", textDecoration: "none", width: "100%", border: "1px solid black" }}
                        >
                            <div className="card-body p-1">
                                <h6 className="card-title mb-0" style={{ color: "black" }}>
                                    Ranking Clientes
                                </h6>
                            </div>
                        </button>
                    </div>
                </div>


                <div className="row justify-content-start mb-3">
                    <div className="col">
                        <button
                            value="employee"
                            onClick={handleOptionChange}
                            className="btn btn-light btn-lg"
                            style={{ color: "black", textDecoration: "none", width: "100%", border: "1px solid black" }}
                        >
                            <div className="card-body p-1">
                                <h6 className="card-title mb-0" style={{ color: "black" }}>
                                    Ranking Productos
                                </h6>
                            </div>
                        </button>
                    </div>
                </div>

                <div className="row justify-content-start mb-3">
                    <div className="col">
                        <button
                            value="employee"
                            onClick={handleOptionChange}
                            className="btn btn-light btn-lg"
                            style={{ color: "black", textDecoration: "none", width: "100%", border: "1px solid black" }}
                        >
                            <div className="card-body p-1">
                                <h6 className="card-title mb-0" style={{ color: "black" }}>
                                    Ranking Ventas
                                </h6>
                            </div>
                        </button>
                    </div>
                </div>

                <div className="row justify-content-start mb-3">
                    <div className="col">
                        <button
                            value="productos"
                            onClick={handleOptionChange}
                            className="btn btn-light btn-lg"
                            style={{ color: "black", textDecoration: "none", width: "100%", border: "1px solid black" }}
                        >
                            <div className="card-body p-1">
                                <h6 className="card-title mb-0" style={{ color: "black" }}>
                                    Productos
                                </h6>
                            </div>
                        </button>
                    </div>
                </div>

                <div className="row justify-content-start mb-3">
                    <div className="col">
                        <button
                            value="ingredientes"
                            onClick={handleOptionChange}
                            className="btn btn-light btn-lg"
                            style={{ color: "black", textDecoration: "none", width: "100%", border: "1px solid black" }}
                        >
                            <div className="card-body p-1">
                                <h6 className="card-title mb-0" style={{ color: "black" }}>
                                    Ingredientes
                                </h6>
                            </div>
                        </button>
                    </div>
                </div>

                <div className="row justify-content-start mb-3">
                    <div className="col">
                        <button
                            value="employee"
                            onClick={handleOptionChange}
                            className="btn btn-light btn-lg"
                            style={{ color: "black", textDecoration: "none", width: "100%", border: "1px solid black" }}
                        >
                            <div className="card-body p-1">
                                <h6 className="card-title mb-0" style={{ color: "black" }}>
                                    Categorías
                                </h6>
                            </div>
                        </button>
                    </div>
                </div>

                <div className="row justify-content-start mb-3">
                    <div className="col">
                        <button
                            value="employee"
                            onClick={handleOptionChange}
                            className="btn btn-light btn-lg"
                            style={{ color: "black", textDecoration: "none", width: "100%", border: "1px solid black" }}
                        >
                            <div className="card-body p-1">
                                <h6 className="card-title mb-0" style={{ color: "black" }}>
                                    Usuarios
                                </h6>
                            </div>
                        </button>
                    </div>
                </div>

                <div className="row justify-content-start mb-3">
                    <div className="col">
                        <button
                            value="facturas"
                            onClick={handleOptionChange}
                            className="btn btn-light btn-lg"
                            style={{ color: "black", textDecoration: "none", width: "100%", border: "1px solid black" }}
                        >
                            <div className="card-body p-1">
                                <h6 className="card-title mb-0" style={{ color: "black" }}>
                                    Facturas
                                </h6>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
            
            <div>
                {selectedOption === "employee" && <Employee />}
                {selectedOption === "productos" && <ProductosTable />}
                {selectedOption === "ingredientes" && <IngredientesTable />}
                {selectedOption === "facturas" && <Bill />}
            </div>

        </div>
    )
}
