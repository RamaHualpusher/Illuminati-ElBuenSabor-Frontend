import React from 'react';
import './App.css';
import { useAuth0 } from '@auth0/auth0-react';
import IndexRouter from './routers/IndexRouter';
import Spinner from './components/Spinner/Spinner';
import { CartProvider } from './components/CarritoCompras/CartProvider';
import { SearchProvider } from './components/Buscador/SearchContext';

function App(): JSX.Element {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) return <Spinner />;

  return (
    <div className="App">
      <SearchProvider>
        <CartProvider>
          <IndexRouter />
        </CartProvider>
      </SearchProvider>
    </div>
  );
}

export default App;
