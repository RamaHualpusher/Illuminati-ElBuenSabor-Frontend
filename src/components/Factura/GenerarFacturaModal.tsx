import React, { useEffect, useState } from "react";
import { Pedido } from "../../interface/Pedido";
import AdminBar from "../NavBar/AdminBar";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useLocation } from "react-router-dom";
import { Button, Container, Table } from "react-bootstrap";
import FacturaPDF from "./FacturaPDF";
import GenerarCreditoModal from "./GenerarCreditoModal";

interface GenerarFacturaModalProps {
  closeModal: () => void;
}

// Función para verificar si un valor está presente o proporcionar un valor predeterminado
const getOrDefault = (value: any, defaultValue: any) => {
  return value !== null && value !== undefined ? value : defaultValue;
};

const GenerarFacturaModal: React.FC<GenerarFacturaModalProps> = ({
  closeModal,
}) => {
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const location = useLocation();
  const pedidoParam = location.pathname.split("/factura/")[1];
  const parsedPedido = pedidoParam ? JSON.parse(decodeURIComponent(pedidoParam)) : "";
  const [showCreditoModal, setShowCreditoModal] = useState(false);
  const [showModal, setShowModal] = useState(true);

  const openCreditoModal = () => {
    setShowCreditoModal(true);
    setShowModal(false);
  };

  useEffect(() => {
    if (parsedPedido) {
      setPedido(parsedPedido);
    }
  }, []);

  // Si no se encuentra un pedido, muestra un mensaje de error
  if (!pedido) {
    return <div>Error: Pedido no encontrado</div>;
  }

  return (
    <>
      {/* Barra de administrador */}
      <AdminBar />

      {/* Espacio en blanco */}
      <div style={{ marginTop: "50px" }}></div>

      {/* Muestra el modal si showModal es verdadero */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="modal-container border-black"
            onClick={(e) => e.stopPropagation()}
          >
            <Container fluid>
              <div className="border p-4 bg-white">
                {/* Logo */}
                <div className="logo-container">
                  <img
                    src="/assets/img/logo-grupo-illuminati.jpg"
                    alt="Logo de la empresa"
                    width={100}
                  />
                </div>
                {/* Información del restaurante */}
                <div className="info-container">
                  <h2>El Buen Sabor</h2>
                  <p>
                    Dirección: Aristides villanueva 356, Ciudad
                    <br />
                    CUIT: 12-5541252-8
                  </p>
                </div>
                {/* Detalles del pedido */}
                <div className="details-container">
                  <h2>DETALLES DEL PEDIDO</h2>
                  <p>Número de Pedido: {getOrDefault(pedido?.numeroPedido, "")}</p>
                  <p>Fecha: {getOrDefault(pedido?.fechaPedido?.toLocaleString(), "")}</p>
                  <p>
                    Forma de Pago: {pedido?.esEfectivo ? "Efectivo" : "Mercado Pago"}
                  </p>
                </div>
                {/* Tabla de detalles del pedido */}
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
                      {pedido?.DetallePedido?.map((detalle) => (
                        <tr key={detalle?.idDetallePedido}>
                          <td>{getOrDefault(detalle?.cantidad, "")}</td>
                          <td>
                            <ul>
                              {Array.isArray(detalle?.Productos) && detalle.Productos.map((producto) => (
                                <li key={producto?.idProducto}>
                                  {getOrDefault(producto?.nombre, "Nombre Desconocido")}
                                </li>
                              ))}
                            </ul>
                          </td>
                          <td>
                            <ul>
                              {Array.isArray(detalle?.Productos) && detalle?.Productos.map((producto) => (
                                <li key={producto?.idProducto}>
                                  {producto?.precio}
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
                          Total: ${getOrDefault(pedido?.totalPedido, 0)}
                        </td>
                      </tr>
                    </tfoot>
                  </Table>
                </div>
                {/* Información de pago */}
                <div className="payment-container">
                  <div className="left-section" style={{ textAlign: "left" }}>
                    <p>
                      Tipo de Pago: {getOrDefault(pedido?.esEfectivo ? "Efectivo" : "Mercado Pago", "")}
                      <br />
                      Descuento:
                      <br />
                      Envío: {getOrDefault(pedido?.esDelivery ? "Domicilio" : "Retiro local", "")}
                    </p>
                    <p>Total a pagar: ${getOrDefault(pedido?.totalPedido, 0)}</p>
                  </div>
                  <div className="right-section">
                    <h2>Envío</h2>
                    <p>
                      Dirección: {getOrDefault(pedido?.Usuario?.Domicilio?.calle, "")} {getOrDefault(pedido?.Usuario?.Domicilio?.numero, "")},
                      <br />
                      {getOrDefault(pedido?.Usuario?.Domicilio?.localidad, "")}
                    </p>
                  </div>
                </div>
                {/* Mensaje de agradecimiento */}
                <div className="thankyou-container text-center">
                  <p>
                    Muchas gracias {pedido?.Usuario?.nombre} {pedido?.Usuario?.apellido} por comprar en
                    <br />
                    El Buen Sabor
                  </p>
                </div>
                {/* Botones para descargar PDF y generar nota de crédito */}
                <div className="pdf-container">
                  <div className="pdf-container">
                    {/* Botón para descargar PDF */}
                    <PDFDownloadLink
                      document={<FacturaPDF pedido={pedido} />}
                      fileName="factura.pdf"
                    >
                      {({ loading }) => (
                        <Button variant="primary">
                          {loading ? "Cargando..." : "Descargar PDF"}
                        </Button>
                      )}
                    </PDFDownloadLink>
                    {/* Botón para generar nota de crédito */}
                    <Button variant="secondary" onClick={openCreditoModal}>
                      Nota de Crédito
                    </Button>
                  </div>
                </div>
              </div>
            </Container>
          </div>
        </div>
      )}
      {/* Muestra el modal de Nota de Crédito si showCreditoModal es verdadero */}
      {showCreditoModal && (
        <GenerarCreditoModal closeModal={() => setShowCreditoModal(false)} />
      )}
    </>
  );
};

export default GenerarFacturaModal;
