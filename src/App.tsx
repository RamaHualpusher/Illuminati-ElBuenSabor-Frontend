import React from 'react';
import './App.css';
import Navbar from './components/Componentes/Navbar';
import ImagenMenu from './components/Componentes/ImagenMenu';

import Profile from './components/Auth0/Profile';
import { useAuth0 } from '@auth0/auth0-react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Rubros from './components/Rubros';

import Body from "../src/components/Componentes/Body";
import IndexRouter from "./routers/IndexRouter";
import Footer from './components/Footer/Footer';

function App(): JSX.Element {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) return <h1>Loading...</h1>;

  return (
    <div className="App">
      <IndexRouter />
      {/* <Router>

        <main className="p-4">

          <h2>El Buen Sabor</h2>
          <Profile />
        </main>
        <Routes>
          <Route path="/" element={<h1>Home</h1>} />
          <Route path="/rubros/*" element={<Rubros />} />
          <Route path="/" element={<Body name="Nombre del producto" image="https://via.placeholder.com/400x300" description="Descripción del producto." price={9.99} />} />
        </Routes>
      </Router> */}
      <Footer/>
    </div>
  );
}

export default App;
