import React, { useState } from "react";
import { Link, Route } from "react-router-dom";
import { Form } from "react-bootstrap";
import ProductosTable from "../Stock/Producto/ProductosTable";

export default function CocineroPage() {

    const [selectedOption, setSelectedOption] = useState("Null");

    const [showProductos, setShowProductos] = useState(false);

    let elementDisplay = null;

    const handleOptionChange = (event: React.MouseEvent<HTMLButtonElement>) => {
        setSelectedOption(event.currentTarget.value);
        if (event.currentTarget.value === "concha") {
            elementDisplay = <Route path="/cocina/productos" element={<ProductosTable url="/assets/data/productosEjemplo.json" />} />;
            setShowProductos(true);
        } else {
            setShowProductos(false);
            elementDisplay = null;
        }
    };

    const styleButon = { color: "black", textDecoration: "none" };

    

    /*if (selectedOption === "concha") {
        elementDisplay = <Route path="/cocina/productos" element={<ProductosTable url="/assets/data/productosEjemplo.json" />} />;
        setShowProductos(true);
    } else {
        setShowProductos(false);
        elementDisplay = null;
    }*/


    return (
        <div>
            <div className="d-flex flex-column bd-highligt mb-3 bg-secondary">
                <div className="row justify-content-center">
                    <div className="col-md-3" >
                        {/*<Link to="/cocina/productos" className="card-link" style={{ color: "black", textDecoration: "none" }}>
                        <div className="card my-3" style={{ border: "1px solid black" }}>
                            <div className="card-body">
                                <h5>Productos</h5>
                            </div>
                        </div>
                    </Link>*/}

                        <button className="card-link" style={{ color: "black", textDecoration: "none" }} onClick={handleOptionChange} value={"null"}>
                            <div className="card my-3" style={{ border: "1px solid black" }}>
                                <div className="card-body">
                                    <h5>null</h5>
                                </div>
                            </div>
                        </button>

                        <button className="card-link" style={{ color: "black", textDecoration: "none" }} onClick={handleOptionChange} value={"concha"}>
                            <div className="card my-3" style={{ border: "1px solid black" }}>
                                <div className="card-body">
                                    <h5>Productos</h5>
                                </div>
                            </div>
                        </button>

                    </div>
                    {/*<div className="col-md-3">
                    <Link to="/cocina/ingredientes" className="card-link" style={{ color: "black", textDecoration: "none" }}>
                        <div className="card my-3" style={{ border: "1px solid black" }}>
                            <div className="card-body">
                                <h5>Ingredientes</h5>
                            </div>
                        </div>
                    </Link>
                </div>
                <div className="col-md-3">
                    <Link to="/cocina/rubros/ingredientes" className="card-link" style={{ color: "black", textDecoration: "none" }}>
                        <div className="card my-3" style={{ border: "1px solid black" }}>
                            <div className="card-body">
                                <h5>Rubros Ingredientes</h5>
                            </div>
                        </div>
                    </Link>
                </div>
                <div className="col-md-3">
                    <Link to="/cocina/rubros/productos" className="card-link" style={{ color: "black", textDecoration: "none" }}>
                        <div className="card my-3" style={{ border: "1px solid black" }}>
                            <div className="card-body">
                                <h5>Rubros Productos</h5>
                            </div>
                        </div>
                    </Link>
                </div>*/}
                </div>
            </div>
            <div>{showProductos && elementDisplay}</div>
        </div>
    )
}
