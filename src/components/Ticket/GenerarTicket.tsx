import React, { useEffect, useState } from "react";
import { Container, Modal, Button, Table } from "react-bootstrap";
import { IPedidoDto } from "../../interface/IPedido";
import { IDetallePedidoDto } from "../../interface/IDetallePedido";
import { useNavigate } from "react-router-dom";

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
    show
}) => {
    const [selectedPedido, setSelectedPedido] = useState<IPedidoDto | null>(null);
    const [showMisPedidos, setMisPedidos] = useState<boolean>(false);
    // const [showConfirmation, setShowConfirmation] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setSelectedPedido(pedido);
    }, [pedido]);

    const getOrDefault = (value: any, defaultValue: any) => {
        return value !== null && value !== undefined ? value : defaultValue;
    };

    const calcularTotalPedido = (pedido: IPedidoDto) => {
        let total = 0;

        pedido.detallesPedidos.forEach((detalle: IDetallePedidoDto) => {
            total += detalle.producto.precio * detalle.cantidad;
        });
        return total;
    };

    const calcularDescuento = (selectedPedido: IPedidoDto) => {
        return selectedPedido.esEfectivo ? 0.1 : 0;
    };

    const totalConDescuento = selectedPedido ? calcularTotalPedido(selectedPedido) * (1 - calcularDescuento(selectedPedido)) : 0;

    const handleMisPedidos = () => {
        navigate("/mis-pedidos"); // Redirige a /mis-pedidos al hacer click en "Ir a Mis Pedidos" 
    };

    const onCancel =() =>{
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
                                <div className="text-center">
                                    {/* Botón para abrir modal de factura */}
                                    <Button className="btn btn-primary me-2" onClick={handleMisPedidos}>
                                        Ir a Mis Pedidos
                                    </Button>
                                    {/* Botón para abrir modal de edición */}
                                    {/* <Button className="btn btn-primary me-2" onClick={() => setShowEditModal(true)}>
                                        Editar Pedido
                                    </Button> */}
                                    {/* Botón para cerrar el modal */}
                                    <Button className="btn btn-secondary" onClick={onCancel}>
                                        Cerrar
                                    </Button>
                                </div>
                            </div>
                        </Container>
                    )}
                </Modal.Body>
            </Modal>

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
