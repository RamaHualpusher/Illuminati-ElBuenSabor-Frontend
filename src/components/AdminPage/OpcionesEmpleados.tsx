import React from "react";
import { Link } from "react-router-dom";

export default function OpcionesEmpleados(){
    return(
        <div className="d-flex flex-column bd-highligt mb-3">
            <div className="d-flex justify-content-center">
                <div className="btn-group">
                    <button className="btn btn-success my-3">Empleados</button>
                    <button className="btn btn-success my-3">Clientes</button>
                    <button className="btn btn-success my-3">Raking Clientes</button>
                </div>
            </div>
            <div className="d-flex justify-content-center">
                <div className="btn-group">
                    <Link to="/cocina/productos" className="btn btn-success my-3">Productos</Link>
                    <button className="btn btn-success my-3">Ranking Productos</button>
                    <button className="btn btn-success my-3">Raking Ventas</button>
                </div>
            </div>
            <div className="d-flex justify-content-center">
                <div className="btn-group">
                    <Link to="/cocina/ingredientes" className="btn btn-success my-3">Ingredientes</Link>
                    <Link to="/cocina/rubros/ingredientes" className="btn btn-success my-3">Rubros Ingredientes</Link>
                    <Link to="/cocina/rubros/productos" className="btn btn-success my-3">Rubros Productos</Link>
                </div>
            </div>
            <div className="d-flex justify-content-center">
                <div className="btn-group">
                    <button className="btn btn-success my-3">Categorias</button>
                </div>
            </div>
        </div>
    )
}


