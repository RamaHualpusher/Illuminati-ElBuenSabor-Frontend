import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import JSONPretty from 'react-json-pretty';
import 'react-json-pretty/themes/monikai.css';

const Profile: React.FC = (): JSX.Element | null => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) return null;

  return isAuthenticated ? (
    <div>
      <img src={user?.picture} alt="user profile" />
      <h2>{user?.name}</h2>
      <p>{user?.email}</p>
      <JSONPretty data={user} />
    </div>
  ) : null;
};

export default Profile;
