import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { DetallePedido } from '../../interface/DetallePedido';
import { Pedido } from '../../interface/Pedido';

const DetallesPedido: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [pedido, setPedido] = useState<DetallePedido>();

    useEffect(() => {
        if (id) {
            fetch('/assets/data/pedidos.json')
                .then((response) => response.json())
                .then((data) => {
                    const pedidoEncontrado = data.find((pedido: DetallePedido) => pedido.Pedido.idPedido === parseInt(id));
                    console.log('pedidoEncontrado:', pedidoEncontrado);
                    setPedido(pedidoEncontrado);
                })
                .catch((error) => console.error(error));
        }
    }, [id]);

    if (!pedido) {
        return <div>Cargando...</div>;
    }

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-12 col-md-8">
                    <div className="card">
                        <div className="card-header"><h1 className="display-5">Detalles del Pedido</h1></div>
                        <div className="card-body">
                            <h5 className="card-title">Número de Pedido: {pedido.Pedido.idPedido}</h5>
                            <p className="card-text">Nombre y Apellido del Cliente: {pedido.Pedido.Usuario.nombre} {pedido.Pedido.Usuario.apellido}</p>
                            <p className="card-text">Teléfono: {pedido.Pedido.Usuario.telefono}</p>
                            <p className="card-text">Dirección de Entrega: {pedido.Pedido.Usuario.Domicilio.calle}, {pedido.Pedido.Usuario.Domicilio.localidad}, {pedido.Pedido.Usuario.Domicilio.numero}</p>
                            <p className="card-text">Fecha: {new Date(pedido.Pedido.fechaPedido).toLocaleDateString()}</p>
                            <p className="card-text">Metodo de Pago: {}</p>
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
