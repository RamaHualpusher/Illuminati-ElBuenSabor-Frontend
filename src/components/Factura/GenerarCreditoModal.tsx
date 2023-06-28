import React, { useEffect, useState } from "react";
import { DetallePedido } from "../../interface/DetallePedido";
import { Usuario } from "../../interface/Usuario";
import { Domicilio } from "../../interface/Domicilio";
import AdminBar from "../NavBar/AdminBar";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useLocation } from "react-router-dom";
import "./GenerarFacturaModal.css";
import FacturaPDF from "./FacturaPDF ";

interface GenerarCreditoModalProps {
    closeModal: () => void;
}

const GenerarCreditoModal: React.FC<GenerarCreditoModalProps> = ({
    closeModal,
}) => {
    const [detallePedidos, setDetallePedidos] = useState<DetallePedido[]>([]);
    const [usuario, setUsuario] = useState<Usuario>();
    const [domicilio, setDomicilio] = useState<Domicilio>();
    const location = useLocation();
    const pedidoParam = location.pathname.split("/factura/")[1];
    const pedido = pedidoParam ? JSON.parse(decodeURIComponent(pedidoParam)) : null;
    const [fechaAnulacion] = useState(new Date());

    useEffect(() => {
        if (pedido) {
            setDetallePedidos(pedido.DetallePedido || []);
            setUsuario(pedido.Usuario);
            if (pedido.Usuario) {
                setDomicilio(pedido.Usuario.Domicilio);
            }
        }
    }, [pedido]);

    return (
        <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-container border-black" onClick={(e) => e.stopPropagation()}>
                <AdminBar />
                <div className="modal-content">
                    <h2>NOTA DE CREDITO</h2>
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
                        <p>Número de Pedido: {pedido.numeroPedido}</p>
                        <p>Fecha Factura: {pedido.fechaPedido?.toLocaleString()}</p>
                        {fechaAnulacion && (
                            <p>Fecha Anulación: {fechaAnulacion.toLocaleString()}</p>
                        )}
                        {/* aca habria que hacer que disminuya el dinero en nuestra caja */}
                        <p>
                            Forma de Pago: {pedido.esEfectivo ? "Efectivo" : "Mercado Pago"}
                        </p>
                    </div>
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Cantidad</th>
                                    <th>Detalle Producto</th>
                                    <th>Precio Unit.</th>
                                </tr>
                            </thead>
                            <tbody>
                                {detallePedidos?.map((detalle) => (
                                    <tr key={detalle?.idDetallePedido}>
                                        <td>{detalle?.cantidad}</td>
                                        <td>{detalle?.Producto?.nombre}</td>
                                        <td>{detalle?.Producto?.precio}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan={3} style={{ textAlign: "right" }}>
                                        Total: ${pedido.totalPedido}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    <div className="payment-container">
                        <div className="left-section" style={{ textAlign: "left" }}>
                            <p>
                                Tipo de Pago: {pedido.esEfectivo ? "Efectivo" : "Mercado Pago"}
                                <br />
                                Descuento: {/* Agrega el descuento */}
                                <br />
                                Envío: {pedido.esDelivery ? "Envío domicilio" : "Retiro local"}
                            </p>
                            <p>Total a devolver: ${pedido.totalPedido}</p>
                        </div>
                        <div className="right-section">
                            <h2>Envío</h2>
                            <p>
                                Dirección: {usuario?.Domicilio?.calle} {usuario?.Domicilio?.numero},<br />
                                {usuario?.Domicilio?.localidad}
                            </p>
                        </div>
                    </div>
                    <div className="thankyou-container" style={{ textAlign: "center" }}>
                        <p>
                            Anulación de FACTURA Num: {pedido.numeroPedido} a nombre de {usuario?.nombre} {usuario?.apellido} 
                        </p>
                    </div>
                    <div className="pdf-container">
                        <div className="pdf-container">
                            <PDFDownloadLink
                                document={
                                    <FacturaPDF
                                        detallePedidos={detallePedidos}
                                        usuario={usuario}
                                        domicilio={domicilio}
                                        numeroPedido={pedido.numeroPedido}
                                        fechaPedido={pedido.fechaPedido}
                                        esEfectivo={pedido.esEfectivo}
                                        totalPedido={pedido.totalPedido}
                                    />
                                }
                                fileName="factura.pdf"
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