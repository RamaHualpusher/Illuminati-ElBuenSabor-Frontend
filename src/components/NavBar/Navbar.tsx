import React, { FC, useState, useContext, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Dropdown, DropdownButton, ListGroup } from 'react-bootstrap';
import './Navbar.css';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';
import { CartContext } from '../CarritoCompras/CartProvider';
import CartItem from '../CarritoCompras/CartItem';
import { Producto } from "../../interface/Producto";
import { SearchContext } from '../Buscador/SearchContext';

const Navbar: FC = () => {
  const { isAuthenticated, user } = useAuth0();
  const [navbarOpen, setNavbarOpen] = useState(false);
  const { cartItems, removeFromCart } = useContext(CartContext);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [produc, setProduc] = useState<Producto[]>([]);
  const [producComplete, setProducComplete] = useState<Producto[]>([]);
  const { setSearchParam } = useContext(SearchContext);

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

  const filter = (searchParam: string) => {
    const searchResult = producComplete.filter((productVal: Producto) => {
      if (
        productVal.nombre.toString().toLowerCase().includes(searchParam.toLowerCase()) ||
        productVal.Rubro.toString().toLowerCase().includes(searchParam.toLowerCase())
      ) {
        return productVal;
      }
      return null;
    });
    setProduc(searchResult);
  };

  const handleSearch = (searchParam: string) => {
    //filter(searchParam);
    setSearchParam(searchParam);
  };

  return (
    // fixed top sirve para dejar fijo el navBar
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
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
            {/* {searchOpen && <div className="search-bar-container"><SearchBar onSearch={handleSearch} /></div>} */}
            {searchOpen && (
              <div className="search-container">

                <input type="text" onChange={(e) => handleSearch(e.target.value)} />

              </div>
            )}
            <li className="nav-item">
              <i className="bi bi-search text-white" style={{ fontSize: '2rem', marginRight: '10px', cursor: 'pointer' }} onClick={toggleSearch}></i>
            </li>
            <li className="nav-item">
              <DropdownButton
                title={
                  <>
                    <i className="bi bi-cart text-white" style={{ fontSize: '2rem', marginRight: '10px' }} onClick={toggleCart}></i>
                    {cartItems.length > 0 && <span className="badge bg-danger">{cartItems.length}</span>}
                  </>
                }
                variant="link"
                menuVariant="dark"
                show={cartOpen}
              >
                <div className="container-fluid dropdown-menu-custom">
                  <button
                    className="btn-close close-btn"
                    aria-label="Close"
                    onClick={() => setCartOpen(false)}
                  ></button>
                  <h3 className='p-3'>Carrito de compras El Buen Sabor</h3>
                  {cartOpen && (
                    <>
                      {cartItems.length > 0 ? (
                        <ListGroup className='align-items-center w-100 p-2'>
                          {cartItems.map((item) =>
                            <CartItem key={item.id} item={item} />
                          )}
                        </ListGroup>
                      ) : (
                        <Dropdown.Item disabled>No hay items en el carrito</Dropdown.Item>
                      )}
                      <Dropdown.Item>
                        <button className='btn btn-success w-100 my-2'>Comprar</button>
                      </Dropdown.Item>
                    </>
                  )}
                </div>
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


