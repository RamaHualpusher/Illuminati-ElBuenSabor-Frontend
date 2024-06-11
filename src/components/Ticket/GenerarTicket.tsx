import React, { useEffect, useState } from "react";
import { Container, Modal, Button, Table } from "react-bootstrap";
import { IPedidoDto } from "../../interface/IPedido";
import { IDetallePedido } from "../../interface/IDetallePedido";
import { IFactura } from "../../interface/IFactura";
import { useNavigate } from "react-router-dom";
import SendEmail from "../SendEmail/SendEmail";
import axios from "axios";
import FacturaPDF from "../Factura/FacturaPDF";
import { IDetalleFactura } from "../../interface/IDetalleFactura";

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
    const [facturaExistente, setFacturaExistente] = useState<boolean>(false);
    const [factura, setFactura] = useState<IFactura | null>(null);
    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_API_URL || "";

    useEffect(() => {
        setSelectedPedido(pedido);
        if (pedido) {
            verificarFacturaExistente(pedido.id ?? 0);
        }
    }, [pedido]);

    const verificarFacturaExistente = async (pedidoId: number) => {
        try {
            const response = await axios.get(`${API_URL}factura`);
            const facturas: IFactura[] = response.data;
            const facturaExistente = facturas.find(factura => factura.pedido && factura.pedido.id === pedidoId);
            if (facturaExistente) {
                setFacturaExistente(true);
                setFactura(facturaExistente); // Set the existing factura
            } else {
                setFacturaExistente(false);
                setFactura(null); // Clear the factura state if no existing factura is found
            }
        } catch (error) {
            console.error('Error al verificar factura existente:', error);
        }
    };

    const generarFactura = async (selectedPedido: IPedidoDto | null) => {
        if (selectedPedido) {
            try {
                // Obtener todas las facturas desde el backend
                const response = await axios.get(`${API_URL}factura`);
                const facturas: IFactura[] = response.data;

                // Verificar si alguna factura tiene el mismo ID de pedido que estamos tratando de generar
                const facturaExistente = facturas.find(factura => factura.pedido && factura.pedido.id === selectedPedido.id);

                if (facturaExistente) {
                    alert('¡Esta factura ya ha sido generada PREVIAMENTE!');
                    setFactura(facturaExistente); // Set the existing factura
                } else {
                    const detallesFactura: IDetalleFactura[] = selectedPedido.detallesPedidos.map((detalle: IDetallePedido) => ({
                        cantidad: detalle.cantidad,
                        subtotal: detalle.producto.precio * detalle.cantidad,
                        nombreProducto: detalle.producto.nombre,
                        precioProducto: detalle.producto.precio
                    }));

                    //validacion por si el usuario no tiene direccion asignada
                    const direccion = selectedPedido.usuario.domicilio
                        ? `${selectedPedido.usuario.domicilio.calle} ${selectedPedido.usuario.domicilio.numero}, ${selectedPedido.usuario.domicilio.localidad}`
                        : "Retiro en local";

                    // Aquí conviertes el pedido a un objeto de factura manualmente
                    const factura: IFactura = {
                        activo: true,
                        fechaPedido: selectedPedido.fechaPedido,
                        fechaFactura: new Date(),
                        esDelivery: selectedPedido.esDelivery ?? false,
                        esEfectivo: selectedPedido.esEfectivo ?? false,
                        usuario: {
                            ...selectedPedido.usuario,
                            domicilio: selectedPedido.usuario.domicilio ? selectedPedido.usuario.domicilio : { calle: "Retiro en local", numero: 0, localidad: "" },
                        },
                        total: selectedPedido.total ?? 0,
                        detalleFactura: detallesFactura,
                        pedido: selectedPedido,
                    };

                    // Luego, realizas el proceso de envío de la factura
                    const response = await axios.post(`${API_URL}factura`, factura);
                    if (response.data) {
                        console.log('Factura guardada en el backend:', response.data);
                        alert('¡La factura se generó correctamente!');
                        setFactura(factura);
                        setFacturaExistente(true); // Mark as factura existing
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
        if (selectedPedido) {
            const confirmarGenerarFactura = window.confirm(`¿Está seguro de que desea generar la factura a nombre de ${selectedPedido.usuario.nombre} ${selectedPedido.usuario.apellido}?`);
            if (confirmarGenerarFactura) {
                if (selectedPedido) {
                    const facturaGenerada = await generarFactura(selectedPedido);
                    console.log("factura generada" + facturaGenerada)
                    if (facturaGenerada) {
                        const confirmarEnviarEmail = window.confirm(`¿Desea enviar la factura generada por correo electrónico a ${selectedPedido.usuario.email}?`);
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

    const calcularDescuento = (selectedPedido: IPedidoDto) => {
        return selectedPedido.esEfectivo ? 0.1 : 0;
    };

    const totalConDescuento = selectedPedido ? calcularTotalPedido(selectedPedido) * (1 - calcularDescuento(selectedPedido)) : 0;

    const handleMisPedidos = () => {
        navigate("/mis-pedidos"); // Redirige a /mis-pedidos al hacer click en "Ir a Mis Pedidos" 
    };

    const onCancel = () => {
        closeModal(); // chequear esto para cerrar el modal y no volver a la pagina anterior
    }

    const handleDescargarFactura = () => {
        if (factura) {
            FacturaPDF(factura);
        } else {
            alert("Debe generar una factura antes de poder descargarla.");
        }
    };

    return (
        <>
            <Modal show={show} onHide={closeModal} size="lg" centered>
                <Modal.Body className="d-flex justify-content-center align-items-center">
                    {selectedPedido && (
                        <Container className="d-flex justify-content-center">
                            <div className=" w-100 border p-4 bg-white">
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
                    {(facturaExistente &&
                        <Button variant="info" onClick={handleDescargarFactura}>
                            Descargar Factura
                        </Button>
                    )}
                    <button className="btn btn-primary me-2" onClick={handleMisPedidos}>
                        Ir a Mis Pedidos
                    </button>
                    <button className="btn btn-secondary" onClick={onCancel}>
                        Cerrar
                    </button>
                </Modal.Footer>
            </Modal>
            {showSendEmail && (
                <SendEmail factura={factura} onCancel={() => setShowSendEmail(false)} />
            )}
        </>
    );
};

export default GenerarTicket;
