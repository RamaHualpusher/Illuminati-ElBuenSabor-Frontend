import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { IDomicilio } from '../../../interface/IDomicilio';
import { IEditDireccionModalProps } from '../../../interface/IDomicilio';

const EditDireccionModal: React.FC<IEditDireccionModalProps> = ({
    show,
    handleClose,
    handleDireccionEdit,
    selectedDireccion,
}) => {
    // Estados para controlar los campos del formulario
    const [calle, setCalle] = useState('');
    const [numero, setNumero] = useState<number>(0);
    const [localidad, setLocalidad] = useState('');

    // Cargar datos de la dirección seleccionada al abrir el modal
    useEffect(() => {
        if (selectedDireccion) {
            setCalle(selectedDireccion.calle);
            setNumero(selectedDireccion.numero);
            setLocalidad(selectedDireccion.localidad);
        }
    }, [selectedDireccion]);

    // useEffect(() => {
    //     if (selectedDireccion) {
    //         setCalle(selectedDireccion.calle);
    //         setNumero(selectedDireccion.numero);
    //         setLocalidad(selectedDireccion.localidad);
    //     }
    // }, [selectedDireccion]);

    // Función para manejar el envío del formulario
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (selectedDireccion) {
            const updatedDomicilio: IDomicilio = {
                ...selectedDireccion,
                id: selectedDireccion.id || 0,
                calle,
                numero,
                localidad,
            };
            // Llama a la función proporcionada para editar la dirección
            handleDireccionEdit(updatedDomicilio);
        }
        handleClose(); // Cierra el modal
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Editar Dirección</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Form.Group controlId="formCalle">
                        <Form.Label>Calle</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Ingrese la calle"
                            value={calle}
                            onChange={(event) => setCalle(event.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formNumero">
                        <Form.Label>Número</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Ingrese el número"
                            value={numero}
                            onChange={(event) => setNumero(parseInt(event.target.value))}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formLocalidad">
                        <Form.Label>Localidad</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Ingrese la localidad"
                            value={localidad}
                            onChange={(event) => setLocalidad(event.target.value)}
                            required
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button variant="primary" type="submit">
                        Guardar Cambios
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default EditDireccionModal;
