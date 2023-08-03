import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Pedido } from '../../../interface/Pedido';
import Spinner from '../../Spinner/Spinner';
import { DetallePedido } from '../../../interface/DetallePedido';
import { Producto } from '../../../interface/Producto';

const DetallesPedidoUsuario: React.FC = () => {
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

    if (!pedido) {
        return <Spinner />;
    }

    const { numeroPedido, Usuario, fechaPedido, esEfectivo, esDelivery, totalPedido, DetallePedido } = pedido;

    const goBack = () => {
        window.history.go(-1);
    };

    const renderProductos = (detalle: DetallePedido) => {
        if (!detalle.Productos || !Array.isArray(detalle.Productos) || detalle.Productos.length === 0) {
            return <p>Productos no disponibles</p>;
        }

        return (
            <ul>
                {detalle.Productos.map((producto: Producto) => (
                    <li key={producto.idProducto}>
                        {producto.nombre} - Precio: {producto.precio}
                        {producto.preparacion && <p>Preparación: {producto.preparacion}</p>}
                    </li>
                ))}
            </ul>
        );
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString();
    };

    return (
        <div className="detalle-page-container d-flex align-items-center" style={{ backgroundImage: `url('/assets/img/fondoMisPedidos.jpg') `, minHeight: '100vh' }}>
            <div className="container mt-5">
                <div className="row justify-content-center mt-5 mb-5">
                    <div className="col-12 col-md-8">
                        <div className="card mt-5">
                            <div className="card-header"><h1 className="display-5 text-center">Detalles del Pedido</h1></div>
                            <div className="card-body">
                                <h5 className="card-title">Número de Pedido: {numeroPedido}</h5>
                                <p className="card-text">Nombre y Apellido del Cliente: {Usuario.nombre} {Usuario.apellido}</p>
                                <p className="card-text">Teléfono: {Usuario.telefono}</p>
                                {!esDelivery ? (
                                    <p className="card-text">Dirección de Entrega: {Usuario.Domicilio.calle}, {Usuario.Domicilio.localidad}, {Usuario.Domicilio.numero}</p>
                                ) :
                                    (
                                        <p className="card-text">Dirección de Entrega: {Usuario.Domicilio.calle}, {Usuario.Domicilio.localidad}, {Usuario.Domicilio.numero}</p>
                                    )}
                                <p className="card-text">Fecha: {formatDate(fechaPedido)}</p>
                                <p className="card-text">Método de Pago: {esEfectivo ? 'Efectivo' : 'Mercado Pago'}</p>
                                {!esDelivery ? (
                                    <p className="card-text">Método de Entrega: Retiro en Local</p>
                                ) :
                                    (
                                        <p className="card-text">Método de Entrega: Delivery</p>
                                    )}

                                <h5 className="card-title">Detalle de Ítems Pedidos</h5>
                                <ul>
                                    {DetallePedido.map((detalle: DetallePedido) => (
                                        <li key={detalle.idDetallePedido}>
                                            Cantidad: {detalle.cantidad}
                                            {renderProductos(detalle)}
                                        </li>
                                    ))}
                                </ul>

                                <p className="card-text">Total: {totalPedido}</p>
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
