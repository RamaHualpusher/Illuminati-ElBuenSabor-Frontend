import { useAuth0 } from '@auth0/auth0-react';
import React, { FC } from 'react';

const LogoutButton: FC = () => {
  const { logout } = useAuth0();

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
