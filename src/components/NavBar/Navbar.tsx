import React, { FC, useState, useContext, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Dropdown, ListGroup, Button } from 'react-bootstrap';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';
import { CartContext } from '../CarritoCompras/CartProvider';
import CartItem from '../CarritoCompras/CartItem';
import { Producto } from "../../interface/Producto";
import { SearchContext } from '../Buscador/SearchContext';
import { Link } from 'react-router-dom';

const Navbar: FC = () => {
  const { isAuthenticated, user } = useAuth0();
  const [navbarOpen, setNavbarOpen] = useState(false);
  const { cartItems, removeFromCart } = useContext(CartContext);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [produc, setProduc] = useState<Producto[]>([]);
  const [producComplete, setProducComplete] = useState<Producto[]>([]);
  const { setSearchParam } = useContext(SearchContext);
  const cartVacio = cartItems.length === 0;

  const toggleNavbar = () => {
    setNavbarOpen(!navbarOpen);
  };

  const getFirstName = (fullName: string) => {
    return fullName.split(' ')[0];
  };

  const toggleCart = () => {
    setCartOpen(!cartOpen);
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('assets/data/productosLanding.json');
        const data = await response.json();
        setProduc(data);
        setProducComplete(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (searchParam: string) => {
    setSearchParam(searchParam);
  };

  return (
    <nav className="navbar navbar-expand-sm navbar-dark bg-dark fixed-top">
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
          <Link className="navbar-brand" to="/">El Buen Sabor - Illuminati</Link>
        </div>

        <button className="navbar-toggler" type="button" onClick={toggleNavbar}>
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse justify-content-end ${navbarOpen ? 'show' : ''}`}>
          <ul className="navbar-nav align-items-center">
            {searchOpen && (
              <div className="col">
                <input className="form-control me-1 w-100" type="text" style={{ maxWidth: '500px' }} onChange={(e) => handleSearch(e.target.value)} />
              </div>
            )}
            <li className="nav-item">
              <Button variant="link" className="nav-link" onClick={toggleSearch}>
                <i className="bi bi-search text-white" style={{ fontSize: '2rem', marginRight: '10px', cursor: 'pointer' }}></i>
              </Button>
            </li>
            <li className="nav-item">
              <Dropdown show={cartOpen} onToggle={toggleCart}>
                <Dropdown.Toggle variant="link" id="dropdown-cart">
                  <i className="bi bi-cart text-white" style={{ fontSize: '2rem', marginRight: '10px' }}></i>
                  {cartItems.length > 0 && <span className="badge bg-danger">{cartItems.length}</span>}
                </Dropdown.Toggle>
                <Dropdown.Menu className="dropdown-menu-custom bg-light" style={cartItems.length === 0 ?
                  { maxHeight: '75vh', width: '250px' } : { maxHeight: '75vh', width: '390px' }}>
                  <button
                    className="btn-close close-btn mx-1"
                    aria-label="Close"
                    onClick={() => setCartOpen(false)}
                  ></button>
                  <h3 className="dropdown-header p-3 ">Carrito de compras El Buen Sabor</h3>
                  {cartOpen && (
                    <div className="overflow-auto mx-2" style={{ maxHeight: '50vh' }}>
                      {cartItems.length > 0 ? (
                        <ListGroup className="list-group-flush">
                          {cartItems.map((item) =>
                            <CartItem key={item.id} item={item} />
                          )}
                        </ListGroup>
                      ) : (
                        <Dropdown.Item disabled>No hay items en el carrito</Dropdown.Item>
                      )}
                      {!cartVacio && (
                        <Dropdown.Item>
                          <Link to={"/confirmacion-pedido"} className="btn btn-success text-decoration-none w-100 my-2">Comprar</Link>
                        </Dropdown.Item>
                      )}
                    </div>
                  )}
                </Dropdown.Menu>
              </Dropdown>
            </li>
            {isAuthenticated && (
              <li className="nav-item d-flex align-items-center mx-2">
                <Dropdown>
                  <Dropdown.Toggle variant="link" id="dropdown-user" as={Button} className="nav-link">
                    <img
                      src={user?.picture}
                      alt="imagen usuario"
                      className="img-fluid rounded-circle me-2"
                      style={{
                        width: '50px',
                        height: '50px',
                      }}
                    />
                    {user?.name}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item as={Link} to="/mi-direccion">
                      <i className="bi bi-geo-alt me-2"></i>Mi dirección
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/mis-pedidos">
                      <i className="bi bi-journals me-2"></i>Mis pedidos
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/perfil">
                      <i className="bi bi-person-square me-2"></i>Mi perfil
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
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
