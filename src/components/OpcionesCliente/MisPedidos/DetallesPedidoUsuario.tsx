import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Pedido } from '../../../interface/Pedido';
import Spinner from '../../Spinner/Spinner';
import { DetallePedido } from '../../../interface/DetallePedido';

const DetallesPedidoUsuario: React.FC = () => {
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

    const goBack = () => {
        window.history.go(-1);
    };

    const calcularSubtotal = (): number => {
        return pedido.DetallePedido.reduce((total, detalle) => {
            const precioUnitario = detalle.Producto.precio;
            const cantidad = detalle.cantidad;
            return total + precioUnitario * cantidad;
        }, 0);
    };

    const mostrarDescuento = pedido.esDelivery ? false : true;

    return (
        <div className="detalle-page-container d-flex align-items-center" style={{ backgroundImage: `url('/assets/img/fondoMisPedidos.jpg') `, minHeight: '100vh' }}>
            <div className="container mt-5">
                <div className="row justify-content-center mt-5 mb-5">
                    <div className="col-12 col-md-8">
                        <div className="card mt-5">
                            <div className="card-header"><h1 className="display-5 text-center">Detalles del Pedido</h1></div>
                            <div className="card-body">
                                <h5 className="card-title">Número de Pedido: {pedido.numeroPedido}</h5>
                                <p className="card-text">Nombre y Apellido del Cliente: {pedido.Usuario.nombre} {pedido.Usuario.apellido}</p>
                                <p className="card-text">Teléfono: {pedido.Usuario.telefono}</p>
                                {!pedido.esDelivery && (
                                    <p className="card-text">Dirección de Entrega: {pedido.Usuario.Domicilio.calle}, {pedido.Usuario.Domicilio.localidad}, {pedido.Usuario.Domicilio.numero}</p>
                                )}
                                <p className="card-text">Fecha: {new Date(pedido.fechaPedido).toLocaleDateString()}</p>
                                <p className="card-text">Método de Pago: {pedido.esEfectivo ? 'Efectivo' : 'Mercado Pago'}</p>
                                {!pedido.esDelivery && (
                                    <p className="card-text">Método de Entrega: Delivery</p>
                                )}
                                <p className="card-text">Total: {pedido.totalPedido}</p>

                                <h5 className="card-title">Detalle de Ítems Pedidos</h5>
                                <ul>
                                    {pedido.DetallePedido.map((detalle: DetallePedido) => (
                                        <li key={detalle.idDetallePedido}>{detalle.Producto.nombre} - Cantidad: {detalle.cantidad}</li>
                                    ))}
                                </ul>

                                <p className="card-text">Subtotal: {calcularSubtotal()}</p>
                                {mostrarDescuento && <p className="card-text">Descuento: {calcularSubtotal() * 0.1}</p>}
                                <p className="card-text">Total: {pedido.totalPedido}</p>
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
