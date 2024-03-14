import React, { useEffect, useState } from "react";
import { IPedidoDto } from "../../interface/IPedido";
import { Button, Container, Modal, Table } from "react-bootstrap";
import FacturaPDF from "./FacturaPDF";
import GenerarCreditoModal from "./GenerarCreditoModal";
import { exportTableDataToExcel } from '../../util/exportTableDataToExcel';
import { IDetallePedidoDto } from "../../interface/IDetallePedido";

interface GenerarFacturaModalProps {  
  factura: IPedidoDto | undefined,
  closeModal: () => void;
  show: boolean; 
}

const GenerarFacturaModal: React.FC<GenerarFacturaModalProps> = ({ factura, closeModal, show }) => {
  const [showCreditoModal, setShowCreditoModal] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState<IPedidoDto | null>();

  useEffect(() => {
    setSelectedPedido(factura);
  }, [factura]);
  
  const handleCredito  = () => {
    if (selectedPedido && window.confirm("¿Estás seguro de generar la Nota de Crédito?")) {
      setShowCreditoModal(true);
    }
  };

  const exportToExcel = (factura: IPedidoDto) => {
    const dataToExport = factura?.detallesPedidos || [];
    const filename = `Pedido ${factura?.usuario?.nombre} ${factura?.usuario?.apellido}-Num.${factura?.id}_detalles`;
    exportTableDataToExcel(dataToExport, filename);
  };

  const getOrDefault = (value: any, defaultValue: any) => {
    return value !== null && value !== undefined ? value : defaultValue;
  };

  const calcularTotalPedido = (selectedPedido: IPedidoDto) => {
    let total = 0;

    selectedPedido.detallesPedidos.forEach((detalle: IDetallePedidoDto) => {
      total += detalle.producto.precio * detalle.cantidad;
    });
    return total;
  };

  const calcularDescuento = (selectedPedido: IPedidoDto) => {
    return selectedPedido.esEfectivo ? 0.1 : 0;
  };

  const totalConDescuento = selectedPedido ? calcularTotalPedido(selectedPedido) * (1 - calcularDescuento(selectedPedido)) : 0;

  const generatePDF = () => {
    if (!selectedPedido) {
      return;
    }
    FacturaPDF(selectedPedido);
    closeModal();
  };

  return (
    <>
      <Modal show={show} onHide={closeModal} size="lg">      
      <Modal.Body>
      {selectedPedido && (
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
                  <p>Número de Pedido: {getOrDefault(selectedPedido.id, "")}</p>
                  <p>Fecha: {getOrDefault(new Date(selectedPedido.fechaPedido).toLocaleString(), "")}</p>
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
                  <div className="left-section" style={{ textAlign: "center" }}>
                    <p>
                      Tipo de Pago: {getOrDefault(selectedPedido.esEfectivo ? "Efectivo" : "Mercado Pago", "")}
                      <br />
                      Descuento: {selectedPedido.esEfectivo ? "10%" : "0%"}
                      <br />
                      Envío: {getOrDefault(selectedPedido.esDelivery ? "Domicilio" : "Retiro local", "")}
                    </p>
                  </div>                  
                  <div className="center-section" style={{ textAlign: "center" }}>
                    {calcularDescuento(selectedPedido) === 0.1 && (
                      <p>
                        <b> Total con descuento (10%): ${totalConDescuento} </b>
                      </p>
                    )}
                  </div>
                  <div className="right-section">
                    <h2>Envío</h2>
                    <p>
                      Dirección: {getOrDefault(selectedPedido.usuario.domicilio.calle, "")} {getOrDefault(selectedPedido.usuario.domicilio.numero, "")},
                      <br />
                      {getOrDefault(selectedPedido.usuario.domicilio.localidad, "")}
                    </p>
                  </div>
                </div>

                <div className="thankyou-container text-center">
                  <p>
                    Muchas gracias {selectedPedido.usuario.nombre} {selectedPedido.usuario.apellido} por comprar en
                    <br />
                    El Buen Sabor
                  </p>
                </div>
                <div className="pdf-container">
                  <div className="pdf-container">
                    <Button variant="primary" style={{ marginRight: "10px" }} onClick={() => generatePDF()}>
                      Descargar PDF
                    </Button>
                    <Button variant="secondary" onClick={handleCredito }>
                      Nota de Crédito
                    </Button>
                    <Button variant="success" style={{ marginLeft: "10px" }} onClick={() => exportToExcel(selectedPedido)}>
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
        <GenerarCreditoModal 
        closeModal={() => setShowCreditoModal(false)}
        factura={selectedPedido}
        show={show} />
      )}
      </Modal.Body>
      </Modal>
    </>
  );
};

export default GenerarFacturaModal;
