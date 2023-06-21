import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserRouter from "./UserRouter";
import IngredientesTable from "../components/Stock/Ingrediente/IngredientesTable";
import ProductosTable from "../components/Stock/Producto/ProductosTable";
import CartItem from "../components/CarritoCompras/CartItem";
import Admin from "../screens/Admin";
import Cocinero from "../screens/Cocinero";
import DetalleProducto from "../screens/DetalleProducto";
import Cajero from "../screens/Cajero";
// import DetallePage from "../components/Landing/DetallePage";
import Delivery from "../screens/Delivery";
import DetallesPedido from "../components/Pedidos/DetallesPedido";
//import FacturaPedido from "../components/Pedidos/FacturaPedido";
import GenerarFacturaModal from "../components/Factura/GenerarFacturaModal";
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
        <Route path="/carrito" element={<CartItem/>} />
        <Route path="/cocina/ingredientes" element={<IngredientesTable />} />
        <Route path="/cocina/productos" element={<ProductosTable />} />
        <Route path="/productos/:id" element={<DetalleProducto />} />
        <Route path="/factura/:id" element={<GenerarFacturaModal/>}></Route>
      </Routes>
    </BrowserRouter>
  );
};


export default IndexRouter;