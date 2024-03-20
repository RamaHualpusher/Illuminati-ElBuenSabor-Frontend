import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { IPedido } from '../../../interface/IPedido';
import Spinner from '../../Spinner/Spinner';
import { IDetallePedido } from '../../../interface/IDetallePedido';
import { IProducto } from '../../../interface/IProducto';

// Función para calcular el tiempo estimado de finalización
const calcularTiempoEstimadoFinalizacion = (detallePedido: IDetallePedido[], esDelivery: boolean) => {
    const obtenerTiempoEstimadoMaximo = (detallePedido: IDetallePedido[]) => {
        let maxTiempoEstimadoCocina = 0;
        detallePedido.forEach((detalle: IDetallePedido) => {
            if (detalle.producto && Array.isArray(detalle.producto) && detalle.producto.length > 0) {
                detalle.producto.forEach((producto: IProducto) => {
                    if (producto.tiempoEstimadoCocina > maxTiempoEstimadoCocina) {
                        maxTiempoEstimadoCocina = producto.tiempoEstimadoCocina;
                    }
                });
            }
        });
        return maxTiempoEstimadoCocina;
    };

    const tiempoEstimadoMaximo = obtenerTiempoEstimadoMaximo(detallePedido);
    return tiempoEstimadoMaximo + (esDelivery ? 10 : 0);
};

// Función para obtener el subtotal del pedido
const obtenerSubtotal = (detallePedido: IDetallePedido[]) => {
    let subtotal = 0;
    detallePedido.forEach((detalle: IDetallePedido) => {
        if (detalle.producto && Array.isArray(detalle.producto) && detalle.producto.length > 0) {
            detalle.producto.forEach((producto: IProducto) => {
                subtotal += producto.precio;
            });
        }
    });
    return subtotal;
};

const DetallesPedidoUsuario: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [pedido, setPedido] = useState<IPedido | null>(null);

    useEffect(() => {
        const fetchPedido = async () => {
            try {
                if (id) {
                    const response = await fetch('/assets/data/pedidos.json');
                    const data = await response.json();
                    const pedidoEncontrado = data.find((pedido: IPedido) => pedido.id === parseInt(id));
                    setPedido(pedidoEncontrado || null);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchPedido();
    }, [id]);

    if (!pedido) {
        return <Spinner />;
    }

    // Obtener propiedades del pedido
    const { Usuario, fechaPedido, esEfectivo, esDelivery, DetallePedido } = pedido;

    // Función para regresar a la página anterior
    const goBack = () => {
        window.history.go(-1);
    };

    // Función para renderizar los productos del detalleF
    const renderProductos = (detalle: IDetallePedido) => {
        if (!detalle.producto || !Array.isArray(detalle.producto) || detalle.producto.length === 0) {
            return <p>Productos no disponibles</p>;
        }

        return (
            <ul>
                {detalle.producto.map((producto: IProducto) => (
                    <li key={producto.id}>
                        <strong>{producto.nombre}</strong>: ${producto.precio} - <i className="bi bi-clock-fill"></i> {producto.tiempoEstimadoCocina}Min
                        {!producto.esBebida && producto.preparacion && <p> <strong>Preparación:</strong> <br /> {producto.preparacion}</p>}
                    </li>
                ))}
            </ul>
        );
    };

    // Función para formatear la fecha
    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString();
    };

    // Cálculos relacionados con el pedido
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
                                <h5 className="card-title"> Número de Pedido: {id}</h5>
                                <p className="card-text"><strong>Nombre y Apellido del Cliente:</strong> {Usuario.nombre} {Usuario.apellido}</p>
                                <p className="card-text"><strong>Teléfono:</strong> {Usuario.telefono}</p>
                                {!esDelivery ? (
                                    <p className="card-text"><strong>Dirección de Entrega:</strong> {Usuario.domicilio.calle}, {Usuario.domicilio.localidad}, {Usuario.domicilio.numero}</p>
                                ) : (
                                    <p className="card-text"><strong> Dirección de Entrega:</strong> {Usuario.domicilio.calle}, {Usuario.domicilio.localidad}, {Usuario.domicilio.numero}</p>
                                )}
                                <p className="card-text"><strong>Fecha:</strong> {formatDate(fechaPedido)}</p>
                                <p className="card-text"><strong>Método de Pago:</strong> {esEfectivo ? 'Efectivo' : 'Mercado Pago'}</p>
                                {!esDelivery ? (
                                    <p className="card-text"><strong>Método de Entrega:</strong> Retiro en Local</p>
                                ) : (
                                    <p className="card-text"><strong>Método de Entrega:</strong> Delivery</p>
                                )}

                                <h5 className="card-title">Detalle de Ítems Pedidos</h5>

                                {DetallePedido.map((detalle: IDetallePedido) => (
                                    <ul key={detalle.id} className="list-unstyled">
                                        {renderProductos(detalle)}
                                    </ul>
                                ))}

                                <p className="card-text"><strong>Subtotal:</strong> ${subtotalPedido}</p>
                                {!esDelivery && <p className="card-text"><strong>Descuento (10%):</strong> ${subtotalPedido * 0.1}</p>}
                                <p className="card-text"><strong>Total:</strong> ${totalPedido}</p>
                                <p className="card-text"><strong>Tiempo Estimado:</strong> {tiempoEstimadoFinalizacion}Min</p>
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

export default DetallesPedidoUsuario;