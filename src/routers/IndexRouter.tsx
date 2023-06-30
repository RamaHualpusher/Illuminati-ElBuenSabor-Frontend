import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserRouter from "./UserRouter";
import CartItem from "../components/CarritoCompras/CartItem";
import Admin from "../screens/Admin";
import Cocinero from "../screens/Cocinero";
import Cajero from "../screens/Cajero";
import Delivery from "../screens/Delivery";
import DetallesPedido from "../components/Pedidos/DetallesPedido";
import CarritoConConfirmacion from "../components/CarritoCompras/CarritoConConfirmacion";
import Page404 from "../components/Page404/Page404";
import DetallePage from "../components/Landing/DetallePage";
import GenerarFacturaModal from "../components/Factura/GenerarFacturaModal";
import { Pedido } from "../interface/Pedido";
import Productos from "../components/Stock/Producto/Productos";
import Ingredientes from "../components/Stock/Ingrediente/Ingrediente";

const IndexRouter = () => {
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);
  const closeModal = () => {
    setSelectedPedido(null);
  };
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserRouter />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/cocinero" element={<Cocinero />} />
        <Route path="/cajero" element={<Cajero />} />
        <Route path="/delivery" element={<Delivery />} />
        <Route path="/pedido/:id" element={<DetallesPedido />} />
        <Route path="/carrito" element={<CartItem />} />
        <Route path="/cocina/ingredientes" element={<Ingredientes />} />
        <Route path="/cocina/productos" element={<Productos />} />
        <Route path="/productos/:id" element={<DetallePage />} />        
        <Route
          path="/factura/:pedido"
          element={<GenerarFacturaModal closeModal={closeModal} />}
        />
        <Route path="/confirmacion-pedido" element={<CarritoConConfirmacion />}></Route>
        <Route path="*" element={<Page404 />} />
      </Routes>
    </BrowserRouter>
  );
};


export default IndexRouter;