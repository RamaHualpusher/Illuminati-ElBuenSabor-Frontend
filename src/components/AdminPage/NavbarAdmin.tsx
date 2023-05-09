import React, { FC, useState } from "react";

const NavbarAdmin: FC = () => {
    const [navbarOpen, setNavbarOpen] = useState(false);

    const toggleNavbar = () => {
        setNavbarOpen(!navbarOpen);
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <div className="d-flex justify-content-center aling-items-center">
                    <button className="btn btn-primary">
                        Perfil
                    </button>
                    <button className="btn btn-primary">
                        Empleados
                    </button>
                    <button className="btn btn-primary">
                        Usuarios
                    </button>
                    <button className="btn btn-primary">
                        Facturas
                    </button>
                    <button className="btn btn-primary">
                        Stock
                    </button>
                </div>
            </div>
        </nav>
    )
}

export default NavbarAdmin;