import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Pedido } from '../../interface/Pedido';
import Spinner from '../Spinner/Spinner';
import { DetallePedido } from '../../interface/DetallePedido';
import { Producto } from '../../interface/Producto';
import axios from 'axios';

const DetallesPedidoCocinero: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [pedido, setPedido] = useState<Pedido | null>(null);
    const [editarTiempo, setEditarTiempo] = useState(false);
    const [tiempoEditado, setTiempoEditado] = useState<number | null>(null);
    const API_URL = "/assets/data/pedidos.json";
    const API_URL_BACKEND = "https://example.com/api/pedidos";

    
    useEffect(() => {
        const fetchPedido = async () => {
            try {
                if (id) {
                    const response = await fetch(API_URL);
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

    // Volver a la página anterior
    const goBack = () => {
        window.history.go(-1);
    };

    // Renderizar la lista de productos del detalle
    const renderProductos = (detalle: DetallePedido) => {
        if (!detalle.Productos || !Array.isArray(detalle.Productos) || detalle.Productos.length === 0) {
            return <p>Productos no disponibles</p>;
        }

        return (
            <ul>
                {detalle.Productos.map((producto: Producto) => (
                    <li key={producto.idProducto}>
                        <strong>{producto.nombre}</strong>: ${producto.precio} - <i className="bi bi-clock-fill"></i> {producto.tiempoEstimadoCocina}Min
                        {!producto.esBebida && producto.preparacion && <p> <strong>Preparación:</strong> <br /> {producto.preparacion}</p>}
                    </li>
                ))}
            </ul>
        );
    };

    // Formatear una fecha a una cadena legible
    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString();
    };

    // Obtener el tiempo estimado máximo de cocina en minutos
    const obtenerTiempoEstimadoMaximo = (detallePedido: DetallePedido[]) => {
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

        return maxTiempoEstimadoCocina;
    };

    // Calcular el tiempo estimado de finalización
    const calcularTiempoEstimadoFinalizacion = (detallePedido: DetallePedido[], esDelivery: boolean) => {
        const tiempoEstimadoMaximo = obtenerTiempoEstimadoMaximo(detallePedido);
        const tiempoEstimadoFinalizacion = tiempoEditado !== null ? tiempoEditado : tiempoEstimadoMaximo;

        return tiempoEstimadoFinalizacion + (esDelivery ? 10 : 0);
    };

    // Tiempo estimado de finalización del pedido
    const tiempoEstimadoFinalizacion = calcularTiempoEstimadoFinalizacion(DetallePedido, esDelivery);

    // Habilitar la edición del tiempo estimado
    const handleEditarTiempo = () => {
        setEditarTiempo(true);
    };

    // Guardar el tiempo estimado editado en el backend
    const handleGuardarTiempo = async () => {
        setEditarTiempo(false);
        try {
            if (tiempoEditado !== null) {
                const pedidoActualizado = {
                    idPedido: pedido.idPedido,
                    tiempoEstimado: tiempoEditado,
                    // Agrega otras propiedades necesarias para enviar al backend (Usuario, fechaPedido, esEfectivo, etc.)
                };
                await axios.put(`${API_URL_BACKEND}/${id}`, pedidoActualizado);
            }
        } catch (error) {
            console.error("Error al guardar el tiempo estimado:", error);
        }
    };

    // Cancelar la edición del tiempo estimado
    const handleCancelarTiempo = () => {
        setEditarTiempo(false);
        setTiempoEditado(null);
    };

    // Actualizar el tiempo estimado editado
    const handleTiempoEditado = (event: React.ChangeEvent<HTMLInputElement>) => {
        const tiempoIngresado = parseInt(event.target.value);
        setTiempoEditado(tiempoIngresado);
    };

    return (
        <div className="detalle-page-container d-flex align-items-center justify-content-center" style={{ backgroundImage: `url('/assets/img/fondoMisPedidos.jpg') `, minHeight: '100vh' }}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-8">
                        <div className="card mt-4 mb-4">
                            <div className="card-header text-center"><h1 className="display-5">Detalles del Pedido</h1></div>
                            <div className="card-body text-center">
                                <h5 className="card-title"> Número de Pedido: {numeroPedido}</h5>
                                <p className="card-text"><strong>Nombre y Apellido del Cliente:</strong> {Usuario.nombre} {Usuario.apellido}</p>
                                <p className="card-text"><strong>Teléfono:</strong> {Usuario.telefono}</p>
                                {!esDelivery ? (
                                    <p className="card-text"><strong>Dirección de Entrega:</strong> {Usuario.Domicilio.calle}, {Usuario.Domicilio.localidad}, {Usuario.Domicilio.numero}</p>
                                ) :
                                    (
                                        <p className="card-text"><strong> Dirección de Entrega:</strong> {Usuario.Domicilio.calle}, {Usuario.Domicilio.localidad}, {Usuario.Domicilio.numero}</p>
                                    )}
                                <p className="card-text"><strong>Fecha:</strong> {formatDate(fechaPedido)}</p>
                                <p className="card-text"><strong>Método de Pago:</strong> {esEfectivo ? 'Efectivo' : 'Mercado Pago'}</p>
                                {!esDelivery ? (
                                    <p className="card-text"><strong>Método de Entrega:</strong> Retiro en Local</p>
                                ) :
                                    (
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
                                <p className="card-text"><strong>Tiempo Estimado:   </strong>
                                    {editarTiempo ? (
                                        <>
                                            <input type="number" value={tiempoEditado !== null ? tiempoEditado : tiempoEstimadoFinalizacion} onChange={handleTiempoEditado} />
                                            Min
                                            <button className="btn btn-primary ml-2" onClick={handleGuardarTiempo}>Guardar</button>  <button className="btn btn-secondary ml-2" onClick={handleCancelarTiempo}>Cancelar</button>
                                        </>
                                    ) : (
                                        <>
                                            {tiempoEstimadoFinalizacion} Min  <button className="btn btn-primary ml-2" onClick={handleEditarTiempo}>Editar</button>
                                        </>
                                    )}
                                </p>
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

export default DetallesPedidoCocinero;
