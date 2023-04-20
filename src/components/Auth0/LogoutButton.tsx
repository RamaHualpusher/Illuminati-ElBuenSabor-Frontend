import { useAuth0 } from '@auth0/auth0-react';
import React, { FC } from 'react';

const LogoutButton: FC = () => {
  const { logout } = useAuth0();

  return (
      <button
          className="rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
          onClick={() =>
              logout({ logoutParams: { returnTo: window.location.origin } })
          }
      >
        Log Out
      </button>
  );
};

export default LogoutButton;
