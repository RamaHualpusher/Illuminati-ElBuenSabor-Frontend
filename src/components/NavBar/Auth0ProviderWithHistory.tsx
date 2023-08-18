import React, { ReactNode } from 'react';
import { Auth0Provider } from '@auth0/auth0-react';

/**
 * Propiedades para el componente Auth0ProviderWithHistory.
 */
interface Auth0ProviderWithHistoryProps {
    children: ReactNode; // Elementos hijos del componente
}

/**
 * Proveedor de autenticación de Auth0 con manejo de historial.
 * @param children Elementos hijos del proveedor de autenticación.
 */
const Auth0ProviderWithHistory = ({ children }: Auth0ProviderWithHistoryProps) => {
    // Obtener los valores de las variables de entorno
    const domain: string = process.env.REACT_APP_AUTH0_DOMAIN as string;
    const clientId: string = process.env.REACT_APP_AUTH0_CLIENT_ID as string;
    const audience: string = process.env.REACT_APP_AUTH0_AUDIENCE as string;

    // Renderizar el componente Auth0Provider con las propiedades necesarias
    return (
        <Auth0Provider
            domain={domain}
            clientId={clientId}
            // Configurar los parámetros de autorización, incluyendo la audiencia y la URL de redirección
            authorizationParams={{
                audience: audience,
                redirect_uri: window.location.origin,
            }}
        >
            {children}
        </Auth0Provider>
    );
};

export default Auth0ProviderWithHistory;
