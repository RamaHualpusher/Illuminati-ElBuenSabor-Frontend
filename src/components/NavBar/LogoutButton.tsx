import React, { FC } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

/**
 * Botón para cerrar sesión utilizando Auth0.
 */
const LogoutButton: FC = () => {
  const { logout } = useAuth0(); // Obtener la función de cierre de sesión de Auth0

  return (
    <button
      className="btn btn-primary"
      onClick={() =>
        logout({ logoutParams: { returnTo: window.location.origin } })
      }
    >
      Cerrar sesión
    </button>
  );
};

export default LogoutButton;
