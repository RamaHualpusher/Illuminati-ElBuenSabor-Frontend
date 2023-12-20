import React, { useEffect, useState } from "react";
import { IPedido } from "../../interface/IPedido";
import { IUsuario } from "../../interface/IUsuario";
import { IDomicilio } from "../../interface/IDomicilio";
import AdminBar from "../NavBar/AdminBar";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Table, Container } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import FacturaPDF from "./FacturaPDF";

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

    return (
        <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-container border-black" onClick={(e) => e.stopPropagation()}>
                <AdminBar />
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
                        <p>
                            Forma de Pago: {pedido.esEfectivo ? "Efectivo" : "Mercado Pago"}
                        </p>
                    </div>
                    <div className="table-container">
                        <Table className="table">
                            <thead>
                                <tr>
                                    <th>Cantidad</th>
                                    <th>Detalle Producto</th>
                                    <th>Precio Unit.</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pedidoObj?.DetallePedido && pedidoObj.DetallePedido.length > 0 && (
                                    <tr key={pedidoObj.DetallePedido[0].id}>
                                        <td>{pedidoObj.DetallePedido[0].cantidad}</td>
                                        <td>
                                            <ul>
                                                {/* <li key={pedidoObj.DetallePedido[0].Productos.idProducto}>
                                                    {pedidoObj.DetallePedido[0].Productos.nombre}
                                                </li> */}
                                            </ul>
                                        </td>
                                        <td>
                                            <ul>
                                                {/* <li key={pedidoObj.DetallePedido[0].Productos.idProducto}>
                                                    {pedidoObj.DetallePedido[0].Productos.precio}
                                                </li> */}
                                            </ul>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan={3} style={{ textAlign: "right" }}>
                                        Total: ${getOrDefault(pedido.totalPedido, "No disponible")}
                                    </td>
                                </tr>
                            </tfoot>
                        </Table>
                    </div>
                    <div className="payment-container">
                        <div className="left-section" style={{ textAlign: "left" }}>
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
                            <PDFDownloadLink
                                document={
                                    <FacturaPDF
                                        pedido={pedido}
                                    />
                                }
                                fileName="nota_de_credito.pdf"
                            >
                                {({ blob, url, loading, error }) =>
                                    loading ? "Cargando..." : <button className="btn btn-primary">Descargar PDF</button>
                                }
                            </PDFDownloadLink>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GenerarCreditoModal;
