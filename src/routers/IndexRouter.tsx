import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserRouter from "./UserRouter";
import IngredientesTable from "../components/Stock/Ingrediente/IngredientesTable";
import ProductosTable from "../components/Stock/Producto/ProductosTable";
import RubrosIngredientesTable from "../components/Stock/RubroIngrediente/RubroIngredientes";
import RubrosProductosTable from "../components/Stock/RubroProducto/RubroProducto";
import ShoppingCart from "../components/ShoppingCart/ShoppingCart";
import Admin from "../screens/Admin";
import Employee from "../components/Users/Employees/Employee";
import Bill from "../components/Bill/Bill";

// import Cashier from "../screens/Cashier";
// import Detail from "../screens/Detail";
// import Delivery from "../screens/Delivery"

const IndexRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserRouter />} />
        <Route path="/admin" element={<Admin/>} />
        <Route path="/admin/facturas" element={<Bill/>} />
        <Route path="/admin/employee" element={<Employee/>} />
        <Route path="/carrito" element={<ShoppingCart/>} />
        <Route path="/cocina/ingredientes" element={<IngredientesTable url="/assets/data/ingredientesEjemplo.json" />} />
        <Route path="/cocina/productos" element={<ProductosTable url="/assets/data/productosEjemplo.json" />} />
        <Route path="/cocina/rubros/ingredientes" element={<RubrosIngredientesTable url="/assets/data/dataTableRubrosIngredientes.json" />} />
        <Route path="/cocina/rubros/productos" element={<RubrosProductosTable url="/assets/data/dataTableRubrosProductos.json" />} />
      </Routes>
    </BrowserRouter>
  );
};


export default IndexRouter;