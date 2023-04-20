import React from 'react';
import './App.css';
import LoginButton from './components/Auth0/LoginButton';
import Profile from './components/Auth0/Profile';
import LogoutButton from './components/Auth0/LogoutButton';
import { useAuth0 } from '@auth0/auth0-react';

function App(): JSX.Element {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) return <h1>Loading...</h1>;

  return (
    <div className="App">
      <h1>Application</h1>
      {isAuthenticated ? <LogoutButton /> : <LoginButton />}
      <Profile />
    </div>
  );
}

export default App;
