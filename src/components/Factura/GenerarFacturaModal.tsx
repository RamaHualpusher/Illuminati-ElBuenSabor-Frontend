import React, { useEffect, useState } from "react";
import { Pedido } from "../../interface/Pedido";
import AdminBar from "../NavBar/AdminBar";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useLocation } from "react-router-dom";
import "./GenerarFacturaModal.css";
import FacturaPDF from "./FacturaPDF ";
import GenerarCreditoModal from "./GenerarCreditoModal";

interface GenerarFacturaModalProps {
  closeModal: () => void;
}

const GenerarFacturaModal: React.FC<GenerarFacturaModalProps> = ({
  closeModal,
}) => {
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const location = useLocation();
  const pedidoParam = location.pathname.split("/factura/")[1];
  const parsedPedido = pedidoParam ? JSON.parse(decodeURIComponent(pedidoParam)) : null;
  const [showCreditoModal, setShowCreditoModal] = useState(false);
  const [showModal, setShowModal] = useState(true);

  const openCreditoModal = () => {
    setShowCreditoModal(true);
    setShowModal(true);
  };

  useEffect(() => {
    if (parsedPedido) {
      setPedido(parsedPedido);
    }
  }, []);

  if (!pedido) {
    return <div>Error: Pedido no encontrado</div>;
  }

  return (
    <>
      <AdminBar />
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="modal-container border-black"
            onClick={(e) => e.stopPropagation()}
          >
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
                <p>Número de Pedido: {pedido?.numeroPedido}</p>
                <p>Fecha: {pedido?.fechaPedido?.toLocaleString()}</p>
                <p>
                  Forma de Pago: {pedido?.esEfectivo ? "Efectivo" : "Mercado Pago"}
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
                    {pedido?.DetallePedido?.map((detalle) => (
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
                        Total: ${pedido?.totalPedido}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              <div className="payment-container">
                <div className="left-section" style={{ textAlign: "left" }}>
                  <p>
                    Tipo de Pago: {pedido?.esEfectivo ? "Efectivo" : "Mercado Pago"}
                    <br />
                    Descuento: {/* Agrega el descuento */}
                    <br />
                    Envío: {pedido?.esDelivery ? "Envío domicilio" : "Retiro local"}
                  </p>
                  <p>Total a pagar: ${pedido?.totalPedido}</p>
                </div>
                <div className="right-section">
                  <h2>Envío</h2>
                  <p>
                    Dirección: {pedido?.Usuario?.Domicilio?.calle} {pedido?.Usuario?.Domicilio?.numero},
                    <br />
                    {pedido?.Usuario?.Domicilio?.localidad}
                  </p>
                </div>
              </div>
              <div
                className="thankyou-container"
                style={{ textAlign: "center" }}
              >
                <p>
                  Muchas gracias {pedido?.Usuario?.nombre} {pedido?.Usuario?.apellido} por comprar en
                  <br />
                  El Buen Sabor
                </p>
              </div>
              <div className="pdf-container">
                <div className="pdf-container">
                  <PDFDownloadLink
                    document={<FacturaPDF pedido={pedido} />}
                    fileName="factura.pdf"
                  >
                    {({ blob, url, loading, error }) =>
                      loading ? (
                        "Cargando..."
                      ) : (
                        <button className="btn btn-primary">Descargar PDF</button>
                      )
                    }
                  </PDFDownloadLink>
                  <button
                    className="btn btn-secondary"
                    onClick={openCreditoModal}
                  >
                    Nota de Crédito
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {showCreditoModal && (
        <GenerarCreditoModal closeModal={() => setShowCreditoModal(false)} />
      )}
    </>
  );
};

export default GenerarFacturaModal;
