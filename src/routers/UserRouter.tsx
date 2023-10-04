import React, { useEffect, useLayoutEffect } from "react";
import NavBar from "../components/NavBar/Navbar";
import Landing from "../components/Landing/Landing";
import { Route, Routes, useLocation } from "react-router-dom";
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

  const location = useLocation();
  // Save scroll position when the user scrolls
  useEffect(() => {
    const saveScrollPosition = () => {
      if (location.pathname === "/") {
        localStorage.setItem(location.pathname, JSON.stringify(window.scrollY.toFixed(1)));
      }
    };

    // Save scroll position when the user scrolls
    window.addEventListener('scroll', saveScrollPosition);

    // Remove the event listener when the component is unmounted
    return () => {
      window.removeEventListener('scroll', saveScrollPosition);
    };
  }, [location.pathname]);

  // Restore scroll position with a delay
  useLayoutEffect(() => {
    const restoreScrollPosition = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      if (location.pathname === "/") {
        const savedPosition = localStorage.getItem(location.pathname);
        window.scrollTo(0, savedPosition ? JSON.parse(savedPosition) : 0);
      } else {
        window.scrollTo(0, 0);
      }
    }
    restoreScrollPosition();
  }, [location.pathname]);


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
