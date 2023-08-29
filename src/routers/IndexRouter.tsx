import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserRouter from "./UserRouter";
import Admin from "../screens/Admin";
import Cocinero from "../screens/Cocinero";
import Cajero from "../screens/Cajero";
import Delivery from "../screens/Delivery";
import DetallesPedidoDelivery from "../components/Pedidos/DetallesPedidoDelivery";
import Page404 from "../components/Page404/Page404";
import GenerarFacturaModal from "../components/Factura/GenerarFacturaModal";
import { Pedido } from "../interface/Pedido";
import Productos from "../components/Stock/Producto/Productos";
import Ingredientes from "../components/Stock/Ingrediente/Ingrediente";
import DetallesPedidoCocinero from "../components/CocineroPage/DetallePedidoCocinero";
import DetallesPedidoCajero from "../components/CajeroPage/DetallesPedidoCajero";

const IndexRouter = () => {
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);

  // Función para cerrar el modal de generación de factura
  const closeModal = () => {
    setSelectedPedido(null);
  };
  
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas para las diferentes páginas */}
        <Route path="/*" element={<UserRouter />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/cocinero" element={<Cocinero />} />
        <Route path="/cocinero/pedido/:id" element={<DetallesPedidoCocinero />} />
        <Route path="/cajero" element={<Cajero />} />
        <Route path="/cajero/pedido/:id" element={<DetallesPedidoCajero />} />
        <Route path="/delivery" element={<Delivery />} />
        <Route path="/pedido/:id" element={<DetallesPedidoDelivery />} />
        <Route path="/cocina/ingredientes" element={<Ingredientes />} />
        <Route path="/cocina/productos" element={<Productos />} />

        {/* Ruta para la generación de factura */}
        <Route
          path="/factura/:pedido"
          element={<GenerarFacturaModal closeModal={closeModal} />}
        />

        {/* Ruta para página de error 404 */}
        <Route path="*" element={<Page404 />} />
      </Routes>
    </BrowserRouter>
  );
};

export default IndexRouter;
