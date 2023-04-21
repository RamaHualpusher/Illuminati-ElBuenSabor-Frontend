// App.tsx
import React from 'react';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import Profile from './components/Auth0/Profile';
import { useAuth0 } from '@auth0/auth0-react';

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
    </div>
  );
}

export default App;

