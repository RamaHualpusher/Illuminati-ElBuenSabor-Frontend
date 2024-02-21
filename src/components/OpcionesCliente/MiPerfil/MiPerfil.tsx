import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useAuth0 } from '@auth0/auth0-react';
import { IEditUsuarioFromCliente, IUsuario } from '../../../interface/IUsuario';
import EditPerfil from './EditPerfil';

const MiPerfil: React.FC = () => {
    const { user, isAuthenticated } = useAuth0();
    const defaultImage = process.env.PUBLIC_URL + "/logo512.png";
    const [selectedCliente, setSelectedCliente] = useState<IUsuario | null>(null);
    const [editModalShow, setEditModalShow] = useState(false);

    const [usuario, setUsuario] = useState<IEditUsuarioFromCliente>({
        id: 0,
        nombre: '',
        apellido: '',
        email: '',
        clave: '',
        telefono: '',
        domicilio:{
            calle:"",
            numero: 0,
            localidad: ""
          }
    });

    useEffect(() => {
        if (user) {
            const idUsuario = user.sub ? parseInt(user.sub) : 0;
            const usuarioData: IEditUsuarioFromCliente = {
                id: idUsuario,
                nombre: user.given_name || '',
                apellido: user.family_name || '',
                email: user.email || '',
                clave: '',
                telefono: '',
                domicilio:{
                    calle:"",
                    numero: 0,
                    localidad: ""
                  }
            };
            setUsuario(usuarioData);
        }
    }, [user]);

    const handleEditModalOpen = () => {
        setEditModalShow(true);
    };

    const handleEditModalClose = () => {
        setEditModalShow(false);
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
                            {/* Mostrar imagen de perfil del usuario */}
                            <img
                                className="rounded-circle"
                                src={user?.picture}
                                alt={user?.name}
                                style={{ width: "100px", height: "100px" }}
                            />
                        </div>
                        <div className="col-9">
                            {/* Mostrar información del usuario */}
                            <p className="card-text">Nombre: {usuario.nombre} {usuario.apellido}</p>
                            <p className="card-text">Email: {usuario.email}</p>
                        </div>
                        <Button variant="primary" onClick={handleEditModalOpen} style={{ marginTop: "20px" }}>
                            Editar datos
                        </Button>
                        <EditPerfil
                            show={editModalShow}
                            handleClose={handleEditModalClose}
                            handleClienteEdit={handleEditModalOpen}
                            selectedCliente={selectedCliente}
                        />
                    </div>
                </div>
            </div>

        </div>
    );
};

export default MiPerfil;
