import React, { FC } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

/**
 * Botón para iniciar sesión utilizando Auth0.
 */
const LoginButton: FC = () => {
  const { loginWithRedirect } = useAuth0(); // Obtener la función de inicio de sesión de Auth0

  return (
    <button
      className="btn btn-primary"
      onClick={() => loginWithRedirect()} // Al hacer clic, se inicia el proceso de inicio de sesión
    >
      Iniciar sesión
    </button>
  );
};

export default LoginButton;
