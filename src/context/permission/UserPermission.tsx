import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import jwt_decode from "jwt-decode";
import { useAuth0 } from "@auth0/auth0-react";
import { IUserRole } from "../../interface/IUserRole";

type UserPermission = {
    permission: IUserRole;
    loadUserPermission: () => Promise<void>;
};

interface PermissionsType {
    permissions: string[];
}

const UserPermissionContext = createContext<UserPermission | undefined>(undefined);

export const useUserPermission = () => {
    const context = useContext(UserPermissionContext);
    if (!context) {
        throw new Error('useUserPermission must be used within a UserPermissionProvider');
    }
    return context;
};

export const UserPermissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const [permission, setPermission] = useState<IUserRole>(IUserRole.Cliente);
    const { isAuthenticated, getAccessTokenSilently } = useAuth0();

    const loadUserPermission = useCallback(async () => {
        if (isAuthenticated) {
            try {
                const fetchedToken = await getAccessTokenSilently();

                // Verificar si el token está vacío
                if (!fetchedToken) {
                    console.error('El token JWT está vacío.');
                    return;
                }

                // Verificar la estructura del token (encabezado, cuerpo, firma)
                const tokenParts = fetchedToken.split('.');
                if (tokenParts.length !== 3) {
                    console.log("Token:" + fetchedToken)
                    console.error('El token JWT no tiene la estructura adecuada.');
                    return;
                }

                const decoded = jwt_decode<PermissionsType>(fetchedToken);
                setPermission(IUserRole[decoded.permissions[0] as keyof typeof IUserRole]);
            } catch (error) {
                console.error('Error al obtener y decodificar el token JWT:', error);
            }
        }
    }, [isAuthenticated, getAccessTokenSilently]);


    useEffect(() => {
        loadUserPermission();
    }, [loadUserPermission]);

    const value = useMemo(() => ({ permission, loadUserPermission }), [permission, loadUserPermission]);

    return (
        <UserPermissionContext.Provider value={value}>
            {children}
        </UserPermissionContext.Provider>
    );
};