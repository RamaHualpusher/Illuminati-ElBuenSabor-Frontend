// App.tsx
import React from 'react';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import Profile from './components/Auth0/Profile';
import { useAuth0 } from '@auth0/auth0-react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Table } from 'react-bootstrap';
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
            <Switch>
                <Route path="/ingredientes">
                    <IngredientesTable url="https://localhost:3306/elbuensabor/ingredientes" />
                    //en teoria deberia funcionar esta url para buscar los datos en la BD y traer todo, segun cada columna asignada
                </Route>
                <Route path="/productos">
                    <ProductosTable url="https://localhost:3306/elbuensabor/productos" />
                    //en teoria deberia funcionar esta url para buscar los datos en la BD y traer todo, segun cada columna asignada
                </Route>
            </Switch>
        </Router>
    </div>

  );
}

export default App;

