// components/Navbar.tsx
import React, {FC, useState} from 'react';
import {useAuth0} from '@auth0/auth0-react';
import LoginButton from '../Auth0/LoginButton';
import LogoutButton from '../Auth0/LogoutButton';
import logo from '../Imagenes/Logo Iluminatti.jpg';
import lupa from '../Imagenes/icon - lupa 2.png';

import carrito from '../Imagenes/carrito.png';

const Navbar: FC = () => {
    const {isAuthenticated, user} = useAuth0();
    const [navbarOpen, setNavbarOpen] = useState(false);

    const toggleNavbar = () => {
        setNavbarOpen(!navbarOpen);
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container" style={{display: 'flex', justifyContent: 'space-between'}}>
                <div className="logo" style={{display: 'flex', alignItems: 'center'}}>
                    <img className="logo-iluminatti-1" src={logo} alt="logo"
                         style={{width: '50px', height: '50px', borderRadius: '50%', marginRight: '10px'}}/>
                    <a className="navbar-brand" href="#">El Buen Sabor - Illuminati</a>
                </div>
                <div className="frame-8" style={{display: 'flex'}}>
                    <div className="frame-4">
                        <div className="menu" style={{marginRight: '10px'}}>Menu</div>
                    </div>

                    <div className="frame-5">
                        <div className="contacto" style={{marginRight: '500px'}}>Contacto</div>
                    </div>
                </div>

                <div className="frame-11" style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
                    <div className="lupa">
                        <img className="icon-lupa-2-1" src={lupa} alt="icono de lupa"
                             style={{width: '50px', height: '50px', borderRadius: '50%', marginRight: '10px'}}/>
                    </div>

                    <div className="carrito-de-compra">
                        <img className="descarga-1" src={carrito} alt="icono de carrito de compra"
                             style={{width: '50px', height: '50px', borderRadius: '50%', marginRight: '10px'}}/>
                    </div>
                    <div className="nav-item">
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
                                    {isAuthenticated ? <LogoutButton/> : <LoginButton/>}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

        </nav>
    );
};

export default Navbar;

