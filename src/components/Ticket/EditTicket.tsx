import React, { useEffect, useState } from 'react';
import { Modal, Container, Button } from 'react-bootstrap';
import { IPedidoDto } from '../../interface/IPedido';
import { CartItem } from '../../context/cart/CartProvider'; // Importa la interfaz CartItem
import CartTabla from '../CarritoCompras/CartTabla'; // Importa el componente CartTabla
import axios from 'axios';

interface EditTicketProps {
    pedido: IPedidoDto | null;
    closeModal: () => void;
    show: boolean;
    cartItems: CartItem[];
    modificarCantidad: (id: number, cantidad: number) => void;
    eliminarDetallePedido: (id: number) => void;
}

const EditTicket: React.FC<EditTicketProps> = ({
    pedido,
    closeModal,
    show,
    cartItems,
    modificarCantidad,
    eliminarDetallePedido,
}) => {       
    const [pedidoEdit, setPedidoEdit] = useState<IPedidoDto | null>(null);
    const [itemsPedido, setItemsPedido] = useState<CartItem[]>([]);
    const API_URL = process.env.REACT_APP_API_URL || "";

    const fetchPedido = async () => {
        try {
            const response = await axios.get<IPedidoDto>(`${API_URL}pedido/${pedido?.id}`); // Realiza la solicitud GET al backend
            setPedidoEdit(response.data); // Actualiza el estado con los detalles del pedido
            
           // setItemsPedido(detallesPedido); // Actualiza el estado con los ítems del pedido
        } catch (error) {
            console.error('Error al obtener los detalles del pedido:', error);
        }
    };

    // Efecto para cargar los detalles del pedido cuando el modal se muestra
    useEffect(() => {
        if (show) {
            fetchPedido(); // Llama a la función para obtener los detalles del pedido
        }
    }, [show]);

    const handleSave = async () => {
        try {
            // Implementa aquí la lógica para guardar los cambios del pedido
            await axios.put(`${API_URL}pedido/${pedido?.id}`, pedidoEdit); // Realiza la solicitud PUT al backend para actualizar el pedido
            console.log('Pedido modificado guardado:', pedidoEdit);
            closeModal(); // Cierra el modal después de guardar
        } catch (error) {
            console.error('Error al guardar los cambios del pedido:', error);
        }
    };       

    return (
        <Modal show={show} onHide={closeModal} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Editar Pedido</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container fluid>
                    <CartTabla
                        cartItems={itemsPedido}
                        modificarCantidad={modificarCantidad}
                        eliminarDetallePedido={eliminarDetallePedido} /> {/* Pasa los cartItems al componente CartTabla */}
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={closeModal}>
                    Cerrar
                </Button>
                <Button variant="primary" onClick={handleSave}>
                    Guardar Cambios
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditTicket;
