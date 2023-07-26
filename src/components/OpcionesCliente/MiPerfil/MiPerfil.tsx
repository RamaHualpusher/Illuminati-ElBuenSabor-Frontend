import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { EditUsuarioFromCliente } from '../../../interface/Usuario';

const MiPerfil: React.FC = () => {
    const { user, isAuthenticated } = useAuth0();
    const defaultImage = process.env.PUBLIC_URL + "/logo512.png";

    if (!isAuthenticated || !user) {
        return <p>No estás autenticado. Por favor inicia sesión.</p>;
    }

    const idUsuario = user.sub ? parseInt(user.sub) : 0;

    const usuario: EditUsuarioFromCliente = {
        idUsuario: idUsuario,
        nombre: user.given_name || '',
        apellido: user.family_name || '',
        email: user.email || '',
        clave: '',
        telefono: '',
    };

    const handleImageError = (
        e: React.SyntheticEvent<HTMLImageElement, Event>
    ) => {
        e.currentTarget.src = defaultImage;
    };

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <div className="card">
                <div className="card-header">
                    <h1 className='display-6 text-start'> Mi Perfil</h1>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-3 d-flex align-items-start">
                            <img
                                className="rounded-circle"
                                src={user?.picture}
                                alt={user?.name}
                                onError={handleImageError}
                                style={{ width: "100px", height: "100px" }}
                            />
                        </div>
                        <div className="col-9">
                            <p className="card-text">Nombre: {usuario.nombre} {usuario.apellido}</p>
                            <p className="card-text">Email: {usuario.email}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MiPerfil;