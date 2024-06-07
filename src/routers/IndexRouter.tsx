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
import PrivateRoute from "./PrivateRoute";
import AccessDenied from "../components/Page404/AccessDenied";

const IndexRouter = () => {
  return (
    <Routes>
      {/* Rutas para las diferentes páginas */}
      <Route path="/*" element={<UserRouter />} />
      <Route path="/access-denied" element={<AccessDenied />} />

      <Route
        path="/admin"
        element={
          <PrivateRoute allowedRoles={["Admin"]}>
            <Admin />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/ranking-pedidos/:id"
        element={
          <PrivateRoute allowedRoles={["Admin"]}>
            <PedidosID />
          </PrivateRoute>
        }
      />
      <Route
        path="/cocinero"
        element={
          <PrivateRoute allowedRoles={["Cocinero"]}>
            <Cocinero />
          </PrivateRoute>
        }
      />
      <Route
        path="/cajero"
        element={
          <PrivateRoute allowedRoles={["Cajero"]}>
            <Cajero />
          </PrivateRoute>
        }
      />
      <Route
        path="/cajero/pedido/:id"
        element={
          <PrivateRoute allowedRoles={["Cajero"]}>
            <DetallesPedidoCajero />
          </PrivateRoute>
        }
      />
      <Route
        path="/delivery"
        element={
          <PrivateRoute allowedRoles={["Delivery"]}>
            <Delivery />
          </PrivateRoute>
        }
      />
      <Route
        path="/pedido/:id"
        element={
          <PrivateRoute allowedRoles={["Delivery"]}>
            <DetallesPedidoDelivery />
          </PrivateRoute>
        }
      />
      <Route
        path="/cocina/ingredientes"
        element={
          <PrivateRoute allowedRoles={["Admin", "Cocinero", "Cajero", "Delivery"]}>
            <Ingredientes />
          </PrivateRoute>
        }
      />
      <Route
        path="/cocina/productos"
        element={
          <PrivateRoute allowedRoles={["Admin", "Cocinero", "Cajero", "Delivery"]}>
            <Productos />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Page404 />} />
    </Routes>
  );
};

export default IndexRouter;
