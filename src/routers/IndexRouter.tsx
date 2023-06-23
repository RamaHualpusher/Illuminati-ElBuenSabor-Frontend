import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserRouter from "./UserRouter";
import IngredientesTable from "../components/Stock/Ingrediente/IngredientesTable";
import ProductosTable from "../components/Stock/Producto/ProductosTable";
import CartItem from "../components/CarritoCompras/CartItem";
import Admin from "../screens/Admin";
import Cocinero from "../screens/Cocinero";
import Cajero from "../screens/Cajero";
import Delivery from "../screens/Delivery";
import DetallesPedido from "../components/Pedidos/DetallesPedido";
import GenerarFacturaModal from "../components/Factura/GenerarFacturaModal";
import CarritoConConfirmacion from "../components/CarritoCompras/CarritoConConfirmacion";
import Page404 from "../components/Page404/Page404";
import DetallePage from "../components/Landing/DetallePage";

const IndexRouter = () => {
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
        <Route path="/cocina/ingredientes" element={<IngredientesTable />} />
        <Route path="/cocina/productos" element={<ProductosTable />} />
        <Route path="/productos/:id" element={<DetallePage />} />
        <Route path="/factura/:id" element={<GenerarFacturaModal />}></Route>
        <Route path="/confirmacion-pedido" element={<CarritoConConfirmacion />}></Route>
        <Route path="*" element={<Page404 />} />
      </Routes>
    </BrowserRouter>
  );
};


export default IndexRouter;