import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserRouter from "./UserRouter";
import IngredientesTable from "../components/Stock/Ingrediente/IngredientesTable";
import ProductosTable from "../components/Stock/Producto/ProductosTable";
import CarritoCompras from "../components/CarritoCompras/CarritoCompras";
import Admin from "../screens/Admin";
import Cocinero from "../screens/Cocinero";
import DetalleProducto from "../screens/DetalleProducto";
import Cajero from "../screens/Cajero";
import DetallePage from "../components/Landing/DetallePage";
import Delivery from "../screens/Delivery";
import DetallePedido from "../components/Pedidos/DetallePedido";

const IndexRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserRouter />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/cocinero" element={<Cocinero />} />
        <Route path="/cajero" element={<Cajero />} />
        <Route path="/delivery" element={<Delivery />} />
        <Route path="/pedido/:id" element={<DetallePedido />} />
        <Route path="/carrito" element={<CarritoCompras thumbnail={undefined} price={undefined} title={undefined} quantity={undefined} addToCart={undefined} />} />
        <Route path="/cocina/ingredientes" element={<IngredientesTable />} />
        <Route path="/cocina/productos" element={<ProductosTable />} />
        <Route path="/productos/:id" element={<DetalleProducto />} />
      </Routes>
    </BrowserRouter>
  );
};


export default IndexRouter;