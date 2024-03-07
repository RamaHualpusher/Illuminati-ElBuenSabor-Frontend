import React, { useEffect, useState } from "react";
import { IPedidoDto } from "../../interface/IPedido";
import AdminBar from "../NavBar/AdminBar";
import { Button, Container, Table } from "react-bootstrap";
import FacturaPDF from "./FacturaPDF";
import GenerarCreditoModal from "./GenerarCreditoModal";
import { exportTableDataToExcel } from '../../util/exportTableDataToExcel';
import { IDetallePedidoDto } from "../../interface/IDetallePedido";
import { IProductoDto } from "../../interface/IProducto";

interface GenerarFacturaModalProps {
  factura?: IPedidoDto | null;
  closeModal: () => void;
}

const getOrDefault = (value: any, defaultValue: any) => {
  return value !== null && value !== undefined ? value : defaultValue;
};

const GenerarFacturaModal: React.FC<GenerarFacturaModalProps> = ({ closeModal, factura }) => {
  const [showCreditoModal, setShowCreditoModal] = useState(false);
  const [showModal, setShowModal] = useState(true);

  const openCreditoModal = () => {
    setShowCreditoModal(true);
    setShowModal(false);
  };

  const exportToExcel = (factura: IPedidoDto) => {
    const dataToExport = factura?.detallesPedidos || [];
    const filename = `Pedido ${factura?.usuario?.nombre} ${factura?.usuario?.apellido}-Num.${factura?.numeroPedido}_detalles`;
    exportTableDataToExcel(dataToExport, filename);
  };

  const calcularTotalPedido = (factura: IPedidoDto) => {
    let total = 0;

    factura.detallesPedidos.forEach((detalle: IDetallePedidoDto) => {
      total += detalle.producto.precio * detalle.cantidad;
    });

    return total;
  };


  const generatePDF = () => {
    if (!factura) {
      return;
    }
    FacturaPDF(factura);
    closeModal();
  };

  return (
    <>
      <AdminBar />
      <div style={{ marginTop: "50px" }}></div>
      {factura && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-container border-black" onClick={(e) => e.stopPropagation()}>
            <Container fluid>
              <div className="border p-4 bg-white">
                <div className="logo-container">
                  <img src="/assets/img/logo-grupo-illuminati.jpg" alt="Logo de la empresa" width={100} />
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
                  <p>Número de Pedido: {getOrDefault(factura.numeroPedido, "")}</p>
                  <p>Fecha: {getOrDefault(new Date(factura.fechaPedido).toLocaleString(), "")}</p>
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
                      {factura.detallesPedidos.map((detalle, index) => (
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
                          <b> Total: ${calcularTotalPedido(factura)} </b>
                        </td>
                      </tr>
                    </tfoot>
                  </Table>
                </div>
                <div className="payment-container">
                  <div className="left-section" style={{ textAlign: "center" }}>
                    <p>
                      Tipo de Pago: {getOrDefault(factura.esEfectivo ? "Efectivo" : "Mercado Pago", "")}
                      <br />
                      Descuento:
                      <br />
                      Envío: {getOrDefault(factura.esDelivery ? "Domicilio" : "Retiro local", "")}
                    </p>
                  </div>
                  <div className="right-section">
                    <h2>Envío</h2>
                    <p>
                      Dirección: {getOrDefault(factura.usuario.domicilio.calle, "")} {getOrDefault(factura.usuario.domicilio.numero, "")},
                      <br />
                      {getOrDefault(factura.usuario.domicilio.localidad, "")}
                    </p>
                  </div>
                </div>
                <div className="thankyou-container text-center">
                  <p>
                    Muchas gracias {factura.usuario.nombre} {factura.usuario.apellido} por comprar en
                    <br />
                    El Buen Sabor
                  </p>
                </div>
                <div className="pdf-container">
                  <div className="pdf-container">
                    <Button variant="primary" style={{ marginRight: "10px" }} onClick={() => generatePDF()}>
                      Descargar PDF
                    </Button>
                    <Button variant="secondary" onClick={openCreditoModal}>
                      Nota de Crédito
                    </Button>
                    <Button variant="success" style={{ marginLeft: "10px" }} onClick={() => exportToExcel(factura)}>
                      Exportar a Excel
                    </Button>
                  </div>
                </div>
              </div>
            </Container>
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
