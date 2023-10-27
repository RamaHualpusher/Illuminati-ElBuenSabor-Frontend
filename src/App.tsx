import React from 'react';
import './App.css';
import { useAuth0 } from '@auth0/auth0-react';
import IndexRouter from './routers/IndexRouter';
import Spinner from './components/Spinner/Spinner';
import { CartProvider } from './context/cart/CartProvider';
import { SearchProvider } from './components/Buscador/SearchContext';
import { UserPermissionProvider } from './context/permission/UserPermission';
import { BrowserRouter } from 'react-router-dom';
import ScrollManager from './util/ScrollManager';// Importa el componente ScrollManager

function App(): JSX.Element {
  const { isLoading } = useAuth0();

  if (isLoading) return <Spinner />;

  return (
    <div className="App">
      <UserPermissionProvider>
        <SearchProvider>
          <CartProvider>
            <BrowserRouter>
              <ScrollManager />
              <IndexRouter />
            </BrowserRouter>
          </CartProvider>
        </SearchProvider>
      </UserPermissionProvider>
    </div>
  );
}

export default App;
