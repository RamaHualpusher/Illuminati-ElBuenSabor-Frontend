import React, { useEffect, useState } from "react";
import { IFactura } from "../../interface/IFactura";
import { Button, Container, Modal, Table } from "react-bootstrap";
import FacturaPDF from "./FacturaPDF";
import GenerarCreditoModal from "./GenerarCreditoModal";
import { exportTableDataToExcel } from '../../util/exportTableDataToExcel';
import { IDetallePedidoDto } from "../../interface/IDetallePedido";
import axios from 'axios';
import { IDetalleFactura } from "../../interface/IDetalleFactura";

interface GenerarFacturaModalProps {
  factura: IFactura | null,
  closeModal: () => void;
  show: boolean;
}

const GenerarFacturaModal: React.FC<GenerarFacturaModalProps> = ({ factura, closeModal, show }) => {
  const [showCreditoModal, setShowCreditoModal] = useState(false);
  const [selectedFactura, setSelectedFactura] = useState<IFactura | null>();
  const [userInfo, setUserInfo] = useState<any>(null); // IUsuario acordate
  const API_URL = process.env.REACT_APP_API_URL || "";

  useEffect(() => {
    // Verificar que la factura no sea null y que esFactura sea true
    if (factura) { //aca borre en la verificacion "&& factura.esFactura"
      setSelectedFactura(factura);
      getUserInfo();
    }
  }, [factura]);

  const getUserInfo = async () => {
    try {
      const response = await axios.get(`${API_URL}usuario/clientes`);
      const userInfo = response.data;
      return userInfo;
    } catch (error) {
      console.error('Error al obtener la información del usuario:', error);
      throw error;
    }
  };

  const handleCredito = () => {
    if (selectedFactura && window.confirm("¿Estás seguro de generar la Nota de Crédito?")) {
      setShowCreditoModal(true);
    }
  };

  const exportToExcel = (factura: IFactura) => {
    const dataToExport = factura?.detalleFactura || [];
    const filename = `Pedido ${factura?.usuario?.nombre} ${factura?.usuario?.apellido}-Num.${factura?.id}_detalles`;
    exportTableDataToExcel(dataToExport, filename);
  };

  const getOrDefault = (value: any, defaultValue: any) => {
    return value !== null && value !== undefined ? value : defaultValue;
  };

  const calcularTotalPedido = (selectedFactura: IFactura) => {
    let total = 0;

    selectedFactura.detalleFactura.forEach((detalle: IDetalleFactura) => {
      detalle.productos.forEach((producto) => {
        total += producto.precio * detalle.cantidad;
      });
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
    sendEmail(userInfo.email, selectedFactura);
    closeModal();
  };

  const sendEmail = async (email: string, factura: IFactura) => {
    try {
      // Envío de correo electrónico utilizando la API de Gmail
      const response = await axios.post(`${API_URL}factura/guardar`, { //aca deberia ser guardar
        email: email,
        subject: 'Factura de tu compra en El Buen Sabor', // poner nombre y apellido usuario
        message: `Adjunto encontrarás la factura de tu compra en formato PDF. Gracias por elegir El Buen Sabor.`,
        attachment: FacturaPDF(factura)
      });
      console.log('Correo electrónico enviado correctamente');
    } catch (error) {
      console.error('Error al enviar el correo electrónico:', error);
      throw error;
    }
  };

  return (
    <>
      <Modal show={show} onHide={closeModal} size="lg">
        <Modal.Body>
          {selectedFactura && (
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
                      <p>Número de Pedido: {getOrDefault(selectedFactura.id, "")}</p>
                      <p>Fecha: {getOrDefault(new Date(selectedFactura.fechaPedido).toLocaleString(), "")}</p>
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
                            detalle.productos.map((producto, productoIndex) => ( // Itera sobre los productos de cada detalle
                              <tr key={`${index}-${productoIndex}`}>
                                <td>{getOrDefault(detalle.cantidad, "")}</td>
                                <td>{producto.nombre}</td>
                                <td>{producto.precio}</td>
                              </tr>
                            ))
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
                          {/* Envío: {getOrDefault(selectedFactura.esDelivery ? "Domicilio" : "Retiro local", "")} */}
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
                    <div className="pdf-container">
                      <div className="pdf-container">
                        <Button variant="primary" style={{ marginRight: "10px" }} onClick={() => generatePDF()}>
                          Descargar PDF
                        </Button>
                        <Button variant="secondary" onClick={handleCredito}>
                          Nota de Crédito
                        </Button>
                        <Button variant="success" style={{ marginLeft: "10px" }} onClick={() => exportToExcel(selectedFactura)}>
                          Exportar a Excel
                        </Button>
                      </div>
                    </div>
                  </div>
                </Container>
              </div>
            </div>
          )}
          {/* {showCreditoModal && (
            <GenerarCreditoModal
              closeModal={() => setShowCreditoModal(false)}
              factura={selectedFactura}
              show={show} />
          )} */}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default GenerarFacturaModal;
