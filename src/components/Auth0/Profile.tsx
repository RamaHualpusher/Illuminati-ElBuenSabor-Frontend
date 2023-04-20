import { useAuth0 } from '@auth0/auth0-react';
import React, { FC } from 'react';

const Profile: FC = () => {
    const { user, isAuthenticated, isLoading } = useAuth0();

    if (isLoading) {
        return <div className="text-center text-xl font-bold">Loading ...</div>;
    }

    return isAuthenticated ? (
        <div className="flex-col text-center">
            <img className="mb-2 inline" src={user?.picture} alt={user?.name} />
            <h2 className="font-bold">{user?.name}</h2>
            <p>{user?.email}</p>
        </div>
    ) : (
        <div className="text-center text-xl font-bold">
            Presiona Log In para ver información de tu perfil.
        </div>
    );
};


export default Profile;
