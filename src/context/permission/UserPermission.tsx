import React, {createContext, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import jwt_decode from "jwt-decode";
import {useAuth0} from "@auth0/auth0-react";
import {UserRole} from "../../interface/UserRole";

type UserPermission = {
    permission: UserRole;
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

export const UserPermissionProvider:React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const [permission, setPermission] = useState<UserRole>(UserRole.Cliente);
    const {isAuthenticated ,getAccessTokenSilently} = useAuth0();

    const loadUserPermission = useCallback(async () => {
        if (isAuthenticated){
        const fetchedToken = await getAccessTokenSilently();
        const decoded = jwt_decode<PermissionsType>(fetchedToken);
        setPermission(UserRole[decoded.permissions[0] as keyof typeof UserRole]);
        }
    }, [isAuthenticated,getAccessTokenSilently]);

    useEffect(() => {
        loadUserPermission();
    }, [loadUserPermission]);

    const value = useMemo(() => ({ permission,  loadUserPermission}), [permission, loadUserPermission]);

    return (
        <UserPermissionContext.Provider value={value}>
            {children}
        </UserPermissionContext.Provider>
    );
};