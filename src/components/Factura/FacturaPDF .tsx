import React from "react";
import { Pedido } from "../../interface/Pedido";
import { Container, Table } from "react-bootstrap";

interface FacturaPDFProps {
  pedido: Pedido | null;
}

const FacturaPDF: React.FC<FacturaPDFProps> = ({ pedido }) => {
  
  if (!pedido) {
    return <div>Error: Pedido no encontrado</div>; // Agrega una verificación si pedido es null o undefined
  }

  const {
    idPedido,
    numeroPedido,
    fechaPedido,
    horaEstimadaFin,
    esEfectivo,
    estadoPedido,
    esDelivery,
    totalPedido,
    Usuario,
    DetallePedido,
  } = pedido;

  // Función para verificar si un valor está presente o proporcionar un valor predeterminado
  const getOrDefault = (value: any, defaultValue: any) => {
    return value !== null && value !== undefined ? value : defaultValue;
  };

  return (
    <div className="modal-overlay">
      <Container fluid>
      <div className="modal-container border-black">
        <div className="modal-content">
          <div className="logo-container">
            <img
              src="/assets/img/logo-grupo-illuminati.jpg"
              alt="Logo"
              width={100}
            />
          </div>
          <div className="info-container">
            <div>El Buen Sabor</div>
            <div>Dirección: Aristides villanueva 356, Ciudad</div>
            <div>CUIT: 12-5541252-8</div>
          </div>
          <div className="details-container">
            <div>DETALLES DEL PEDIDO</div>
            <div>Número de Pedido: {getOrDefault(numeroPedido,"")}</div>
            <div>Fecha: {getOrDefault(fechaPedido?.toLocaleString(),"")}</div>
            <div>Forma de Pago: {esEfectivo ? "Efectivo" : "Mercado Pago"}</div>
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
                {DetallePedido?.map((detalle) => (
                  <tr key={detalle?.idDetallePedido}>
                    <td>{getOrDefault(detalle?.cantidad, "")}</td>
                    <td>{getOrDefault(detalle?.Producto?.nombre,"")}</td>
                    <td>{getOrDefault(detalle?.Producto?.precio,"")}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} style={{ textAlign: "right" }}>
                    Total: ${getOrDefault(totalPedido, "No disponible")}
                  </td>
                </tr>
              </tfoot>
            </Table>
          </div>
          <div className="payment-container">
            <div className="left-section" style={{ textAlign: "left" }}>
              <div>
                Tipo de Pago: {esEfectivo ? "Efectivo" : "Mercado Pago"}
                <br />
                Descuento:
                <br />
                Envío: {esDelivery ? "Envío domicilio" : "Retiro local"}
              </div>
              <div>Total a pagar: ${getOrDefault(totalPedido,"")}</div>
            </div>
            <div className="right-section">
              <div>Envío</div>
              <div>
                <p>
                  Dirección: {getOrDefault(Usuario?.Domicilio?.calle,"")} {getOrDefault(Usuario?.Domicilio?.numero,"")},
                  <br />
                  {getOrDefault(Usuario?.Domicilio?.localidad,"")}
                </p>
              </div>
            </div>
          </div>
          <div
            className="thankyou-container"
            style={{ textAlign: "center" }}
          >
            <p>
              Muchas gracias {getOrDefault(Usuario?.nombre,"")} {getOrDefault(Usuario?.apellido,"")} por comprar en
              <br />
              El Buen Sabor
            </p>
          </div>
        </div>
      </div>
      </Container>
    </div>
  );
};

export default FacturaPDF;
