import React, { FC, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
import { Cart } from "../CarritoCompras/Cart";
import { FiltersProvider } from '../CarritoCompras/contex/filters'
import { CartProvider } from '../CarritoCompras/contex/cart'

const Navbar: FC = () => {
  const { isAuthenticated, user } = useAuth0();
  const [navbarOpen, setNavbarOpen] = useState(false);

  const toggleNavbar = () => {
    setNavbarOpen(!navbarOpen);
  };

  const getFirstName = (fullName: string) => {
    return fullName.split(" ")[0];
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <div className="d-flex align-items-center">
          <a href="/" className="logo-iluminatti-1 me-2">
            <img
              className="logo-iluminatti-1 me-2"
              src="/assets/img/logo-grupo-illuminati.jpg"
              alt="logo"
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
              }}
            />
          </a>
          <a className="navbar-brand" href="/">
            El Buen Sabor - Illuminati
          </a>
        </div>

        <button className="navbar-toggler" type="button" onClick={toggleNavbar}>
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className={`collapse navbar-collapse justify-content-end ${navbarOpen ? "show" : ""
            }`}
        >
          <ul className="navbar-nav align-items-center">
            <li className="nav-item">
              <i
                className="bi bi-search text-white"
                style={{ fontSize: "2rem", marginRight: "10px" }}
              />
            </li>
            <FiltersProvider>
              <CartProvider>
                <Cart />
              </CartProvider>
            </FiltersProvider>
            {isAuthenticated && (
              <li className="nav-item d-flex align-items-center">
                <p className="nav-link mb-0">
                  {user?.name && getFirstName(user.name)}
                </p>
                <img
                  src={user?.picture}
                  alt="imagen usuario"
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    marginRight: "10px",
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