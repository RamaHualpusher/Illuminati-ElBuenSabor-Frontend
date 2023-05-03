import React from 'react';
import './App.css';
import Navbar from './components/Componentes/Navbar';
import BotonesMenu from './components/Componentes/BotonesMenu';
import Profile from './components/Auth0/Profile';
import { useAuth0 } from '@auth0/auth0-react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Rubros from './components/Rubros';
import { Container } from 'react-bootstrap';
import Body from "../src/components/Componentes/Body";

function App(): JSX.Element {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) return <h1>Loading...</h1>;

  return (
    <div className="App">
      <Router>
        <Navbar />
        <BotonesMenu/>
        <main className="p-4">
          <h1>Prueba de login de la App </h1>
          <h2>El Buen Sabor</h2>
          <Profile />
        </main>
        <Routes>
          <Route path="/" element={<h1>Home</h1>} />
          <Route path="/rubros/*" element={<Rubros />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
