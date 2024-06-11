import React, { FC, useState, useContext, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {
  Dropdown,
  ListGroup,
  Button,
  Form,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
import { CartContext } from "../../context/cart/CartProvider";
import CartItem from "../CarritoCompras/CartItem";
import { SearchContext } from "../Buscador/SearchContext";
import { Link, useNavigate } from "react-router-dom";
import CustomDropdown from "./CustomDropdown/CustomDropdown";
import OpcionesUsuario from "./OpcionesUsuario/OpcionesUsuario";
import LogoutButtonEmployee from "./LogoutButtonEmployee";
import LoginButtonEmployee from "./LoginButtonEmployee";
import { useUser } from "../../context/User/UserContext";

const Navbar: FC = () => {
  const { isAuthenticated } = useAuth0(); // Obtener el estado de autenticación de Auth0
  const [navbarOpen, setNavbarOpen] = useState(false); // Estado para controlar la apertura del menú
  const { cartItems, clearCart } = useContext(CartContext); // Obtener elementos del carrito y función para eliminar
  const [cartOpen, setCartOpen] = useState(false); // Estado para controlar la apertura del carrito
  const [searchOpen, setSearchOpen] = useState(false); // Estado para controlar la apertura de la búsqueda
  const { setSearchParam } = useContext(SearchContext); // Obtener función para establecer parámetros de búsqueda
  const cartVacio = cartItems.length === 0; // Verificar si el carrito está vacío
  const { usuarioContext, loading, userExists } = useUser(); // Obtener el contexto del usuario
  const [isEmployee, setIsEmployee] = useState(!!localStorage.getItem("employeeToken"));
  const navigate = useNavigate();

  // Obtener el token del empleado desde el localStorage
  const employeeToken = localStorage.getItem("employeeToken");

  useEffect(() => {
    setIsEmployee(!!employeeToken);
  }, [employeeToken]);

  const toggleNavbar = () => {
    setNavbarOpen(!navbarOpen);
  };

  const getFirstName = (fullName: string) => {
    return fullName.split(" ")[0];
  };

  const toggleCart = () => {
    setCartOpen(!cartOpen);
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
  };

  const handleSearch = (searchParam: string) => {
    setSearchParam(searchParam);
  };

  const handleWorkButtonClick = () => {
    if (usuarioContext) {
      switch (usuarioContext.rol.nombreRol) {
        case "Admin":
          navigate("/admin");
          break;
        case "Cajero":
          navigate("/cajero");
          break;
        case "Cocinero":
          navigate("/cocinero");
          break;
        case "Delivery":
          navigate("/delivery");
          break;
        default:
          break;
      }
    }
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
              width: "50px",
              height: "50px",
            }}
          />
          <Link className="navbar-brand" to="/">
            El Buen Sabor - Illuminati
          </Link>
        </div>

        <button className="navbar-toggler" type="button" onClick={toggleNavbar}>
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className={`collapse navbar-collapse justify-content-end ${
            navbarOpen ? "show" : ""
          }`}
        >
          <ul className="navbar-nav align-items-center ms-auto">
            {searchOpen && (
              <div className="col">
                <input
                  className="form-control me-1 w-100"
                  type="text"
                  style={{ maxWidth: "500px" }}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            )}
            <li className="nav-item">
              <Button
                variant="link"
                className="nav-link"
                onClick={toggleSearch}
              >
                <i
                  className="bi bi-search text-white"
                  style={{
                    fontSize: "2rem",
                    marginRight: "10px",
                    cursor: "pointer",
                  }}
                ></i>
              </Button>
            </li>
            {employeeToken && (
              <li className="nav-item">
                <Button variant="secondary" 
                className="btn btn-secondary px-3 py-2" 
                onClick={handleWorkButtonClick}
                style={{fontSize:"1.2rem", width:"10rem"}}
                >
                  Trabajo
                </Button>
              </li>
            )}
            {!isEmployee && (
              <li className="nav-item">
                <Dropdown show={cartOpen} onToggle={toggleCart}>
                  <Dropdown.Toggle variant="link" id="dropdown-cart">
                    <i
                      className="bi bi-cart text-white"
                      style={{ fontSize: "2rem", marginRight: "10px" }}
                    ></i>
                    {cartItems.length > 0 && (
                      <span className="badge bg-danger">{cartItems.length}</span>
                    )}
                  </Dropdown.Toggle>
                  <Dropdown.Menu
                    className="dropdown-menu-custom bg-light"
                    style={
                      cartItems.length === 0
                        ? { maxHeight: "75vh", width: "250px" }
                        : { maxHeight: "75vh", width: "500px" }
                    }
                  >
                    <button
                      className="btn-close close-btn mx-1"
                      aria-label="Close"
                      onClick={() => setCartOpen(false)}
                    ></button>
                    <h3 className="dropdown-header p-3 ">
                      Carrito de compras El Buen Sabor
                    </h3>
                    {cartOpen && (
                      <div
                        className="overflow-auto mx-2"
                        style={{ maxHeight: "50vh" }}
                      >
                        {cartItems.length > 0 ? (
                          <ListGroup className="list-group-flush">
                            {cartItems.map((item) => (
                              <CartItem key={item.id} item={item} />
                            ))}
                          </ListGroup>
                        ) : (
                          <Dropdown.Item disabled>
                            No hay productos en el carrito
                          </Dropdown.Item>
                        )}
                        {!cartVacio && (
                          <>
                            <Dropdown.Item>
                              <Link
                                to={"/confirmacion-pedido"}
                                className="btn btn-success text-decoration-none w-100 my-2"
                              >
                                Comprar
                              </Link>
                            </Dropdown.Item>
                            <Dropdown.Item>
                              <button
                                className="btn btn-danger text-decoration-none w-100 my-2"
                                onClick={clearCart}
                              >
                                Limpiar carrito
                              </button>
                            </Dropdown.Item>
                          </>
                        )}
                      </div>
                    )}
                  </Dropdown.Menu>
                </Dropdown>
              </li>
            )}
            {isAuthenticated && (
              <li className="nav-item d-flex align-items-center mx-2">
                <Dropdown>
                  <CustomDropdown employeeToken={employeeToken}/>
                  <OpcionesUsuario />
                </Dropdown>
              </li>
            )}
            {employeeToken && (
              <li className="nav-item d-flex align-items-center mx-2">
                <Dropdown>
                  <CustomDropdown employeeToken={employeeToken}/>
                  <OpcionesUsuario />
                </Dropdown>
              </li>
            )}
            <li className="nav-item">
              {isAuthenticated ? <LogoutButton /> : null}
            </li>
            <li className="nav-item">
              {employeeToken ? <LogoutButtonEmployee /> : null}
            </li>
            {!isAuthenticated && !employeeToken && (
              <li className="nav-item d-flex align-items-center mx-2">
                {isEmployee ? <LoginButtonEmployee /> : <LoginButton />}

                <OverlayTrigger
                  placement="bottom"
                  overlay={
                    <Tooltip id="switch-tooltip">
                      {isEmployee
                        ? "Iniciar sesión como Empleado"
                        : "Iniciar sesión como Cliente"}
                    </Tooltip>
                  }
                >
                  <div style={{ width: "30px" }}>
                    <Form.Check
                      type="switch"
                      id="employee-client-switch"
                      label={
                        <span
                          className={`d-inline-block ${
                            isEmployee ? "text-primary" : "text-success"
                          }`}
                          style={{ minWidth: "80px", textAlign: "start" }}
                        >
                          {isEmployee ? "Empleado" : "Cliente"}
                        </span>
                      }
                      className="m-2"
                      checked={isEmployee}
                      onChange={() => setIsEmployee(!isEmployee)}
                      style={{ minWidth: "80px" }}
                    />
                  </div>
                </OverlayTrigger>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
