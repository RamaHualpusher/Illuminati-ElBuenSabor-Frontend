import React from "react";
import NavBar from "../components/NavBar/Navbar";
import Landing from "../components/Landing/Landing";
import { Route, Routes } from "react-router-dom";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import AdminPage from "../components/AdminPage/AdminPage";

const UserRouter = () => {
  return (
    <div>
      <NavBar />
      <Routes>
        <Route path="/" element={<Landing />} />
      </Routes>
      <div className="d-flex justify-content-center mb-3">
        <div className="btn-group">
          
          <Button  onClick={() =>AdminPage} className="btn btn-success my-3">Pagina Admin</Button>
          <Link to="/cocina/ingredientes" className="btn btn-success my-3">Ingredientes</Link>
          <Link to="/cocina/productos" className="btn btn-success my-3">Productos</Link>
          <Link to="/cocina/rubros/ingredientes" className="btn btn-success my-3">Rubros Ingredientes</Link>
          <Link to="/cocina/rubros/productos" className="btn btn-success my-3">Rubros Productos</Link>
        </div>
      </div>
    </div>
  );
};

export default UserRouter;