import React, { FC, useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Button } from 'react-bootstrap';
import { Domicilio } from '../../../interface/Domicilio';
import EditDireccionModal from './EditDireccionModal';
import AddDireccionModal from './AddDireccionModal';
import { handleRequest } from '../../FuncionRequest/FuncionRequest';
import { Link } from 'react-router-dom';

const Direccion: FC = () => {
    const [domicilio, setDomicilio] = useState<Domicilio | null>(null);
    const [editModalShow, setEditModalShow] = useState(false);
    const [addModalShow, setAddModalShow] = useState(false);
    const [selectedDireccion, setSelectedDireccion] = useState<Domicilio | null>(null);

    const API_URL = '/assets/data/domicilioCliente.json';

    useEffect(() => {
        const fetchDomicilio = async () => {
            try {
                const response = await axios.get(API_URL);
                setDomicilio(response.data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchDomicilio();
    }, []);

    const handleDomicilioEdit = async (domicilio: Domicilio) => {
        try {
            const updatedDomicilio = await handleRequest('PUT', API_URL, domicilio);
            setDomicilio(updatedDomicilio);
        } catch (error) {
            console.log(error);
        }
    };

    const handleDomicilioAdd = async (domicilio: Domicilio) => {
        try {
            const newDomicilio = await handleRequest('POST', API_URL, domicilio);
            setDomicilio(newDomicilio);
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
        <div className="detalle-page-container d-flex align-items-center" style={{ backgroundImage: `url('/assets/img/Fondo-UbicacionPerfil.jpg') `, minHeight: '100vh' }}>
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
