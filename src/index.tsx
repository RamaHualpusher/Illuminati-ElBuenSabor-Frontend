import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Auth0Provider } from '@auth0/auth0-react';

const DOMAIN = "el-buen-sabor.us.auth0.com";
const CLIENT_ID = "NTUdpGCO3IIOC0tEJCmr4tXzm4FILbsV";

const root = document.getElementById('root');
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

ReactDOM.render(app, root);


reportWebVitals();
