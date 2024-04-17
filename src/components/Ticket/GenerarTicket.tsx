import React, { useEffect, useState } from "react";
import { Container, Modal, Button, Table } from "react-bootstrap";
import { IPedidoDto } from "../../interface/IPedido";
import { IDetallePedido } from "../../interface/IDetallePedido";
import { useNavigate } from "react-router-dom";
import { IFactura } from "../../interface/IFactura";
import SendEmail from "../SendEmail/SendEmail";
import axios from "axios";

interface GenerarTicketProps {
    pedido: IPedidoDto | null;
    closeModal: () => void;
    show: boolean;
    modificarCantidad?: (id: number, cantidad: number) => void;
    eliminarDetallePedido?: (id: number) => void;
}

const GenerarTicket: React.FC<GenerarTicketProps> = ({
    pedido,
    closeModal,
    show,
}) => {
    const [selectedPedido, setSelectedPedido] = useState<IPedidoDto | null>(null);
    const [showSendEmail, setShowSendEmail] = useState<boolean>(false);
    const [confirmSendEmail, setConfirmSendEmail] = useState<boolean>(false);
    const [factura, setFactura] = useState<IFactura | null>(null);
    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_API_URL || "";

    useEffect(() => {
        setSelectedPedido(pedido);
    }, [pedido]);

    const generarFactura = async (selectedPedido: IPedidoDto | null) => {
        if (selectedPedido) {
            try {
                // Obtener todas las facturas desde el backend
                const response = await axios.get(`${API_URL}factura`);
                const facturas: IFactura[] = response.data;

                // Verificar si alguna factura tiene el mismo ID de pedido que estamos tratando de generar
                const facturaExistente = facturas.find(factura => factura.pedido.id === selectedPedido.id);

                if (facturaExistente) {
                    alert('¡Esta factura ya ha sido generada PREVIAMENTE!');
                    return null;
                } else {
                    // Aquí conviertes el pedido a un objeto de factura manualmente
                    const factura: IFactura = {
                        id:0,
                        activo: true,
                        fechaFactura: new Date(),
                        pedido: selectedPedido,
                    };

                    // Luego, realizas el proceso de envío de la factura
                    const response = await axios.post(`${API_URL}factura`, factura);
                    if (response.data) {
                        console.log('Factura guardada en el backend:', response.data);
                        alert('¡La factura se generó correctamente!');
                        setFactura(factura);
                        return factura;
                    }
                }
            } catch (error) {
                console.error('Error al generar la factura:', error);
                return null;
            }
        }
    };

    const getOrDefault = (value: any, defaultValue: any) => {
        return value !== null && value !== undefined ? value : defaultValue;
    };

    const calcularTotalPedido = (pedido: IPedidoDto) => {
        let total = 0;

        pedido.detallesPedidos.forEach((detalle: IDetallePedido) => {
            total += detalle.producto.precio * detalle.cantidad;
        });
        return total;
    };

    const handleGenerarFactura = async (selectedPedido: IPedidoDto | null) => {
        if (pedido) {
            const confirmarGenerarFactura = window.confirm("¿Está seguro de que desea generar la factura?");
            if (confirmarGenerarFactura) {
                if (selectedPedido) {
                    const facturaGenerada = await generarFactura(selectedPedido);
                    console.log("ya genero la factura"+facturaGenerada)
                    if (facturaGenerada) {
                        const confirmarEnviarEmail = window.confirm(`¿Desea enviar la factura generada por correo electrónico a ${pedido.usuario.email}?`);
                        if (confirmarEnviarEmail) {
                            setShowSendEmail(true); 
                        }
                    }
                    closeModal();
                } else {
                    console.error("Selected pedido es null o undefined");
                }
            }
        } else {
            alert("Este pedido ya ha sido facturado.");
        }
    };

    const handleSendEmail = () => {
        const confirmSendEmail = window.confirm(`¿Seguro que desea enviar la factura a ${selectedPedido?.usuario.email}?`);

        if (confirmSendEmail) {
            setShowSendEmail(true);
            closeModal();
        }
    };

    const calcularDescuento = (selectedPedido: IPedidoDto) => {
        return selectedPedido.esEfectivo ? 0.1 : 0;
    };

    const totalConDescuento = selectedPedido ? calcularTotalPedido(selectedPedido) * (1 - calcularDescuento(selectedPedido)) : 0;

    const handleMisPedidos = () => {
        navigate("/mis-pedidos"); // Redirige a /mis-pedidos al hacer click en "Ir a Mis Pedidos" 
    };

    const onCancel = () => {
        navigate("/");
    }

    return (
        <>
            <Modal show={show} onHide={closeModal} size="lg" centered>
                <Modal.Body>
                    {selectedPedido && (
                        <Container fluid className="d-flex justify-content-center">
                            <div className="border p-4 bg-white">
                                <div className="logo-container text-center mb-4">
                                    <img src="/assets/img/logo-grupo-illuminati.jpg" alt="Logo de la empresa" width={100} />
                                </div>
                                <div className="info-container">
                                    <h2 className="text-center">El Buen Sabor</h2>
                                    <div className="thankyou-container text-center">
                                        <p>
                                            Pedido para {selectedPedido.usuario.nombre} {selectedPedido.usuario.apellido}
                                            <br />
                                            Número de Pedido: {getOrDefault(selectedPedido.id, "")}
                                            <br />
                                            Fecha: {getOrDefault(new Date(selectedPedido.fechaPedido).toLocaleString(), "")}
                                        </p>
                                    </div>
                                </div>
                                <div className="details-container text-center">
                                    <h2>DETALLES DEL PEDIDO</h2>
                                </div>
                                <div className="table-container">
                                    <Table className="table" style={{ maxWidth: '500px', margin: '0 auto' }}>
                                        <thead>
                                            <tr>
                                                <th>Cantidad</th>
                                                <th>Detalle Producto</th>
                                                <th>Precio Unit.</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedPedido?.detallesPedidos.map((detalle, index) => (
                                                <tr key={index}>
                                                    <td>{getOrDefault(detalle.cantidad, "")}</td>
                                                    <td>{detalle.producto.nombre}</td>
                                                    <td>{detalle.producto.precio}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <td colSpan={3} style={{ textAlign: "right" }}>
                                                    <b> Total: ${calcularTotalPedido(selectedPedido)} </b>
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </Table>
                                </div>
                                <div className="payment-container">
                                    <div className="left-section text-center">
                                        <p>
                                            Tipo de Pago: {getOrDefault(selectedPedido.esEfectivo ? "Efectivo" : "Mercado Pago", "")}
                                            <br />
                                            Descuento: {selectedPedido.esEfectivo ? "10%" : "0%"}
                                            <br />
                                            Envío: {getOrDefault(selectedPedido.esDelivery ? "Domicilio" : "Retiro local", "")}
                                        </p>
                                    </div>
                                    <div className="center-section text-center">
                                        {calcularDescuento(selectedPedido) === 0.1 && (
                                            <p>
                                                <b> Total con descuento (10%): ${totalConDescuento} </b>
                                            </p>
                                        )}
                                    </div>
                                    <div className="right-section">
                                        <h2>Envío</h2>
                                        <p>
                                            Dirección: {getOrDefault(selectedPedido.usuario.domicilio?.calle, "")} {getOrDefault(selectedPedido.usuario.domicilio?.numero, "")},
                                            <br />
                                            {getOrDefault(selectedPedido.usuario.domicilio?.localidad, "")}
                                        </p>
                                    </div>
                                </div>

                            </div>
                        </Container>
                    )}
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-center">
                    <button className="btn btn-primary me-2" onClick={() => handleGenerarFactura(selectedPedido)}>
                        Generar Factura
                    </button>
                    {/* Botón para abrir modal de factura */}
                    <button className="btn btn-primary me-2" onClick={handleMisPedidos}>
                        Ir a Mis Pedidos
                    </button>
                    {/* Botón para cerrar el modal */}
                    <button className="btn btn-secondary" onClick={onCancel}>
                        Cerrar
                    </button>
                </Modal.Footer>
            </Modal>
            {showSendEmail && (
                <SendEmail factura={factura} onCancel={() => setShowSendEmail(false)} />
            )}

            {/* Modal de edición */}

            {/* esta seccion es para editar el Ticket, pero falta pasarle datos de detallePedido pero
                con los datos de CartTabla y CartIcon y CartItem */}

            {/* <EditTicket
                    pedido={selectedPedido}
                    closeModal={() => setShowEditModal(false)}
                    show={showEditModal}
                    cartItems={[]}
                    modificarCantidad={modificarCantidad}
                    eliminarDetallePedido={eliminarDetallePedido}
                /> */}
        </>
    );
};

export default GenerarTicket;
