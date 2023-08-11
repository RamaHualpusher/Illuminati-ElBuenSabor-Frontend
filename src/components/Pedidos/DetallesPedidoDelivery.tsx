import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Pedido } from '../../interface/Pedido';
import Spinner from '../Spinner/Spinner';
import { DetallePedido } from '../../interface/DetallePedido';
import { Producto } from '../../interface/Producto';

const DetallesPedidoDelivery: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [pedido, setPedido] = useState<Pedido>();


    useEffect(() => {
        if (id) {
            fetch('/assets/data/pedidos.json')
                .then((response) => response.json())
                .then((data) => {
                    const pedidoEncontrado = data.find((pedido: Pedido) => pedido.idPedido === parseInt(id));
                    setPedido(pedidoEncontrado);
                })
                .catch((error) => console.error(error));
        }
    }, [id]);

    if (!pedido) {
        return <Spinner />;
    }
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
    const goBack = () => {
        window.history.go(-1);
    };

    const { numeroPedido, Usuario, fechaPedido, esEfectivo, esDelivery, DetallePedido } = pedido;

    const renderProductos = (detalle: DetallePedido) => {
        if (!detalle.Productos || !Array.isArray(detalle.Productos) || detalle.Productos.length === 0) {
            return <p>Productos no disponibles</p>;
        }

        return (
            <ul>
                {detalle.Productos.map((producto: Producto) => (
                    <li key={producto.idProducto}>
                        <strong>{producto.nombre}</strong>: ${producto.precio}
                    </li>
                ))}
            </ul>
        );
    };
    const subtotalPedido = obtenerSubtotal(DetallePedido);
    const totalPedido = esDelivery ? subtotalPedido + 500 : subtotalPedido * 0.9;

    return (
        <div className="detalle-page-container d-flex align-items-center" style={{ backgroundImage: `url('/assets/img/fondoMisPedidos.jpg') `, minHeight: '100vh' }}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-8">
                        <div className="card">
                            <div className="card-header"><h1 className="display-5">Detalles del Pedido</h1></div>
                            <div className="card-body">
                                <h5 className="card-title">Número de Pedido: {pedido.numeroPedido}</h5>
                                <p className="card-text"><strong> Nombre y Apellido del Cliente: </strong>{pedido.Usuario.nombre} {pedido.Usuario.apellido}</p>
                                <p className="card-text"><strong>Teléfono:</strong> {pedido.Usuario.telefono}</p>
                                <p className="card-text"><strong> Dirección de Entrega:</strong> {pedido.Usuario.Domicilio.calle}, {pedido.Usuario.Domicilio.localidad}, {pedido.Usuario.Domicilio.numero}</p>
                                <p className="card-text"><strong>Fecha:</strong> {new Date(pedido.fechaPedido).toLocaleDateString()}</p>
                                <p className="card-text"><strong>Método de Pago:</strong> {pedido.esEfectivo ? 'Efectivo' : 'Mercado Pago'}</p>
                                {!pedido.esDelivery && (
                                    <>
                                        <p className="card-text">Método de Entrega: Delivery</p>
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
                                <h3 className="card-text"><strong> Total:</strong> ${pedido.totalPedido}</h3>
                            </div>
                            <div className="card-footer">
                                <button className="btn btn-primary" onClick={goBack}>
                                    Volver
                                </button>
                            </div>
                        </div>
                    </div>
                </div >
            </div >
        </div >
    );
};

export default DetallesPedidoDelivery;
