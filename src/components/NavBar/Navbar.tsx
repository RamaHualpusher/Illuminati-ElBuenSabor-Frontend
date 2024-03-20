import React, { FC, useState, useContext, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Dropdown, ListGroup, Button } from 'react-bootstrap';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';
import { CartContext } from '../../context/cart/CartProvider';
import CartItem from '../CarritoCompras/CartItem';
import { IProducto } from "../../interface/IProducto";
import { SearchContext } from '../Buscador/SearchContext';
import { Link } from 'react-router-dom';

/**
 * Barra de navegación con opciones de autenticación, carrito y búsqueda.
 */

const Navbar: FC = () => {
  const { isAuthenticated, user } = useAuth0(); // Obtener el estado de autenticación de Auth0
  const [navbarOpen, setNavbarOpen] = useState(false); // Estado para controlar la apertura del menú
  const { cartItems, removeFromCart } = useContext(CartContext); // Obtener elementos del carrito y función para eliminar
  const [cartOpen, setCartOpen] = useState(false); // Estado para controlar la apertura del carrito
  const [searchOpen, setSearchOpen] = useState(false); // Estado para controlar la apertura de la búsqueda
  const [produc, setProduc] = useState<IProducto[]>([]); // Estado para almacenar productos
  const [producComplete, setProducComplete] = useState<IProducto[]>([]); // Estado para almacenar productos completos
  const { setSearchParam } = useContext(SearchContext); // Obtener función para establecer parámetros de búsqueda
  const cartVacio = cartItems.length === 0; // Verificar si el carrito está vacío

  //Esta función cambia el estado de navbarOpen entre true y false
  const toggleNavbar = () => {
    setNavbarOpen(!navbarOpen);
  };

  //Esta función toma un nombre completo como argumento y devuelve el primer nombre de la persona
  const getFirstName = (fullName: string) => {
    return fullName.split(' ')[0];
  };
  //Esta función controla si esta abierto el carrito cuando se hace clic en el ícono de carrito.
  const toggleCart = () => {
    setCartOpen(!cartOpen);
  };

  //Esta función controla si el campo de búsqueda está abierto o cerrado cuando se hace clic en el ícono de búsqueda.
  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
  };

  //Hace la solicitud al BackEnd para traer datos del Producto
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

  //Esta función se utiliza para actualizar el parámetro de búsqueda en el contexto de búsqueda. 
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
          <ul className="navbar-nav align-items-center ms-auto">
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
                    {/* aca deberia mostrarse el ROL del usuario  ya que Adminsitrador/Clente/Cocinero/Delivery
                    creo que deberia ser con user?.rol */}
                    {}
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
