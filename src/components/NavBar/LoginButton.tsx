import { useAuth0 } from '@auth0/auth0-react';
import React, { FC } from 'react';

const LoginButton: FC = () => {
  const { loginWithRedirect } = useAuth0();

  return (
      <button
          className="btn btn-primary"
          onClick={() => loginWithRedirect()}
      >
        Iniciar sesión
      </button>
  );
};

export default LoginButton;