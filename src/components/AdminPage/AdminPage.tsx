import React from "react";
import { Link } from "react-router-dom";

export default function AdminPage() {
    return (
        <div className="d-flex flex-column bd-highligt mb-3 bg-secondary">
            <div className="row justify-content-center">
                <div className="col-md-3">
                    <div className="card my-3" style={{ border: "1px solid black" }}>
                        <div className="card-body">
                            <h5 className="card-title" style={{ color: "black" }}>Empleados</h5>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card my-3" style={{ border: "1px solid black" }}>
                        <div className="card-body">
                            <h5 className="card-title" style={{ color: "black" }}>Clientes</h5>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card my-3" style={{ border: "1px solid black" }}>
                        <div className="card-body">
                            <h5 className="card-title" style={{ color: "black" }}>Ranking Clientes</h5>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row justify-content-center">
                <div className="col-md-3" >
                    <Link to="/cocina/productos" className="card-link" style={{ color: "black", textDecoration: "none" }}>
                        <div className="card my-3" style={{ border: "1px solid black" }}>
                            <div className="card-body">
                                <h5>Productos</h5>
                            </div>
                        </div>
                    </Link>
                </div>
                <div className="col-md-3">
                    <div className="card my-3" style={{ border: "1px solid black" }}>
                        <div className="card-body">
                            <h5 className="card-title" style={{ color: "black" }}>Ranking Productos</h5>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card my-3" style={{ border: "1px solid black" }}>
                        <div className="card-body">
                            <h5 className="card-title" style={{ color: "black" }}>Ranking Ventas</h5>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row justify-content-center">
                <div className="col-md-3">
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
                </div>
            </div>
            <div className="row justify-content-center">
                <div className="col-md-3">
                    <div className="card my-3" style={{ border: "1px solid black" }}>
                        <div className="card-body">
                            <h5 className="card-title" style={{ color: "black" }}>Categorias</h5>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card my-3" style={{ border: "1px solid black" }}>
                        <div className="card-body">
                            <h5 className="card-title" style={{ color: "black" }}>Usuarios</h5>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card my-3" style={{ border: "1px solid black" }}>
                        <div className="card-body">
                            <h5 className="card-title" style={{ color: "black" }}>Facturas</h5>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row justify-content-center">
                <div className="col-md-3">
                    <div className="card my-3" style={{ border: "1px solid black" }}>
                        <div className="card-body">
                            <h5 className="card-title" style={{ color: "black" }}>Stock</h5>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
