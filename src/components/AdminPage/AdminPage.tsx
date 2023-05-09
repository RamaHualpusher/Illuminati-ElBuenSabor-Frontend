import React from "react";
import NavbarEmpleado from "./NavbarEmpleado";
import NavBar from "../NavBar/Navbar";
import OpcionesEmpleados from "./OpcionesEmpleados";

export default function AdminPage(){



    return(
        <div>
            <NavBar/>
            <NavbarEmpleado/>
            <h1 className="display-1">Admin Page</h1>
            <OpcionesEmpleados/>


            



        </div>
    )
}

