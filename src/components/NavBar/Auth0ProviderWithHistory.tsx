import React, { ReactNode } from 'react';
import { Auth0Provider } from '@auth0/auth0-react';

interface Auth0ProviderWithHistoryProps {
    children: ReactNode;
}

const Auth0ProviderWithHistory = ({ children }: Auth0ProviderWithHistoryProps) => {
    const domain: string = process.env.REACT_APP_AUTH0_DOMAIN as string;
    const clientId: string = process.env.REACT_APP_AUTH0_CLIENT_ID as string;
    const audience: string = process.env.REACT_APP_AUTH0_AUDIENCE as string;

    return (
        <Auth0Provider
            domain={domain}
            clientId={clientId}
            authorizationParams={{
                audience: audience,
                redirect_uri: window.location.origin,
            }}
        >
            {children}
        </Auth0Provider>
    );
};