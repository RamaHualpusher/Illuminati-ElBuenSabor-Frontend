import React, { FC, useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { IDomicilio } from '../../../interface/IDomicilio';
import EditDireccionModal from './EditDireccionModal';
import AddDireccionModal from './AddDireccionModal';
import { IUsuario } from '../../../interface/IUsuario';
import { useAuth0 } from "@auth0/auth0-react";

const Direccion: FC = () => {
    const [domicilio, setDomicilio] = useState<IDomicilio | null>(null);
    const [editModalShow, setEditModalShow] = useState(false);
    const [addModalShow, setAddModalShow] = useState(false);
    const [selectedDireccion, setSelectedDireccion] = useState<IDomicilio | null>(null);
    const [usuario, setUsuario] = useState<IUsuario>(); // Aquí puedes definir la interfaz para IUsuario si tienes una
    const { user, isAuthenticated, loginWithRedirect } = useAuth0();
    const API_URL = process.env.REACT_APP_API_URL || "";
    const [showAlert, setShowAlert] = useState(false); // Estado para controlar la visibilidad de la alerta

    useEffect(() => {
        const verificarUsuarioExistente = async () => {
            try {
                const response = await axios.get(`${API_URL}usuario`);
                const usuarioDB = response.data;
    
                // Encontrar el usuario correspondiente en la base de datos usando el correo electrónico
                const usuarioEncontrado = usuarioDB.find((usuario: IUsuario) => usuario.email === user?.email);
                if (usuarioEncontrado) {
                    setUsuario(usuarioEncontrado);
    
                    // Obtener el domicilio del usuario
                    const domicilioResponse = await axios.get(`${API_URL}usuario/${usuarioEncontrado.id}/domicilio`);
                    setDomicilio(domicilioResponse.data);
                } else {
                    console.error("No se encontró el usuario en la base de datos.");
                }
            } catch (error) {
                console.error("Error al verificar el usuario existente:", error);
                // Manejar el error aquí según sea necesario, como mostrar un mensaje de error al usuario
            }
        };
    
        verificarUsuarioExistente();
    }, [isAuthenticated, user]);    

    const handleDomicilioEdit = async (domicilio: IDomicilio) => {
        try {
            await axios.put(`${API_URL}usuario/${usuario?.id}/domicilio`, domicilio);
            setDomicilio(domicilio);
            setEditModalShow(false);
        } catch (error) {
            console.log(error);
        }
    };

    const handleDomicilioAdd = async (domicilio: IDomicilio) => {
        try {
            await axios.post(`${API_URL}usuario/${usuario?.id}/domicilio`, domicilio);
            setDomicilio(domicilio);
            setAddModalShow(false);
        } catch (error) {
            console.log(error);
        }
    };

    const handleEditModalOpen = () => {
        setEditModalShow(true);
        setSelectedDireccion(domicilio);
    };

    const handleEditModalClose = () => {
        setEditModalShow(false);
    };

    const handleAddModalOpen = () => {
        setAddModalShow(true);
    };

    const handleAddModalClose = () => {
        setAddModalShow(false);
    };

    const handleLoginRedirect = () => {
        // Redirigir al usuario para iniciar sesión
        loginWithRedirect();
    };

    return (
        <div className="d-flex align-items-center" style={{ backgroundImage: `url('/assets/img/Fondo-UbicacionPerfil.jpg') `, minHeight: '100vh' }}>
            <Container>
                {!isAuthenticated && ( // Mostrar la alerta si el usuario no está autenticado
                    <div className="container mt-3">
                        <Alert variant="danger" show={showAlert}>
                            Por favor, inicie sesión para confirmar el pedido.    <br />
                            <div className="mt-1">
                                <Button variant="primary" onClick={handleLoginRedirect}>
                                    Iniciar Sesión
                                </Button>
                            </div>
                        </Alert>
                    </div>
                )}
                {domicilio && isAuthenticated ? (
                    <div>
                        <div className="card text-center">
                            <div className="card-header">
                                <h1 className="display-5">Mi Dirección</h1>
                            </div>
                            <div className="card-body">
                                <p className="card-text"><strong> Calle: </strong>{domicilio.calle}</p>
                                <p className="card-text"><strong>Número: </strong>{domicilio.numero}</p>
                                <p className="card-text"><strong>Localidad: </strong>{domicilio.localidad}</p>
                            </div>
                            <div className="card-footer text-body-secondary">
                                <Button variant="primary" onClick={handleEditModalOpen}>
                                    Editar
                                </Button>
                            </div>
                        </div>
                        <Link to="/" className="btn btn-primary btn-lg mt-3">
                            Volver
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="card text-center" >
                            <div className="card-header">
                                <h1 className="display-5">Mi Dirección</h1>
                            </div>
                            <div className="card-body">
                                <h5>No se encontró ninguna dirección.</h5>
                            </div>
                            {isAuthenticated && (
                                <Button variant="primary" onClick={handleAddModalOpen}>
                                    Agregar Nueva Dirección
                                </Button>
                            )}
                        </div>
                    </>
                )}
                <AddDireccionModal
                    show={addModalShow}
                    handleClose={handleAddModalClose}
                    handleDireccionAdd={handleDomicilioAdd}
                />
                <EditDireccionModal
                    show={editModalShow}
                    handleClose={handleEditModalClose}
                    handleDireccionEdit={handleDomicilioEdit}
                    selectedDireccion={selectedDireccion}
                />
            </Container>
        </div>
    );
};

export default Direccion;
