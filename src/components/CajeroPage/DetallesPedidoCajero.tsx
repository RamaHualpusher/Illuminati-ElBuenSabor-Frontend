import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { IPedido } from '../../interface/IPedido';
import Spinner from '../Spinner/Spinner';
import { IDetallePedido } from '../../interface/IDetallePedido';
import { IProducto } from '../../interface/IProducto';
import axios from 'axios';

const DetallesPedidoCajero: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [pedido, setPedido] = useState<IPedido | null>(null);
    const API_URL = process.env.REACT_APP_API_URL || "";

    useEffect(() => {
        const fetchPedido = async () => {
            try {
                if (id) {
                    const pedidosResponse = await axios.get(`${API_URL}pedido`);
                    const data = await pedidosResponse.data;
                    const pedidoEncontrado = data.find((pedido: IPedido) => pedido?.id === parseInt(id));
                    setPedido(pedidoEncontrado || null);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchPedido();
    }, [id]);

    // Renderizar los productos en el detalle de pedido
    const renderProductos = (detalle: IDetallePedido) => {
        if (!detalle?.Productos || !Array.isArray(detalle?.Productos) || detalle?.Productos.length === 0) {
            return <p>Productos no disponibles</p>;
        }

        return (
            <ul>
                {detalle?.Productos.map((producto: IProducto) => (
                    <li key={producto?.id}>
                        <strong>{producto?.nombre}</strong>: ${producto?.precio} - <i className="bi bi-clock-fill"></i> {producto?.tiempoEstimadoCocina}Min
                    </li>
                ))}
            </ul>
        );
    };

    // Formatear la fecha en formato legible
    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString();
    };

    // Calcular el tiempo estimado de finalización del pedido
    const calcularTiempoEstimadoFinalizacion = (detallePedido: IDetallePedido[], esDelivery: boolean) => {
        let maxTiempoEstimadoCocina = 0;
        detallePedido.forEach((detalle: IDetallePedido) => {
            if (detalle?.Productos && Array.isArray(detalle?.Productos) && detalle?.Productos?.length > 0) {
                detalle?.Productos.forEach((producto: IProducto) => {
                    if (producto?.tiempoEstimadoCocina > maxTiempoEstimadoCocina) {
                        maxTiempoEstimadoCocina = producto?.tiempoEstimadoCocina;
                    }
                });
            }
        });
        return maxTiempoEstimadoCocina + (esDelivery ? 10 : 0);
    };

    // Obtener el subtotal del pedido
    const obtenerSubtotal = (detallePedido: IDetallePedido[]) => {
        let subtotal = 0;
        detallePedido.forEach((detalle: IDetallePedido) => {
            if (detalle?.Productos && Array.isArray(detalle?.Productos) && detalle?.Productos?.length > 0) {
                detalle?.Productos.forEach((producto: IProducto) => {
                    subtotal += producto?.precio || 0;
                });
            }
        });
        return subtotal;
    };

    if (!pedido) {
        return <Spinner />;
    }

    const { Usuario, fechaPedido, esEfectivo, esDelivery, DetallePedido } = pedido;

    const goBack = () => {
        window.history.go(-1);
    };

    const subtotalPedido = obtenerSubtotal(DetallePedido);
    const tiempoEstimadoFinalizacion = calcularTiempoEstimadoFinalizacion(DetallePedido, esDelivery);

    // Función para calcular el total del pedido
    const calcularTotalPedido = (detallePedido: IDetallePedido[]) => {
        let total = 0;
        for (let i = 0; i < detallePedido.length; i++) {
            const detalle = detallePedido[i];
            const productos = detalle.Productos;
            // Verificar si Productos es un array
            if (Array.isArray(productos)) {
                for (let j = 0; j < productos.length; j++) {
                    const producto = productos[j];
                    total += producto.precio || 0;
                }
            } else {
                // Si Productos no es un array, asumir que es un solo producto
                total += productos.precio || 0;
            }
        }
        return total;
    };    

    const totalPedido = calcularTotalPedido(DetallePedido);

    return (
        <div className="detalle-page-container d-flex align-items-center justify-content-center" style={{ backgroundImage: `url('/assets/img/fondoMisPedidos.jpg') `, minHeight: '100vh' }}>
            <div className="container">
                <div className="row justify-content-center mt-5">
                    <div className="col-12 col-md-8 mt-5">
                        <div className="card mb-5 mt-3">
                            <div className="card-header text-center"><h1 className="display-5">Detalles del Pedido</h1></div>
                            <div className="card-body text-center">
                                <h5 className="card-title"> Número de Pedido: {id || 0}</h5>
                                <p className="card-text"><strong>Nombre y Apellido del Cliente:</strong> {Usuario?.nombre || ""} {Usuario?.apellido || ""}</p>
                                <p className="card-text"><strong>Teléfono:</strong> {Usuario?.telefono}</p>
                                {!esDelivery ? (
                                    <p className="card-text"><strong>Dirección de Entrega:</strong> {Usuario?.domicilio?.calle || ""}, {Usuario?.domicilio?.localidad || ""}, {Usuario?.domicilio?.numero || 0}</p>
                                ) : (
                                    <p className="card-text"><strong> Dirección de Entrega:</strong> {Usuario?.domicilio?.calle || ""}, {Usuario?.domicilio?.localidad || ""}, {Usuario?.domicilio?.numero || 0}</p>
                                )}
                                <p className="card-text"><strong>Fecha:</strong> {formatDate(fechaPedido)}</p>
                                <p className="card-text"><strong>Método de Pago:</strong> {esEfectivo ? 'Efectivo' : 'Mercado Pago'}</p>
                                {!esDelivery ? (
                                    <p className="card-text"><strong>Método de Entrega:</strong> Retiro en Local</p>
                                ) : (
                                    <>
                                        <p className="card-text"><strong>Método de Entrega:</strong> Delivery</p>
                                        <p className="card-text"><strong>Costo Delivery:</strong> $500</p>
                                    </>
                                )}
                                <h5 className="card-title">Detalle de Ítems Pedidos</h5>
                                {DetallePedido.map((detalle: IDetallePedido) => (
                                    <ul key={detalle.id} className="list-unstyled">
                                        {renderProductos(detalle)}
                                    </ul>
                                ))}
                                <p className="card-text"><strong>Subtotal:</strong> ${subtotalPedido || 0}</p>
                                {!esDelivery && <p className="card-text"><strong>Descuento (10%):</strong> ${subtotalPedido * 0.1}</p>}
                                <p className="card-text"><strong>Tiempo Estimado:</strong> {tiempoEstimadoFinalizacion || 0}Min</p>
                                <h4 className="card-text"><strong>Total:</strong> ${totalPedido}</h4>
                            </div>
                            <div className="card-footer d-flex justify-content-center">
                                <button className="btn btn-primary" onClick={goBack}>
                                    Volver
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetallesPedidoCajero;
