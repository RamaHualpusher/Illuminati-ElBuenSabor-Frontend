import React from "react";
import { Link } from "react-router-dom";

export default function OpcionesAdmin() {
    return (
        <div className="d-flex flex-column bd-highlight mb-3 bg-secondary p-3"
            style={{ width: "250px", height: "100vh", overflowY: "scroll" }}>
            <div className="row justify-content-start mb-3">
                <div className="col">
                    <Link
                        to="/admin/employee"
                        className="card-link"
                        style={{ color: "black", textDecoration: "none" }}
                    >
                        <div
                            className="card"
                            style={{ border: "1px solid black", width: "100%" }}
                        >
                            <div className="card-body p-2">
                                <h6 className="card-title mb-0" style={{ color: "black" }}>
                                    Empleados
                                </h6>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>

            <div className="row justify-content-start mb-3">
                <div className="col">
                    <div
                        className="card"
                        style={{ border: "1px solid black", width: "100%" }}
                    >
                        <div className="card-body p-2">
                            <h6 className="card-title mb-0" style={{ color: "black" }}>
                                Clientes
                            </h6>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row justify-content-start mb-3">
                <div className="col">
                    <div
                        className="card"
                        style={{ border: "1px solid black", width: "100%" }}
                    >
                        <div className="card-body p-2">
                            <h6 className="card-title mb-0" style={{ color: "black" }}>
                                Ranking Clientes
                            </h6>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row justify-content-start mb-3">
                <div className="col">
                    <div
                        className="card"
                        style={{ border: "1px solid black", width: "100%" }}
                    >
                        <div className="card-body p-2">
                            <h6 className="card-title mb-0" style={{ color: "black" }}>
                                Ranking Productos
                            </h6>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row justify-content-start mb-3">
                <div className="col">
                    <div
                        className="card"
                        style={{ border: "1px solid black", width: "100%" }}
                    >
                        <div className="card-body p-2">
                            <h6 className="card-title mb-0" style={{ color: "black" }}>
                                Ranking Ventas
                            </h6>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row justify-content-start mb-3">
                <div className="col">
                    <Link
                        to="/cocina/productos"
                        className="card-link"
                        style={{ color: "black", textDecoration: "none" }}
                    >
                        <div
                            className="card"
                            style={{ border: "1px solid black", width: "100%" }}
                        >
                            <div className="card-body p-2">
                                <h6 className="card-title mb-0" style={{ color: "black" }}>
                                    Productos
                                </h6>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>

            <div className="row justify-content-start mb-3">
                <div className="col">
                    <Link to="/cocina/rubros/ingredientes" className="card-link" style={{ color: "black", textDecoration: "none" }}>
                        <div
                            className="card"
                            style={{ border: "1px solid black", width: "100%" }}
                        >
                            <div className="card-body p-2">
                                <h6 className="card-title mb-0" style={{ color: "black" }}>
                                    Ingredientes
                                </h6>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>

            <div className="row justify-content-start mb-3">
                <div className="col">
                    <Link to="/cocina/rubros/ingredientes" className="card-link" style={{ color: "black", textDecoration: "none" }}>
                        <div
                            className="card"
                            style={{ border: "1px solid black", width: "100%" }}
                        >
                            <div className="card-body p-2">
                                <h6 className="card-title mb-0" style={{ color: "black" }}>
                                    Rubro Ingredientes
                                </h6>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>

            <div className="row justify-content-start mb-3">
                <div className="col">
                    <Link to="/cocina/rubros/productos" className="card-link" style={{ color: "black", textDecoration: "none" }}>
                        <div
                            className="card"
                            style={{ border: "1px solid black", width: "100%" }}
                        >
                            <div className="card-body p-2">
                                <h6 className="card-title mb-0" style={{ color: "black" }}>
                                    Rubro Productos
                                </h6>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>

            <div className="row justify-content-start mb-3">
                <div className="col">
                    <div
                        className="card"
                        style={{ border: "1px solid black", width: "100%" }}
                    >
                        <div className="card-body p-2">
                            <h6 className="card-title mb-0" style={{ color: "black" }}>
                                Categorias
                            </h6>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row justify-content-start mb-3">
                <div className="col">
                    <div
                        className="card"
                        style={{ border: "1px solid black", width: "100%" }}
                    >
                        <div className="card-body p-2">
                            <h6 className="card-title mb-0" style={{ color: "black" }}>
                                Usuarios
                            </h6>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row justify-content-start mb-3">
                <div className="col">
                    <Link to="/admin/facturas" className="card-link" style={{ color: "black", textDecoration: "none" }}>
                        <div
                            className="card"
                            style={{ border: "1px solid black", width: "100%" }}
                        >
                            <div className="card-body p-2">
                                <h6 className="card-title mb-0" style={{ color: "black" }}>
                                    Facturas
                                </h6>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>

            <div className="row justify-content-start mb-3">
                <div className="col">
                    <div
                        className="card"
                        style={{ border: "1px solid black", width: "100%" }}
                    >
                        <div className="card-body p-2">
                            <h6 className="card-title mb-0" style={{ color: "black" }}>
                                Stock
                            </h6>
                        </div>
                    </div>
                </div>
            </div>





        </div>
    )
}
