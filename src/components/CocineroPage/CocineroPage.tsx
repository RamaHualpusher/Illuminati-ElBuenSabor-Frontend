import React, { useState } from "react";
import { Form } from "react-bootstrap";
import IngredientesTable from "../Stock/Ingrediente/IngredientesTable";
import ProductosTable from "../Stock/Producto/ProductosTable";

export default function CocineroPage() {

    const [selectedOption, setSelectedOption] = useState("Null");
    const handleOptionChange = (event: React.MouseEvent<HTMLButtonElement>) => {
        setSelectedOption(event.currentTarget.value);
    };

    return (
        <Form>
            <Form.Group >
                <Form.Label >
                    <div  >
                        <button type="button" className="btn btn-ligth" style={{ color: "black", textDecoration: "none" }} onClick={handleOptionChange} value={"Pedidos"}>
                            <div className="card my-3" style={{ border: "1px solid black" }}>
                                <div className="card-body">
                                    <h5>Pedidos</h5>
                                </div>
                            </div>
                        </button>
                        <button type="button" className="btn btn-ligth" style={{ color: "black", textDecoration: "none" }} onClick={handleOptionChange} value={"Producto"}>
                            <div className="card my-3" style={{ border: "1px solid black" }}>
                                <div className="card-body">
                                    <h5>Productos</h5>
                                </div>
                            </div>
                        </button>
                        <button type="button" className="btn btn-ligth" style={{ color: "black", textDecoration: "none" }} onClick={handleOptionChange} value={"Ingrediente"}>
                            <div className="card my-3" style={{ border: "1px solid black" }}>
                                <div className="card-body">
                                    <h5>Ingredientes</h5>
                                </div>
                            </div>
                        </button>
                    </div>

                </Form.Label>
            </Form.Group>
            <div>
                {selectedOption === 'Producto' && <ProductosTable />}
                {selectedOption === 'Ingrediente' && <IngredientesTable />}
            </div>
        </Form>
    )
}
