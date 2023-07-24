import React from "react";
import NavBar from "../components/NavBar/Navbar";
import Landing from "../components/Landing/Landing";
import { Route, Routes } from "react-router-dom";
import Footer from "../components/Footer/Footer";
import Direccion from "../components/OpcionesCliente/MiDireccion/MiDireccion";
import DetallePage from "../components/Landing/DetallePage";
import CartItem from "../components/CarritoCompras/CartItem";
import CarritoConConfirmacion from "../components/CarritoCompras/CarritoConConfirmacion";
import Page404 from "../components/Page404/Page404";
import MisPedidos from "../components/OpcionesCliente/MisPedidos/MisPedidos";
import DetallesPedidoUsuario from "../components/OpcionesCliente/MisPedidos/DetallesPedidoUsuario";
import MiPerfil from "../components/OpcionesCliente/MiPerfil/MiPerfil";

const UserRouter = () => {
  return (
    <div>
      <NavBar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/carrito" element={<CartItem />} />
        <Route path="/confirmacion-pedido" element={<CarritoConConfirmacion />} />
        <Route path="/productos/:id" element={<DetallePage />} />
        <Route path="/mi-direccion" element={<Direccion />} />
        <Route path="/mis-pedidos" element={<MisPedidos />} />
        <Route path="/mis-pedido/:id" element={<DetallesPedidoUsuario />} />
        <Route path="/perfil" element={<MiPerfil />} />
        <Route path="*" element={<Page404 />} />
      </Routes>

      {/* <div className="d-flex justify-content-center mb-3">
        <div className="btn-group">
          <Link to="/Admin" className="btn btn-success my-3">Admin</Link>
          <Link to="/Cocinero" className="btn btn-success my-3">Cocinero</Link>
          <Link to="/Cajero" className="btn btn-success my-3">Cajero</Link>
          <Link to="/Delivery" className="btn btn-success my-3">Delivery</Link>
          <Link to="/mercadopago" className="btn btn-success my-3">Mercado Prueba</Link>
        </div>
      </div> */}
      <Footer />
    </div>
  );
};

export default UserRouter;
