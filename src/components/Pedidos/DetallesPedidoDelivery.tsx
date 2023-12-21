import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Spinner from '../Spinner/Spinner';
import { IDetallePedido } from '../../interface/IDetallePedido';
import { IPedido } from '../../interface/IPedido';
import { IProducto } from '../../interface/IProducto';

const DetallesPedidoDelivery: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [pedido, setPedido] = useState<IPedido | undefined>();

    useEffect(() => {
        if (id) {
            // Realiza una solicitud para obtener los detalles del pedido
            fetch('/assets/data/pedidos.json')
                .then((response) => response.json())
                .then((data) => {
                    const pedidoEncontrado = data.find((pedido: IPedido) => pedido.id === parseInt(id));
                    setPedido(pedidoEncontrado);
                })
                .catch((error) => console.error(error));
        }
    }, [id]);

    if (!pedido) {
        return <Spinner />; // Muestra el spinner mientras se carga el pedido
    }

    const obtenerSubtotal = (detallePedido: IDetallePedido[]) => {
        let subtotal = 0;
        detallePedido.forEach((detalle: IDetallePedido) => {
            if (detalle.Productos && Array.isArray(detalle.Productos) && detalle.Productos.length > 0) {
                detalle.Productos.forEach((producto: IProducto) => {
                    subtotal += producto.precio;
                });
            }
        });
        return subtotal;
    };

    const renderProductos = (detalle: IDetallePedido) => { //Renderiza todos los productos que hay en el pedido
        if (!detalle.Productos || !Array.isArray(detalle.Productos) || detalle.Productos.length === 0) { //Si no encuentra muestra un mensaje
            return <p>Productos no disponibles</p>;
        }

        return (
            <ul>
                {detalle.Productos.map((producto: IProducto) => (
                    <li key={producto.id}>
                        <strong>{producto.nombre}</strong>: ${producto.precio}
                    </li>
                ))}
            </ul>
        );
    };

    const goBack = () => {
        window.history.go(-1); // Navega hacia atrás en la historia del navegador
    };

    const { numeroPedido, Usuario, fechaPedido, esEfectivo, esDelivery, DetallePedido, totalPedido } = pedido;

    const subtotalPedido = obtenerSubtotal(DetallePedido);

    return (
        <div className="detalle-page-container d-flex align-items-center" style={{ backgroundImage: `url('/assets/img/fondoMisPedidos.jpg') `, minHeight: '100vh' }}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-8">
                        <div className="card">
                            <div className="card-header"><h1 className="display-5">Detalles del Pedido</h1></div>
                            <div className="card-body">
                                <h5 className="card-title">Número de Pedido: {numeroPedido}</h5>
                                <p className="card-text"><strong>Nombre y Apellido del Cliente:</strong> {Usuario.nombre} {Usuario.apellido}</p>
                                <p className="card-text"><strong>Teléfono:</strong> {Usuario.telefono}</p>
                                <p className="card-text"><strong>Dirección de Entrega:</strong> {Usuario.domicilio.calle}, {Usuario.domicilio.localidad}, {Usuario.domicilio.numero}</p>
                                <p className="card-text"><strong>Fecha:</strong> {new Date(fechaPedido).toLocaleDateString()}</p>
                                <p className="card-text"><strong>Método de Pago:</strong> {esEfectivo ? 'Efectivo' : 'Mercado Pago'}</p>
                                {esDelivery && (
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
                                {esDelivery && (
                                    <p className="card-text"><strong>Costo Delivery:</strong> $500</p>
                                )}
                                <h3 className="card-text"><strong>Total:</strong> ${totalPedido}</h3>
                            </div>
                            <div className="card-footer">
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

export default DetallesPedidoDelivery;
