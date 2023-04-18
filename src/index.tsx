import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Auth0Provider } from '@auth0/auth0-react';

const DOMAIN = process.env.REACT_APP_AUTH0_DOMAIN || '';
const CLIENT_ID = process.env.REACT_APP_AUTH0_CLIENT_ID || '';

const root = document.getElementById('root');

if (root) {
  const app = (
    <React.StrictMode>
      <Auth0Provider
        domain={DOMAIN}
        clientId={CLIENT_ID}
        authorizationParams={{
          redirect_uri: window.location.origin
        }}
      >
        <App />
      </Auth0Provider>
    </React.StrictMode>
  );

  (ReactDOM as any).createRoot(root).render(app);
}

reportWebVitals();
