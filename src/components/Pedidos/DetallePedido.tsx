import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Pedido } from '../../interface/Pedido';

const DetallePedido: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [pedido, setPedido] = useState<Pedido>();

    // useEffect(() => { //aca cambiar la url (se necesita el back)
    //     if (id) {
    //         fetch(`/api/pedidos/${id}`)
    //             .then(response => response.json())
    //             .then(data => {
    //                 setPedido(data);
    //             })
    //             .catch(error => console.error(error));
    //     }
    // }, [id]);

    if (!pedido) {
        return <div>Cargando...</div>;
    }

    const { Usuario, tipoEnvio } = pedido;

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-12 col-md-8 text-center">
                    <h1>Detalle del Pedido</h1>
                    <h3>Número de Pedido: {pedido.numeroPedido}</h3>
                    <p>Nombre y Apellido del Cliente: {Usuario.nombre} {Usuario.apellido}</p>
                    <p>Teléfono: {Usuario.telefono}</p>
                    <p>Dirección de Entrega: {Usuario.Domicilio.calle},{Usuario.Domicilio.localidad},{Usuario.Domicilio.numero}</p>

                    {/* Aquí puedes mostrar otros detalles del pedido */}

                    <Link to="/pedidos-en-delivery" className="btn btn-primary btn-lg mt-3">Volver a la lista de pedidos</Link>
                </div>
            </div>
        </div>
    );
};

export default DetallePedido;
