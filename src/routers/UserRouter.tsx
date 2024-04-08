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
      {/* Barra de navegación */}
      <NavBar />

      {/* Definición de rutas */}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/carrito" element={<CartItem />} />
        <Route path="/confirmacion-pedido" element={<CarritoConConfirmacion />} />
        <Route path="/productos/:id" element={<DetallePage />} />
        <Route path="/mi-direccion" element={<Direccion />} />
        <Route path="/mis-pedidos" element={<MisPedidos />} />
        <Route path="/mis-pedido/:id" element={<DetallesPedidoUsuario />} />
        <Route path="/perfil" element={<MiPerfil />} />

        {/* Ruta para página de error 404 */}
        <Route path="*" element={<Page404 />} />
      </Routes>

      {/* Pie de página */}
      <Footer />
    </div>
  );
};

export default UserRouter;
