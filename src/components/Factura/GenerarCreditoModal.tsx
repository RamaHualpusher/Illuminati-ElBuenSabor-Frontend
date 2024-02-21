import React, { useEffect, useState } from "react";
import { IPedido } from "../../interface/IPedido";
import { IUsuario } from "../../interface/IUsuario";
import { IDomicilio } from "../../interface/IDomicilio";
import AdminBar from "../NavBar/AdminBar";
import { Table, Container, Button } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { IDetallePedido } from "../../interface/IDetallePedido";
import NotaCreditoPDF from "./NotaCreditoPDF";
import { handleRequest } from "../FuncionRequest/FuncionRequest";

interface GenerarCreditoModalProps {
    closeModal: () => void;
}

const GenerarCreditoModal: React.FC<GenerarCreditoModalProps> = ({
    closeModal,
}) => {
    const [pedidoObj, setPedido] = useState<IPedido | null>(null);
    const [usuario, setUsuario] = useState<IUsuario | undefined>();
    const [domicilio, setDomicilio] = useState<IDomicilio | undefined>();
    const location = useLocation();
    const pedidoParam = location.pathname.split("/factura/")[1];
    const pedido = pedidoParam ? JSON.parse(decodeURIComponent(pedidoParam)) : null;
    const [fechaAnulacion] = useState(new Date());

    useEffect(() => {
        if (pedido) {
            setPedido(pedido.DetallePedido || []);
            setUsuario(pedido.Usuario);
            if (pedido.Usuario) {
                setDomicilio(pedido.Usuario.Domicilio);
            }
        }
    }, []);

    // Función para verificar si un valor está presente o proporcionar un valor predeterminado
    const getOrDefault = (value: any, defaultValue: any) => {
        return value !== null && value !== undefined ? value : defaultValue;
    };

    const handleDevolverProductosEIngredientes = async () => {
        try {
            // Itera sobre los detalles del pedido
            for (const detalle of pedido?.DetallePedido || []) {
                // Itera sobre los productos de cada detalle
                // Dentro de handleDevolverProductosEIngredientes
                for (const producto of detalle?.Productos || []) {
                    // Verifica que producto.idProducto no sea undefined antes de realizar la solicitud
                    if (producto.idProducto !== undefined) {
                        await handleRequest(
                            'PUT',
                            `/api/productos/${producto?.id}`,
                            { stockActual: producto?.stockActual + detalle?.cantidad }
                        );

                        // Itera sobre los ingredientes de cada producto
                        for (const ingrediente of producto.ingredientes || []) {
                            // Verifica que ingrediente.idIngrediente no sea undefined antes de realizar la solicitud
                            if (ingrediente.idIngrediente !== undefined) {
                                await handleRequest(
                                    'PUT',
                                    `/api/ingredientes/${ingrediente?.id}`,
                                    { stockActual: ingrediente?.stockActual + ingrediente?.cantidad }
                                );
                            }
                        }
                    }
                }

            }
        } catch (error) {
            console.error("Error al devolver productos e ingredientes:", error);
        }
    };

    const generatePDF = async () => {
        // Llama directamente a la función de generación de PDF en NotaCreditoPDF
        await handleDevolverProductosEIngredientes();
        NotaCreditoPDF({ pedido });
        closeModal();
    };

    return (
        <div className="modal-overlay" onClick={closeModal}>
            <AdminBar />
            <div style={{ marginTop: "80px" }}></div>
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
                        <h2>DETALLES DEL PEDIDO</h2>
                        <p>Número de Pedido: {getOrDefault(pedido.numeroPedido, "")}</p>
                        <p>Fecha Factura: {getOrDefault(new Date(pedido.fechaPedido).toLocaleString(), "")}</p>
                        {fechaAnulacion && (
                            <p>Fecha Anulación: {fechaAnulacion.toLocaleString()}</p>
                        )}
                        {/* <p>
                            Forma de Pago: {pedido?.esEfectivo ? "Efectivo" : "Mercado Pago"}
                        </p> */}
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
                                {pedido?.DetallePedido?.map((detalle: IDetallePedido) => (
                                    <tr key={detalle?.id}>
                                        <td>{getOrDefault(detalle?.cantidad, "")}</td>
                                        <td>
                                            <ul>
                                                {Array.isArray(detalle?.Productos) && detalle.Productos.map((producto, index) => (
                                                    // Proporciona una clave única para cada elemento de la lista
                                                    <li key={index}>
                                                        {getOrDefault(producto?.nombre, "Nombre Desconocido")}
                                                    </li>
                                                ))}
                                            </ul>
                                        </td>
                                        <td>
                                            <ul>
                                                {Array.isArray(detalle?.Productos) && detalle.Productos.map((producto, index) => (
                                                    // Proporciona una clave única para cada elemento de la lista
                                                    <li key={index}>
                                                        {getOrDefault(producto?.precio, "Precio Desconocido")}
                                                    </li>
                                                ))}
                                            </ul>
                                        </td>
                                    </tr>
                                ))}

                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan={3} style={{ textAlign: "right" }}>
                                        <b> Total: ${getOrDefault(pedido.totalPedido, "No disponible")} </b>
                                    </td>
                                </tr>
                            </tfoot>
                        </Table>
                    </div>
                    <div className="payment-container">
                        <div className="left-section" style={{ textAlign: "center" }}>
                            <p>
                                Tipo de Pago: {pedido.esEfectivo ? "Efectivo" : "Mercado Pago"}
                                <br />
                                Descuento: {/* Agrega el descuento */}
                                <br />
                                Envío: {pedido.esDelivery ? "Domicilio" : "Retiro local"}
                            </p>
                            <p>Total a devolver: ${getOrDefault(pedido.totalPedido, "")}</p>
                        </div>
                        <div className="right-section">
                            <h2>Envío</h2>
                            <p>
                                Dirección: {usuario?.domicilio?.calle} {usuario?.domicilio?.numero},<br />
                                {usuario?.domicilio?.localidad}
                            </p>
                        </div>
                    </div>
                    <div className="thankyou-container" style={{ textAlign: "center" }}>
                        <p>
                            Anulación de FACTURA Num: {getOrDefault(pedido.numeroPedido, "")} a nombre de {getOrDefault(usuario?.nombre, "")} {getOrDefault(usuario?.apellido, "")}
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
        </div>
    );
};

export default GenerarCreditoModal;
