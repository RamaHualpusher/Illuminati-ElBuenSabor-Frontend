import React, { FC, useState, useContext } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Dropdown, DropdownButton, ListGroup } from 'react-bootstrap';

import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';
import { CartContext } from '../CarritoCompras/CartProvider';
import CartItem from '../CarritoCompras/CartItem';

const Navbar: FC = () => {
  const { isAuthenticated, user } = useAuth0();
  const [navbarOpen, setNavbarOpen] = useState(false);
  const { cartItems, removeFromCart } = useContext(CartContext);
  const [cartOpen, setCartOpen] = useState(false);

  const toggleNavbar = () => {
    setNavbarOpen(!navbarOpen);
  };

  const getFirstName = (fullName: string) => {
    return fullName.split(' ')[0];
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <div className="d-flex align-items-center">
          <img
            className="img-fluid rounded-circle me-2"
            src="/assets/img/logo-grupo-illuminati.jpg"
            alt="logo"
            style={{
              width: '50px',
              height: '50px',
            }}
          />
          <a className="navbar-brand" href="/">El Buen Sabor - Illuminati</a>
        </div>
  
        <button className="navbar-toggler" type="button" onClick={toggleNavbar}>
          <span className="navbar-toggler-icon"></span>
        </button>
  
        <div className={`collapse navbar-collapse justify-content-end ${navbarOpen ? 'show' : ''}`}>
          <ul className="navbar-nav align-items-center">
            <li className="nav-item">
              <i className="bi bi-search text-white" style={{ fontSize: '2rem', marginRight: '10px' }}></i>
            </li>
            <li className="nav-item">
              <DropdownButton
                title={
                  <>
                    <i className="bi bi-cart text-white" style={{ fontSize: '2rem', marginRight: '10px' }}></i>
                    {cartItems.length > 0 && <span className="badge bg-danger">{cartItems.length}</span>}
                  </>
                }
                variant="link"
              >
                {cartItems.length > 0 ? (
                  <ListGroup>
                    {cartItems.map((item) => 
                      <CartItem key={item.id} item={item} />
                    )}
                  </ListGroup>
                ) : (
                  <Dropdown.Item disabled>No hay items en el carrito</Dropdown.Item>
                )}
                <Dropdown.Item>Confirmar compra</Dropdown.Item>
              </DropdownButton>
            </li>
            {isAuthenticated && (
              <li className="nav-item d-flex align-items-center">
                <p className="nav-link mb-0">
                  {user?.name && getFirstName(user.name)}
                </p>
                <img
                  src={user?.picture}
                  alt="imagen usuario"
                  className="img-fluid rounded-circle me-2"
                  style={{
                    width: '50px',
                    height: '50px',
                  }}
                />
              </li>
            )}
            <li className="nav-item">
              {isAuthenticated ? <LogoutButton /> : <LoginButton />}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;