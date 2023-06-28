import React from "react";
import { DetallePedido } from "../../interface/DetallePedido";
import { Usuario } from "../../interface/Usuario";
import { Domicilio } from "../../interface/Domicilio";

interface FacturaPDFProps {
  detallePedidos: DetallePedido[];
  usuario: Usuario | undefined;
  domicilio: Domicilio | undefined;
  pedidoNumero: number;
  fechaPedido: Date | undefined;
  esEfectivo: boolean;
  totalPedido: number;
}

const FacturaPDF: React.FC<FacturaPDFProps> = ({
  detallePedidos,
  usuario,
  domicilio,
  pedidoNumero,
  fechaPedido,
  esEfectivo,
  totalPedido,
}) => {
  return (
    <div className="pdf-container">
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
        <p>Número de Pedido: {pedidoNumero}</p>
        <p>Fecha: {fechaPedido?.toLocaleString()}</p>
        <p>Forma de Pago: {esEfectivo ? "Efectivo" : "Mercado Pago"}</p>
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
              <td style={{ textAlign: "right" }} colSpan={3}>
                Total: {totalPedido}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="payment-container">
        <div className="left-section" style={{ textAlign: "left" }}>
          <p>
            Tipo de Pago: {esEfectivo ? "Efectivo" : "Mercado Pago"}
            <br />
            Descuento: {/* Agrega el descuento */}
            <br />
            Envío: {domicilio ? "Envío domicilio" : "Retiro local"}
          </p>
          <p>Total a pagar: {totalPedido}</p>
        </div>
        <div className="right-section">
          <h2>Envío</h2>
          <p>
            Dirección: {domicilio?.calle} {domicilio?.numero},{" "}
            {domicilio?.localidad}
          </p>
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
