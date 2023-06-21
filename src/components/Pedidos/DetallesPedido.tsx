import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Pedido } from '../../interface/Pedido';
import Spinner from '../Spinner/Spinner';

const DetallesPedido: React.FC = () => {
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

    return (
        <div className="container">
            <div className="row justify-content-center mt-5">
                <div className="col-12 col-md-8">
                    <div className="card">
                        <div className="card-header"><h1 className="display-5">Detalles del Pedido</h1></div>
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
                        </div>
                        <div className="card-footer">
                            <Link to="/delivery" className="btn btn-primary">Volver</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetallesPedido;
