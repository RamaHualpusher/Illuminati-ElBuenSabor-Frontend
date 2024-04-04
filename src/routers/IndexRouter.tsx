import React from "react";
import { Route, Routes } from "react-router-dom";
import UserRouter from "./UserRouter";
import Admin from "../screens/Admin";
import Cocinero from "../screens/Cocinero";
import Cajero from "../screens/Cajero";
import Delivery from "../screens/Delivery";
import DetallesPedidoDelivery from "../components/Pedidos/DetallesPedidoDelivery";
import Page404 from "../components/Page404/Page404";
import Productos from "../components/Stock/Producto/Productos";
import Ingredientes from "../components/Stock/Ingrediente/Ingrediente";
import DetallesPedidoCajero from "../components/CajeroPage/DetallesPedidoCajero";
import PedidosID from "../components/Rankings/RankingClientes/PedidosID";

const IndexRouter = () => {

  return (
    <Routes>
      {/* Rutas para las diferentes páginas */}
      <Route path="/*" element={<UserRouter />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/admin/ranking-pedidos/:id" element={<PedidosID />} />
      <Route path="/cocinero" element={<Cocinero />} />
      <Route path="/cajero" element={<Cajero />} />
      <Route path="/cajero/pedido/:id" element={<DetallesPedidoCajero />} />
      <Route path="/delivery" element={<Delivery />} />
      <Route path="/pedido/:id" element={<DetallesPedidoDelivery />} />
      <Route path="/cocina/ingredientes" element={<Ingredientes />} />
      <Route path="/cocina/productos" element={<Productos />} />      
      <Route path="*" element={<Page404 />} />
    </Routes>
  );
};

export default IndexRouter;
