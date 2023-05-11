import React, { useState } from "react";
import { Form } from "react-bootstrap";
import IngredientesTable from "../Stock/Ingrediente/IngredientesTable";
import ProductosTable from "../Stock/Producto/ProductosTable";
import RubrosIngredientesTable from "../Stock/RubroIngrediente/RubroIngredientes";
import RubrosProductosTable from "../Stock/RubroProducto/RubroProducto";

export default function CocineroPage() {

    const [selectedOption, setSelectedOption] = useState("Null");



    let elementDisplay = <div>Elija Elemento</div>

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
                        <button type="button" className="btn btn-ligth" style={{ color: "black", textDecoration: "none" }} onClick={handleOptionChange} value={"Rubro Producto"}>
                            <div className="card my-3" style={{ border: "1px solid black" }}>
                                <div className="card-body">
                                    <h5>Rubro Productos</h5>
                                </div>
                            </div>
                        </button>
                        <button type="button" className="btn btn-ligth" style={{ color: "black", textDecoration: "none" }} onClick={handleOptionChange} value={"Rubro Ingrediente"}>
                            <div className="card my-3" style={{ border: "1px solid black" }}>
                                <div className="card-body">
                                    <h5>Rubro Ingredientes</h5>
                                </div>
                            </div>
                        </button>
                    </div>

                </Form.Label>
            </Form.Group>
            <div>
                {selectedOption === 'Pedidos' && <p>Futuramente</p>}
                {selectedOption === 'Producto' && <ProductosTable url="/assets/data/productosEjemplo.json" />}
                {selectedOption === 'Ingrediente' && <IngredientesTable url="/assets/data/ingredientesEjemplo.json" />}
                {selectedOption === 'Rubro Producto' && <RubrosProductosTable url="/assets/data/dataTableRubrosProductos.json" />}
                {selectedOption === 'Rubro Ingrediente' && <RubrosIngredientesTable url="/assets/data/dataTableRubrosIngredientes.json" />}
            </div>
        </Form>
    )
}
