import React, { FC, useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { IDomicilio } from '../../../interface/IDomicilio';
import EditDireccionModal from './EditDireccionModal';
import AddDireccionModal from './AddDireccionModal';

const Direccion: FC = () => {
    const [domicilio, setDomicilio] = useState<IDomicilio | null>(null);
    const [editModalShow, setEditModalShow] = useState(false);
    const [addModalShow, setAddModalShow] = useState(false);
    const [selectedDireccion, setSelectedDireccion] = useState<IDomicilio | null>(null);
    const [usuario, setUsuario] = useState<any>(null); // Aquí puedes definir la interfaz para IUsuario si tienes una

    useEffect(() => {
        const fetchUsuario = async () => {
          try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}usuario`);
            // console.log(response);
            setUsuario(response.data);
      
            // Log the user data to check its structure
            console.log('User data:', response.data);
      
            // Fetch the domicilio data after getting the user data
            if (response.data.domicilio) {
              try {
                const domicilioResponse = await axios.get(`${process.env.REACT_APP_API_URL}usuario/${response.data.id}/domicilio`);
                console.log('Domicilio response:', domicilioResponse);
                setDomicilio(domicilioResponse.data);
              } catch (error) {
                console.error('Error fetching domicilio:', error);
              }
            }
          } catch (error) {
            console.error('Error fetching user:', error);
          }
        };
      
        fetchUsuario();
      }, []);

    const handleDomicilioEdit = async (domicilio: IDomicilio) => {
        try {
            await axios.put(`${process.env.REACT_APP_API_URL}usuario/${usuario.id}/domicilio`, domicilio);
            setDomicilio(domicilio);
            setEditModalShow(false);
        } catch (error) {
            console.log(error);
        }
    };

    const handleDomicilioAdd = async (domicilio: IDomicilio) => {
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}usuario/${usuario.id}/domicilio`, domicilio);
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

    return (
        <div className="d-flex align-items-center" style={{ backgroundImage: `url('/assets/img/Fondo-UbicacionPerfil.jpg') `, minHeight: '100vh' }}>
            <Container>
                {domicilio ? (
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
                            <div className="card-footer text-body-secondary">
                                <Button variant="primary" onClick={handleAddModalOpen}>
                                    Agregar dirección
                                </Button>
                            </div>
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
