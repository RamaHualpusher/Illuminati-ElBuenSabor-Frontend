import React, { useEffect, useState } from "react";
import { IFactura } from "../../interface/IFactura";
import { Button, Container, Modal, Table } from "react-bootstrap";
import FacturaPDF from "./FacturaPDF";
import GenerarCreditoModal from "./GenerarCreditoModal";
import { exportTableDataToExcel } from '../../util/exportTableDataToExcel';
import axios from 'axios';
import SendEmail from "../SendEmail/SendEmail";
import { IDetalleFactura } from "../../interface/IDetalleFactura";

interface GenerarFacturaModalProps {
  factura: IFactura | null,
  closeModal: () => void;
  show: boolean;
}

const GenerarFacturaModal: React.FC<GenerarFacturaModalProps> = ({ factura, closeModal, show }) => {
  const [selectedFactura, setSelectedFactura] = useState<IFactura | null>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const API_URL = process.env.REACT_APP_API_URL || "";
  const [showSendEmail, setShowSendEmail] = useState<boolean>(false);
  const [confirmSendEmail, setConfirmSendEmail] = useState<boolean>(false);

  useEffect(() => {
    if (factura) {
      setSelectedFactura(factura);
      getUserInfo();
    }
  }, [factura]);

  const getUserInfo = async () => {
    try {
      const response = await axios.get(`${API_URL}usuario/clientes`);
      const userInfo = response.data;
      setUserInfo(userInfo);
    } catch (error) {
      console.error('Error al obtener la información del usuario:', error);
    }
  };

  const handleSendEmail = () => {
    const confirmSendEmail = window.confirm(`¿Seguro que desea enviar la factura a ${selectedFactura?.pedido.usuario.email}?`);
  
    if (confirmSendEmail) {
      setConfirmSendEmail(true);
      setShowSendEmail(true);
      closeModal();
    }
  };

  const handleCancelSendEmail = () => {
    setShowSendEmail(false);
  };

  const exportToExcel = (factura: IFactura) => {
    const dataToExport = factura.detalleFactura || [];
    const filename = `Pedido ${factura.usuario?.nombre} ${factura.usuario?.apellido}-Num.${factura?.id}_detalles`;
    exportTableDataToExcel(dataToExport, filename);
  };

  const getOrDefault = (value: any, defaultValue: any) => {
    return value !== null && value !== undefined ? value : defaultValue;
  };

  const calcularTotalPedido = (selectedFactura: IFactura) => {
    let total = 0;

    selectedFactura.detalleFactura.forEach((detalle: IDetalleFactura) => {
      total += detalle.precioProducto * detalle.cantidad;
    });
    return total;
  };

  const calcularDescuento = (selectedFactura: IFactura) => {
    return selectedFactura.esEfectivo ? 0.1 : 0;
  };

  const totalConDescuento = selectedFactura ? calcularTotalPedido(selectedFactura) * (1 - calcularDescuento(selectedFactura)) : 0;

  const generatePDF = () => {
    if (!selectedFactura) {
      return;
    }
    FacturaPDF(selectedFactura);
    closeModal();
  };

  return (
    <>
      <Modal show={show} onHide={closeModal} size="lg" centered>
        <Modal.Body>
          {selectedFactura && (
            <div className="modal-overlay" onClick={closeModal}>
              <div className="modal-container text-center border-black" onClick={(e) => e.stopPropagation()}>
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
                      <h2>FACTURA</h2>
                      <p>Número de Pedido: {getOrDefault(selectedFactura.id, "")}</p>
                      <p>Fecha: {getOrDefault(new Date(selectedFactura.fechaFactura).toLocaleString(), "")}</p>
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
                          {selectedFactura?.detalleFactura.map((detalle, index) => (
                            <tr key={index}>
                              <td>{detalle.cantidad}</td>
                              <td>{detalle.nombreProducto}</td>
                              <td>{detalle.precioProducto}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td colSpan={3} style={{ textAlign: "right" }}>
                              <b> Total: ${calcularTotalPedido(selectedFactura)} </b>
                            </td>
                          </tr>
                        </tfoot>
                      </Table>
                    </div>
                    <div className="payment-container">
                      <div className="left-section" style={{ textAlign: "center" }}>
                        <p>
                          Tipo de Pago: {getOrDefault(selectedFactura.esEfectivo ? "Efectivo" : "Mercado Pago", "")}
                          <br />
                          Descuento: {selectedFactura.esEfectivo ? "10%" : "0%"}
                          <br />
                        </p>
                      </div>
                      <div className="center-section" style={{ textAlign: "center" }}>
                        {calcularDescuento(selectedFactura) === 0.1 && (
                          <p>
                            <b> Total con descuento (10%): ${totalConDescuento} </b>
                          </p>
                        )}
                      </div>
                      <div className="right-section">
                        <h2>Envío</h2>
                        <p>
                          Dirección: {getOrDefault(selectedFactura.usuario.domicilio?.calle, "")} {getOrDefault(selectedFactura.usuario.domicilio?.numero, "")},
                          <br />
                          {getOrDefault(selectedFactura.usuario.domicilio?.localidad, "")}
                        </p>
                      </div>
                    </div>

                    <div className="thankyou-container text-center">
                      <p>
                        Muchas gracias {selectedFactura.usuario.nombre} {selectedFactura.usuario.apellido} por comprar en
                        <br />
                        El Buen Sabor
                      </p>
                    </div>
                    <div className="pdf-container d-flex justify-content-between" style={{marginTop: "40px"}}>
                      <Button variant="primary" style={{ marginRight: "10px" }} onClick={() => handleSendEmail()}>
                        Enviar por Email
                      </Button>
                      <Button variant="primary" style={{ marginRight: "10px" }} onClick={() => generatePDF()}>
                        Descargar PDF
                      </Button>
                      <Button variant="success" style={{ marginLeft: "10px" }} onClick={() => exportToExcel(selectedFactura)}>
                        Exportar a Excel
                      </Button>
                      <Button variant="secondary" onClick={closeModal}>
                        Cerrar
                      </Button>
                    </div>
                  </div>
                </Container>
              </div>
            </div>
          )}
          {showSendEmail && selectedFactura && confirmSendEmail && (
            <SendEmail factura={selectedFactura} onCancel={handleCancelSendEmail} />
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default GenerarFacturaModal;