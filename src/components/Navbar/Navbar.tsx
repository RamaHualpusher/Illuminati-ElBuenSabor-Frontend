// components/Navbar.tsx
import React, { FC, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import LoginButton from '../Auth0/LoginButton';
import LogoutButton from '../Auth0/LogoutButton';

const Navbar: FC = () => {
    const { isAuthenticated, user } = useAuth0();
    const [navbarOpen, setNavbarOpen] = useState(false);
  
    const toggleNavbar = () => {
      setNavbarOpen(!navbarOpen);
    };
  
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <a className="navbar-brand" href="#">El Buen Sabor - Illuminati</a>
          <button className="navbar-toggler" type="button" onClick={toggleNavbar}>
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className={`collapse navbar-collapse${navbarOpen ? ' show' : ''}`}>
            <ul className="navbar-nav ms-auto">
              {isAuthenticated && (
                <li className="nav-item">
                  <p className="nav-link mb-0">{user?.name}</p>
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

