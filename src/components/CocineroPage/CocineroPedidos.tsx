import React, { useState, useEffect } from 'react';
import { IPedido } from '../../interface/IPedido';
import PedidoList from '../Pedidos/PedidoList';
import axios from 'axios';


/**
 * Componente para que el cocinero administre los pedidos en cocina y cambie su estado a "Listo".
 */
const CocineroPedido: React.FC = () => {
    const [pedidos, setPedidos] = useState<IPedido[]>([]);
    const [pedidoSeleccionado, setPedidoSeleccionado] = useState<IPedido | null>(null);
    const API_URL = process.env.REACT_APP_API_URL || "";

    // Cargar los pedidos desde una fuente de datos al cargar el componente
    useEffect(() => {
        const fetchPedidos = async () => {
            try {
                const response = await axios.get(`${API_URL}pedido/estado/En_cocina`); // Llama al endpoint de pedidos en estado "En Cocina"
                console.log('Response from API:', response); // Log del response de la API
                setPedidos(response.data);
            } catch (error) {
                console.log('Error fetching pedidos:', error); // Log del error al obtener pedidos
            }
        };
    
        fetchPedidos();
    }, []);
    

    const handleConfirmacion = async () => {
        try {
            // Obtener el pedido completo de la base de datos
            const response = await axios.get(`${API_URL}pedido/${pedidoSeleccionado?.id}`);
            console.log('Pedido completo obtenido:', response.data); // Log del pedido obtenido
            const pedidoCompleto = response.data;

            // Actualizar el estado del pedido a "Listo"
            pedidoCompleto.estadoPedido = 'Listo';

            // Enviar la solicitud PATCH o PUT a la API para actualizar el pedido
            const updateResponse = await axios.put(`${API_URL}pedido/${pedidoSeleccionado?.id}`, pedidoCompleto);
            console.log('Response after updating pedido:', updateResponse); // Log de la respuesta después de actualizar el pedido

            // Actualizar el estado local con el pedido modificado
            setPedidoSeleccionado(pedidoCompleto);

            // Mostrar alerta de confirmación después de la actualización
            alert('El estado del pedido se ha cambiado a "Listo".');

        } catch (error) {
            console.log('Error updating pedido:', error); // Log del error al actualizar el pedido
        }
    };

    const cambiarEstadoPedido = (nuevoEstado: string) => {
        if (pedidoSeleccionado && pedidoSeleccionado.estadoPedido === "En cocina" && nuevoEstado === "Listo") {
            const confirmacion = window.confirm('¿Está seguro de que desea cambiar el estado del pedido a "Listo"?');
            if (confirmacion) {
                handleConfirmacion();
            }
        }
    };


    return (
        <div className="container mt-3">
            <PedidoList pedidos={pedidos} cambiarEstadoPedido={cambiarEstadoPedido} />
        </div>
    );
};

export default CocineroPedido;
