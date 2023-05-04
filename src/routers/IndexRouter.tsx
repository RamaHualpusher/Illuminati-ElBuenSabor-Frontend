import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserRouter from "./UserRouter";
import IngredientesTable from "../components/Stock/Ingrediente/IngredientesTable";
// import Admin from "../screens/Admin";
// import Cashier from "../screens/Cashier";
// import Detail from "../screens/Detail";
// import Delivery from "../screens/Delivery"

const IndexRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserRouter />} />
        <Route path="/cocina/ingredientes" element={<IngredientesTable url="/assets/data/ingredientesEjemplo.json" />} />
        {/* <Route path="/admin" element={<Admin />} />
        <Route path="/cashier" element={<Cashier />} />
