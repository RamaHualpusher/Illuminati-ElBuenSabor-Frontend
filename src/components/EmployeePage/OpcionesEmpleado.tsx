import React from "react";
import { Link } from "react-router-dom";
import EmployeePage from "./EmployeePage";

 function OpcionesEmpleado() {
    return (        
        <div className="d-flex flex-column bd-highligt mb-3 bg-secondary">
            <div className="row justify-content-center">
                <div className="col-md-3">
                    <div className="card my-3" style={{ border: "1px solid black" }}>
                        <div className="card-body">
                            <h5 className="card-title" style={{ color: "black" }}>Lista Empleados</h5>
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
        </div>
    )
    
}
export default OpcionesEmpleado;