import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Pedido } from '../../interface/Pedido';
import Spinner from '../Spinner/Spinner';
import { DetallePedido } from '../../interface/DetallePedido';
import { Producto } from '../../interface/Producto';

const DetallesPedidoCajero: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [pedido, setPedido] = useState<Pedido | null>(null);

    useEffect(() => {
        const fetchPedido = async () => {
            try {
                if (id) {
                    const response = await fetch('/assets/data/pedidos.json');
                    const data = await response.json();
                    const pedidoEncontrado = data.find((pedido: Pedido) => pedido.idPedido === parseInt(id));
                    setPedido(pedidoEncontrado || null);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchPedido();
    }, [id]);

    // Renderizar los productos en el detalle de pedido
    const renderProductos = (detalle: DetallePedido) => {
        if (!detalle.Productos || !Array.isArray(detalle.Productos) || detalle.Productos.length === 0) {
            return <p>Productos no disponibles</p>;
        }

        return (
            <ul>
                {detalle.Productos.map((producto: Producto) => (
                    <li key={producto.idProducto}>
                        <strong>{producto.nombre}</strong>: ${producto.precio} - <i className="bi bi-clock-fill"></i> {producto.tiempoEstimadoCocina}Min
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
    const calcularTiempoEstimadoFinalizacion = (detallePedido: DetallePedido[], esDelivery: boolean) => {
        let maxTiempoEstimadoCocina = 0;
        detallePedido.forEach((detalle: DetallePedido) => {
            if (detalle.Productos && Array.isArray(detalle.Productos) && detalle.Productos.length > 0) {
                detalle.Productos.forEach((producto: Producto) => {
                    if (producto.tiempoEstimadoCocina > maxTiempoEstimadoCocina) {
                        maxTiempoEstimadoCocina = producto.tiempoEstimadoCocina;
                    }
                });
            }
        });
        return maxTiempoEstimadoCocina + (esDelivery ? 10 : 0);
    };

    // Obtener el subtotal del pedido
    const obtenerSubtotal = (detallePedido: DetallePedido[]) => {
        let subtotal = 0;
        detallePedido.forEach((detalle: DetallePedido) => {
            if (detalle.Productos && Array.isArray(detalle.Productos) && detalle.Productos.length > 0) {
                detalle.Productos.forEach((producto: Producto) => {
                    subtotal += producto.precio;
                });
            }
        });
        return subtotal;
    };

    if (!pedido) {
        return <Spinner />;
    }

    const { numeroPedido, Usuario, fechaPedido, esEfectivo, esDelivery, DetallePedido } = pedido;

    const goBack = () => {
        window.history.go(-1);
    };

    const subtotalPedido = obtenerSubtotal(DetallePedido);
    const totalPedido = esDelivery ? subtotalPedido + 500 : subtotalPedido * 0.9;
    const tiempoEstimadoFinalizacion = calcularTiempoEstimadoFinalizacion(DetallePedido, esDelivery);

    return (
        <div className="detalle-page-container d-flex align-items-center justify-content-center" style={{ backgroundImage: `url('/assets/img/fondoMisPedidos.jpg') `, minHeight: '100vh' }}>
            <div className="container">
                <div className="row justify-content-center mt-5">
                    <div className="col-12 col-md-8 mt-5">
                        <div className="card mb-5 mt-3">
                            <div className="card-header text-center"><h1 className="display-5">Detalles del Pedido</h1></div>
                            <div className="card-body text-center">
                                <h5 className="card-title"> Número de Pedido: {numeroPedido}</h5>
                                <p className="card-text"><strong>Nombre y Apellido del Cliente:</strong> {Usuario.nombre} {Usuario.apellido}</p>
                                <p className="card-text"><strong>Teléfono:</strong> {Usuario.telefono}</p>
                                {!esDelivery ? (
                                    <p className="card-text"><strong>Dirección de Entrega:</strong> {Usuario.Domicilio.calle}, {Usuario.Domicilio.localidad}, {Usuario.Domicilio.numero}</p>
                                ) : (
                                    <p className="card-text"><strong> Dirección de Entrega:</strong> {Usuario.Domicilio.calle}, {Usuario.Domicilio.localidad}, {Usuario.Domicilio.numero}</p>
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
                                {DetallePedido.map((detalle: DetallePedido) => (
                                    <ul key={detalle.idDetallePedido} className="list-unstyled">
                                        {renderProductos(detalle)}
                                    </ul>
                                ))}
                                <p className="card-text"><strong>Subtotal:</strong> ${subtotalPedido}</p>
                                {!esDelivery && <p className="card-text"><strong>Descuento (10%):</strong> ${subtotalPedido * 0.1}</p>}
                                <p className="card-text"><strong>Tiempo Estimado:</strong> {tiempoEstimadoFinalizacion}Min</p>
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
