import React from "react";
import "./GenerarFacturaModal.css";
import { Pedido } from "../../interface/Pedido";

interface FacturaPDFProps {
  pedido:Pedido;
}

const FacturaPDF: React.FC<FacturaPDFProps> = ({ pedido }) => {
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
  return (
    <div className="modal-overlay">
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
            <div>Número de Pedido: {numeroPedido}</div>
            <div>Fecha: {fechaPedido?.toLocaleString()}</div>
            <div>Forma de Pago: {esEfectivo ? "Efectivo" : "Mercado Pago"}</div>
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
                {DetallePedido?.map((detalle) => (
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
                    Total: ${totalPedido}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div className="payment-container">
            <div className="left-section" style={{ textAlign: "left" }}>
              <div>
                Tipo de Pago: {esEfectivo ? "Efectivo" : "Mercado Pago"}
                <br/>
                Descuento: 
                <br/>
                 Envío: {esDelivery ? "Envío domicilio" : "Retiro local"} 
              </div>
              <div>Total a pagar: ${totalPedido}</div>
            </div>
            <div className="right-section">
              <div>Envío</div>
              <div>
                <p>
                Dirección: {Usuario?.Domicilio?.calle} {Usuario?.Domicilio?.numero},
                  <br />
                  {Usuario?.Domicilio?.localidad}
                </p>
              </div>
            </div>
          </div>
          <div
            className="thankyou-container"
            style={{ textAlign: "center" }}
          >
            <p>
            Muchas gracias {Usuario?.nombre} {Usuario?.apellido} por comprar en
              <br />
              El Buen Sabor
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacturaPDF;
