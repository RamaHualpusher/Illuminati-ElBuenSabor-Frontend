import React, { useState } from "react";
import { IPedidoDto } from '../../interface/IPedido';
import AdminBar from "../NavBar/AdminBar";
import { Table, Button, Modal } from "react-bootstrap";
import NotaCreditoPDF from "./NotaCreditoPDF";
import axios from "axios";

interface GenerarCreditoModalProps {
    factura?: IPedidoDto | null;
    closeModal: () => void;
    show: boolean;
}

const GenerarCreditoModal: React.FC<GenerarCreditoModalProps> = ({
    closeModal,
    factura,
    show
}) => {
    const [fechaAnulacion] = useState(new Date());
    const API_URL = process.env.REACT_APP_API_URL || "";

    const getOrDefault = (value: any, defaultValue: any) => {
        return value !== null && value !== undefined ? value : defaultValue;
    };

    const calcularTotalPedido = (factura: IPedidoDto | null) => {
        let total = 0;

        factura?.detallesPedidos.forEach((detalle) => {
            total += detalle.producto.precio * detalle.cantidad;
        });

        return total;
    };

    // Función para calcular el descuento según la forma de pago
    const calcularDescuento = (factura: IPedidoDto) => {
        return factura.esEfectivo ? 0.1 : 0; // 10% de descuento si es efectivo, de lo contrario, 0
    };


    const totalConDescuento = factura ? calcularTotalPedido(factura) * (1 - calcularDescuento(factura)) : 0;

    const handleDevolverProductosEIngredientes = async (factura: IPedidoDto | null) => {
        try {
            if (!factura) {
                console.error("factura no válida");
                return;
            }

            for (const detalle of factura.detallesPedidos) {
                for (const productoIngrediente of detalle.producto.productosIngredientes || []) {
                    if (productoIngrediente.ingrediente.id !== undefined) {
                        await axios.put(
                            `${API_URL}ingrediente/${productoIngrediente.ingrediente.id}/addStock/${productoIngrediente.cantidad}`
                        );
                    }
                }
                if (detalle.producto.id !== undefined) {
                    await axios.put(
                        `${API_URL}producto/${detalle.producto.id}/addStock/${detalle.cantidad}`
                    );
                }
            }
        } catch (error) {
            console.error("Error al devolver productos e ingredientes:", error);
        }
    };

    const generatePDF = async () => {
        if (factura) {
            // Llama directamente a la función de generación de PDF en NotaCreditoPDF
            await handleDevolverProductosEIngredientes(factura);
            NotaCreditoPDF({ pedido: factura });
            closeModal();
        } else {
            console.error('Factura es nula');
        }
    };

    return (
        <Modal show={true} onHide={closeModal} size="lg">            
            <Modal.Body>
                <div className="modal-container border-black" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-content">
                        <h2>NOTA DE CRÉDITO</h2>
                        <div className="logo-container">
                            <img
                                src="/assets/img/logo-grupo-illuminati.jpg"
                                alt="Logo de la empresa"
                                width={100}
                            />
                        </div>
                        <div className="info-container">
                            <h2>El Buen Sabor</h2>
                            <p>
                                Dirección: Aristides villanueva 356, Ciudad
                                <br />
                                CUIT: 12-5541252-8
                            </p>
                        </div>
                        <div className="details-container">
                            <h2>DETALLES DE FACTURA</h2>
                            <p>Número de factura: {getOrDefault(factura?.id, "")}</p>
                            <p>Fecha Factura: {getOrDefault(factura?.fechaPedido?.toLocaleString(), "")}</p> 
                             {/* aca hay que agregar a fechaFactura en vez de fechaPedido */}

                            {fechaAnulacion && (
                                <p>Fecha Anulación: {fechaAnulacion.toLocaleString()}</p>
                            )}
                            <p>
                                Forma de Pago: {factura?.esEfectivo ? "Efectivo" : "Mercado Pago"}
                            </p>
                        </div>
                        <div className="table-container">
                            <Table className="table" style={{ maxWidth: '500px', margin: '0 auto' }} >
                                <thead>
                                    <tr>
                                        <th>Cantidad</th>
                                        <th>Detalle Producto</th>
                                        <th>Precio Unit.</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {factura?.detallesPedidos.map((detalle, index) => (
                                        <tr key={index}>
                                            <td>{getOrDefault(detalle.cantidad, "")}</td>
                                            <td>{detalle.producto.nombre}</td>
                                            <td>{detalle.producto.precio}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                {factura && (
                                    <tfoot>
                                        <tr>
                                            <td colSpan={3} style={{ textAlign: "right" }}>
                                                <b> Total: ${calcularTotalPedido(factura)} </b>
                                            </td>
                                        </tr>
                                    </tfoot>
                                )}

                            </Table>
                        </div>
                        <div className="payment-container">
                            <div className="left-section" style={{ textAlign: "center" }}>
                                <p>
                                    Tipo de Pago: {factura?.esEfectivo ? "Efectivo" : "Mercado Pago"}
                                    <br />
                                    Envío: {factura?.esDelivery ? "Domicilio" : "Retiro local"}
                                </p>
                            </div>
                            <div className="center-section" style={{ textAlign: "center" }}>
                                {factura && calcularDescuento(factura) === 0.1 && (
                                    <p>
                                        <b> Total con descuento (10%): ${totalConDescuento} </b>
                                    </p>
                                )}
                            </div>
                            <div className="right-section">
                                <h2>Envío</h2>
                                <p>
                                    Dirección: {factura?.usuario?.domicilio?.calle} {factura?.usuario?.domicilio?.numero},<br />
                                    {factura?.usuario?.domicilio?.localidad}
                                </p>
                            </div>
                        </div>
                        <div className="thankyou-container" style={{ textAlign: "center" }}>
                            <p>
                                Anulación de FACTURA Num: {getOrDefault(factura?.id, "")} a nombre de {getOrDefault(factura?.usuario?.nombre, "")} {getOrDefault(factura?.usuario?.apellido, "")}
                            </p>
                        </div>
                        <div className="pdf-container">
                            <div className="pdf-container">
                                <Button variant="primary" onClick={generatePDF}>
                                    Descargar Nota de Crédito PDF
                                </Button>
                            </div>
                        </div>
                        <div style={{ marginTop: "50px" }}></div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default GenerarCreditoModal;
