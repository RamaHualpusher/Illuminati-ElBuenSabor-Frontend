import React from "react";
import NavBar from "../components/NavBar/Navbar";
import Landing from "../components/Landing/Landing";
import { Route, Routes } from "react-router-dom";
import { Link } from "react-router-dom";
import Footer from "../components/Footer/Footer";

//esto son los botones JAVI!!!!!
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
          <Link to="/cocina/ingredientes" className="btn btn-success my-3">Ingredientes</Link>
          <Link to="/cocina/productos" className="btn btn-success my-3">Productos</Link>
          <Link to="/cocina/rubros/ingredientes" className="btn btn-success my-3">Rubros Ingredientes</Link>
          <Link to="/cocina/rubros/productos" className="btn btn-success my-3">Rubros Productos</Link>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default UserRouter;