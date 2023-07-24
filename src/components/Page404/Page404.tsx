import React from "react";
import { Outlet, Link } from "react-router-dom";

const Page404 = () => {
    return (
        <div className="container mt-5">
            <div className="text-center" style={{ marginTop: "100px", marginBottom: "50px" }}>
                <h1 className="display-4">Página no encontrada</h1>
                <p className="lead">Lo sentimos, la página que estás buscando no existe.</p>
                <h1 className="display-2">
                    <i className="bi bi-emoji-frown"></i>
                </h1>
                <div className="d-inline-block mt-3" style={{ width: "15rem" }}>
                    <Link to="/">
                        <img src="assets/img/Logo Iluminatti.jpg" alt="Logo" className="img-thumbnail" />
                    </Link>
                </div>
                <h1 className="display-6">Haz clic en la imagen para volver.</h1>
            </div>
            <Outlet />
        </div>
    );
};

export default Page404;
