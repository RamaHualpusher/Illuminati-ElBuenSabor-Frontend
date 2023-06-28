import React, { useEffect, useState } from "react";
import { DetallePedido } from "../../interface/DetallePedido";
import { Usuario } from "../../interface/Usuario";
import { Domicilio } from "../../interface/Domicilio";
import AdminBar from "../NavBar/AdminBar";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useLocation } from "react-router-dom";

import "./GenerarFacturaModal.css"; // Importa el archivo CSS para los estilos personalizados
import FacturaPDF from "./FacturaPDF ";

interface GenerarFacturaModalProps {
  closeModal: () => void;
}

const GenerarFacturaModal: React.FC<GenerarFacturaModalProps> = ({
  closeModal,
}) => {
  const [detallePedidos, setDetallePedidos] = useState<DetallePedido[]>([]);
  const [usuario, setUsuario] = useState<Usuario>();
  const [domicilio, setDomicilio] = useState<Domicilio>();
  const location = useLocation();
  const pedidoParam = location.pathname.split("/factura/")[1];
  const pedido = pedidoParam ? JSON.parse(decodeURIComponent(pedidoParam)) : null;

  useEffect(() => {
    if (pedido) {
      setDetallePedidos(pedido.DetallePedido || []);
      setUsuario(pedido.Usuario);
      if (pedido.Usuario) {
        setDomicilio(pedido.Usuario.Domicilio);
      }
    }
  }, [pedido]);

  if (!pedido) {
    return <div>Error: Pedido no encontrado</div>;
  }

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <AdminBar />
        <div className="modal-content">
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
            <p>Fecha: {pedido.fechaPedido?.toLocaleString()}</p>
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
                  <td colSpan={3}>Total: {pedido.totalPedido}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div className="payment-container">
            <div className="left-section">
              <p>
                Tipo de Pago: {pedido.esEfectivo ? "Efectivo" : "Mercado Pago"}
                <br />
                Descuento: {/* Agrega el descuento */}
                <br />
                Envío: {pedido.esDelivery ? "Envío domicilio" : "Retiro local"}
              </p>
              <p>Total a pagar: {pedido.totalPedido}</p>
            </div>
            <div className="right-section">
              <h2>Envío</h2>
              <p>
                Dirección: {usuario?.Domicilio?.calle} {usuario?.Domicilio?.numero},{" "}
                {usuario?.Domicilio?.localidad}
              </p>
              <div className="thankyou-container">
                <p>
                  Muchas gracias {usuario?.nombre} {usuario?.apellido} por comprar en
                  <br />
                  El Buen Sabor
                </p>
              </div>
            </div>
          </div>
          <div className="pdf-container">
            <div className="pdf-container">
              <PDFDownloadLink
                document={
                  <FacturaPDF
                    detallePedidos={detallePedidos}
                    usuario={usuario}
                    domicilio={domicilio}
                    pedidoNumero={pedido.numeroPedido}
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

export default GenerarFacturaModal;
