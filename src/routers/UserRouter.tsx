import React from "react";
import NavBar from "../components/NavBar/Navbar";
import Landing from "../components/Landing/Landing";
import { Route, Routes } from "react-router-dom";
import { Link } from "react-router-dom";
import Footer from "../components/Footer/Footer";
import { CartProvider } from "../components/CarritoCompras/CartProvider";

const UserRouter = () => {
  return (
    <div>
      <NavBar />

      <Routes>
        <Route path="/" element={<Landing />} />
      </Routes>
      <div className="d-flex justify-content-center mb-3">
        <div className="btn-group">
          <Link to="/Admin" className="btn btn-success my-3">Admin</Link>
          <Link to="/Cocinero" className="btn btn-success my-3">Cocinero</Link>
          <Link to="/Cajero" className="btn btn-success my-3">Cajero</Link>
          <Link to="/Delivery" className="btn btn-success my-3">Delivery</Link>
          <Link to="/mercadopago" className="btn btn-success my-3">Mercado Prueba</Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserRouter;
