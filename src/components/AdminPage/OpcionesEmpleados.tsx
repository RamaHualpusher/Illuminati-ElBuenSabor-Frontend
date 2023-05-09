import React from "react";

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
                    <button className="btn btn-success my-3">Productos</button>
                    <button className="btn btn-success my-3">Ranking Productos</button>
                    <button className="btn btn-success my-3">Raking Ventas</button>
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


