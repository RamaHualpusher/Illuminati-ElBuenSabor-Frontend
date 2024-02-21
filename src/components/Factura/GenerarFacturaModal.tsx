import React, { useEffect, useState } from "react";
import { IPedido } from "../../interface/IPedido";
import AdminBar from "../NavBar/AdminBar";
import { useLocation } from "react-router-dom";
import { Button, Container, Table } from "react-bootstrap";
import FacturaPDF from "./FacturaPDF";
import GenerarCreditoModal from "./GenerarCreditoModal";
import { exportTableDataToExcel } from '../../util/exportTableDataToExcel';
import { IDetallePedido } from "../../interface/IDetallePedido";
import { IProducto } from "../../interface/IProducto";

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
  const [pedido, setPedido] = useState<IPedido | null>(null);
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

  const exportToExcel = (pedido: IPedido) => {
    // Define los datos que deseas exportar a Excel, en este caso, los detalles del pedido
    const dataToExport = pedido?.DetallePedido || [];

    // Genera un nombre de archivo basado en el número de pedido
    const filename = `Pedido ${pedido?.Usuario?.nombre} ${pedido?.Usuario?.apellido}-Num.${pedido?.numeroPedido}_detalles`;

    // Llama a la función para exportar a Excel
    exportTableDataToExcel(dataToExport, filename);
  };

  // Función para calcular el total del pedido
  const calcularTotalPedido = (detallePedido: IDetallePedido[]) => {
    let total = 0;
    for (let i = 0; i < detallePedido.length; i++) {
        const detalle = detallePedido[i];
        const productos = detalle.Productos;
        // Verificar si Productos es un array
        if (Array.isArray(productos)) {
            for (let j = 0; j < productos.length; j++) {
                const producto = productos[j];
                total += producto.precio || 0;
            }
        } else {
            // Si Productos no es un array, asumir que es un solo producto
            total += productos.precio || 0;
        }
    }
    return total;
};

  const generatePDF = () => {
    // Lógica de generación del PDF
    FacturaPDF({ pedido });

    // Cerrar el modal después de generar el PDF
    closeModal();
  };

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
                  <p>Fecha: {getOrDefault(new Date(pedido.fechaPedido).toLocaleString(), "")}</p>
                  {/* <p>
                    Forma de Pago: {pedido?.esEfectivo ? "Efectivo" : "Mercado Pago"}
                  </p> */}
                </div>
                {/* Tabla de detalles del pedido */}
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
                      {pedido?.DetallePedido?.map((detalle) => (
                        <tr key={detalle?.id}>
                          <td>{getOrDefault(detalle?.cantidad, "")}</td>
                          <td>
                            <ul>
                              {Array.isArray(detalle?.Productos) && detalle.Productos.map((producto) => (
                                <li key={producto?.id}>
                                  {getOrDefault(producto?.nombre, "Nombre Desconocido")}
                                </li>
                              ))}
                            </ul>
                          </td>
                          <td>
                            <ul>
                              {Array.isArray(detalle?.Productos) && detalle?.Productos.map((producto) => (
                                <li key={producto?.id}>
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
                          <b> Total: ${calcularTotalPedido} </b>
                        </td>
                      </tr>
                    </tfoot>
                  </Table>
                </div>
                {/* Información de pago */}
                <div className="payment-container">
                  <div className="left-section" style={{ textAlign: "center" }}>
                    <p>
                      Tipo de Pago: {getOrDefault(pedido?.esEfectivo ? "Efectivo" : "Mercado Pago", "")}
                      <br />
                      Descuento:
                      <br />
                      Envío: {getOrDefault(pedido?.esDelivery ? "Domicilio" : "Retiro local", "")}
                    </p>
                  </div>
                  <div className="right-section">
                    <h2>Envío</h2>
                    <p>
                      Dirección: {getOrDefault(pedido?.Usuario?.domicilio?.calle, "")} {getOrDefault(pedido?.Usuario?.domicilio?.numero, "")},
                      <br />
                      {getOrDefault(pedido?.Usuario?.domicilio?.localidad, "")}
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
                    <Button variant="primary" style={{ marginRight: "10px" }} onClick={() => generatePDF()}>
                      Descargar PDF
                    </Button>
                    <Button variant="secondary" onClick={openCreditoModal}>
                      Nota de Crédito
                    </Button>
                    <Button variant="success" style={{ marginLeft: "10px" }} onClick={() => exportToExcel(pedido)}>
                      Exportar a Excel
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