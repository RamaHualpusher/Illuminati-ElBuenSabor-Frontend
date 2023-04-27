import React from 'react';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import Profile from './components/Auth0/Profile';
import { useAuth0 } from '@auth0/auth0-react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import IngredientesTable from './components/Tablas/RubroIngredientes';
import ProductosTable from './components/Tablas/RubroProducto';

function App(): JSX.Element {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) return <h1>Loading...</h1>;

  return (
    <div className="App">
      <Navbar />
      <main className="p-4">
        <h1>Prueba de login de la App </h1>
        <h2>El Buen Sabor</h2>
        <Profile />
      </main>
      <Router>
        <Routes>
          <Route path="/ingredientes" element={<IngredientesTable url="localhost:8080/api/rubros-ingredientes" />} />
          <Route path="/productos" element={<ProductosTable url="localhost:8080/api/rubros-productos" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
