import React, { useState } from "react";
import { DetallePedido } from "../../interface/DetallePedido";
import { Usuario } from "../../interface/Usuario";
import { Domicilio } from "../../interface/Domicilio";
import "./GenerarFacturaModal.css";
import { useLocation } from "react-router-dom";

interface FacturaPDFProps {
  detallePedidos: DetallePedido[];
  usuario: Usuario | undefined;
  domicilio: Domicilio | undefined;
  numeroPedido: number;
  fechaPedido: Date | undefined;
  esEfectivo: boolean;
  totalPedido: number;
}

const FacturaPDF: React.FC<FacturaPDFProps> = ({
}) => {
  const location = useLocation();
  const [detallePedidos, setDetallePedidos] = useState<DetallePedido[]>([]);
  const pedidoParam = location.pathname.split("/factura/")[1];
  const pedido = pedidoParam ? JSON.parse(decodeURIComponent(pedidoParam)) : null;
  const [usuario, setUsuario] = useState<Usuario>();

  return (
    <div className="modal-content">
      <div className="logo-container">
        <img src="/assets/img/logo-grupo-illuminati.jpg" alt="Logo" width={100} />
      </div>
      <div className="info-container">
        <div>El Buen Sabor</div>
        <div>Dirección: Aristides villanueva 356, Ciudad</div>
        <div>CUIT: 12-5541252-8</div>
      </div>
      <div className="details-container">
        <div>DETALLES DEL PEDIDO</div>
        <div>Número de Pedido: {pedido.numeroPedido}</div>
        <div>Fecha: {pedido.fechaPedido?.toLocaleString()}</div>
        <div>Forma de Pago: {pedido.esEfectivo ? "Efectivo" : "Mercado Pago"}</div>
      </div>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <div>Cantidad</div>
              <div>Detalle Producto</div>
              <div>Precio Unit.</div>
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
              <td colSpan={3} style={{ textAlign: "right" }}>
                Total: ${pedido.totalPedido}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="payment-container">
        <div className="left-section" style={{ textAlign: "left" }}>
          <div>
            Tipo de Pago: {pedido.esEfectivo ? "Efectivo" : "Mercado Pago"}
            <br />
            Descuento: {/* Agrega el descuento */}
            <br />
            Envío: {pedido.esDelivery ? "Envío domicilio" : "Retiro local"}
          </div>
          <div>Total a pagar: ${pedido.totalPedido}</div>
        </div>
        <div className="right-section">
          <div>Envío</div>
          <div>
            <p>
              Dirección: {usuario?.Domicilio?.calle} {usuario?.Domicilio?.numero},
              <br />
              {usuario?.Domicilio?.localidad}
            </p>
          </div>
        </div>
      </div>
      <div className="thankyou-container" style={{ textAlign: "center" }}>
        <p>
          Muchas gracias {usuario?.nombre} {usuario?.apellido} por comprar en
          <br />
          El Buen Sabor
        </p>
      </div>
    </div>
  );
};

export default FacturaPDF;
