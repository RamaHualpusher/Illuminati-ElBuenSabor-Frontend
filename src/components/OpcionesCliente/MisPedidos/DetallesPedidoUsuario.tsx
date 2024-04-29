import React, { useEffect, useState } from 'react';
import { IPedidoDto } from '../../../interface/IPedido';
import Spinner from '../../Spinner/Spinner';
import { IDetallePedido } from '../../../interface/IDetallePedido';
import { IProducto } from '../../../interface/IProducto';
import axios from 'axios';
import { useAuth0 } from "@auth0/auth0-react";
import { IUsuario } from '../../../interface/IUsuario';

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
    const [pedido, setPedido] = useState<IPedidoDto | null>(null);
    const API_URL = process.env.REACT_APP_API_URL || "";
    const { user} = useAuth0();
    const [usuario, setUsuario] = useState<IUsuario>(); // Aquí puedes definir la interfaz para IUsuario si tienes una

    useEffect(() => {
        const verificarUsuarioYObtenerPedidos = async () => {
            try {
                // Verificar el usuario existente
                const usuarioResponse = await axios.get(`${API_URL}usuario`);
                const usuarioDB = usuarioResponse.data;
    
                // Encontrar el usuario correspondiente en la base de datos usando el correo electrónico
                const usuarioEncontrado = usuarioDB.find((usuario: IUsuario) => usuario.email === user?.email);
                if (usuarioEncontrado) {
                    // Establecer el usuario encontrado en el estado
                    setUsuario(usuarioEncontrado);
    
                    // Obtener los pedidos del usuario
                    const pedidosResponse = await axios.get(`${API_URL}pedido/usuario/${usuarioEncontrado.id}`);
                    const pedidosDelUsuario = pedidosResponse.data;
                    setPedido(pedidosDelUsuario);
    
                    // Puedes manejar los pedidos obtenidos aquí, como establecerlos en el estado o realizar otras acciones
                    console.log("Pedidos del usuario:", pedidosDelUsuario);
                } else {
                    console.error("No se encontró el usuario en la base de datos.");
                }
            } catch (error) {
                console.error("Error al verificar el usuario y obtener pedidos:", error);
                // Manejar el error aquí según sea necesario, como mostrar un mensaje de error al usuario
            }
        };
    
        verificarUsuarioYObtenerPedidos();
    }, [user]);

    if (!pedido) {
        return <Spinner />;
    }

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
    const subtotalPedido = obtenerSubtotal(pedido.detallesPedidos);
    const totalPedido = pedido.esDelivery ? subtotalPedido + 500 : subtotalPedido * 0.9;
    const tiempoEstimadoFinalizacion = calcularTiempoEstimadoFinalizacion(pedido.detallesPedidos, pedido.esDelivery);

    return (
        <div className="detalle-page-container d-flex align-items-center justify-content-center" style={{ backgroundImage: `url('/assets/img/fondoMisPedidos.jpg') `, minHeight: '100vh' }}>
            <div className="container">
                <div className="row justify-content-center mt-5">
                    <div className="col-12 col-md-8 mt-5">
                        <div className="card mb-5 mt-3">
                            <div className="card-header text-center"><h1 className="display-5">Detalles del Pedido</h1></div>
                            <div className="card-body text-center">
                                <h5 className="card-title"> Número de Pedido: {pedido.id}</h5>
                                <p className="card-text"><strong>Nombre y Apellido del Cliente:</strong> {usuario?.nombre} {usuario?.apellido}</p>
                                <p className="card-text"><strong>Teléfono:</strong> {usuario?.telefono}</p>
                                {!pedido.esDelivery ? (
                                    <p className="card-text"><strong>Dirección de Entrega:</strong> {usuario?.domicilio.calle}, {usuario?.domicilio.localidad}, {usuario?.domicilio.numero}</p>
                                ) : (
                                    <p className="card-text"><strong> Dirección de Entrega:</strong> {usuario?.domicilio.calle}, {usuario?.domicilio.localidad}, {usuario?.domicilio.numero}</p>
                                )}
                                <p className="card-text"><strong>Fecha:</strong> {formatDate(pedido.fechaPedido)}</p>
                                <p className="card-text"><strong>Método de Pago:</strong> {pedido.esEfectivo ? 'Efectivo' : 'Mercado Pago'}</p>
                                {!pedido.esDelivery ? (
                                    <p className="card-text"><strong>Método de Entrega:</strong> Retiro en Local</p>
                                ) : (
                                    <p className="card-text"><strong>Método de Entrega:</strong> Delivery</p>
                                )}

                                <h5 className="card-title">Detalle de Ítems Pedidos</h5>

                                {pedido.detallesPedidos.map((detalle: IDetallePedido) => (
                                    <ul key={detalle.id} className="list-unstyled">
                                        {renderProductos(detalle)}
                                    </ul>
                                ))}

                                <p className="card-text"><strong>Subtotal:</strong> ${subtotalPedido}</p>
                                {!pedido.esDelivery && <p className="card-text"><strong>Descuento (10%):</strong> ${subtotalPedido * 0.1}</p>}
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