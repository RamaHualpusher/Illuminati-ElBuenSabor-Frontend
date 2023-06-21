// esta factura creoq ue tengo que ver la forma de 
// que sea para visualizar nada mas como boton final en factura.tsx

import React, { useState, useEffect } from "react";
import { Pedido } from '../../interface/Pedido';
import { DetallePedido } from "../../interface/DetallePedido";
import { Usuario } from "../../interface/Usuario";
import { Domicilio } from "../../interface/Domicilio";

type GenerarFacturaModalProps = {
  show: boolean;
  handleClose: () => void;
  handleFacturaAdd: (factura: Pedido) => void;
  factura: Pedido | null;
};

const GenerarFacturaModal = (props: GenerarFacturaModalProps) => {
  const { show, handleClose, handleFacturaAdd, factura } = props;
  const [pedido, setPedidoss] = useState<Pedido>();
  const [detallePedidos, setDetallePedidos] = useState<DetallePedido[]>([]);
  const [usuario, setUsuario] = useState<Usuario>();
  const [domicilio, setDomicilio] = useState<Domicilio>();

  return (
    <div>
      <div>
        <img src="/assets/img/logo-grupo-illuminati.jpg" alt="Logo de la empresa" width={100}/>
        <div>
          El Buen Sabor
          <br />
          Dirección: Aristides villanueva 356, Ciudad
          <br />
          CUIT: 12-5541252-8
        </div>
      </div>
      <div>
        <h2>DETALLES DEL PEDIDO</h2>
        <p>Número de Pedido: {pedido?.numeroPedido}</p>
        <p>Fecha: {pedido?.fechaPedido.toString()}</p>
        <p>Forma de Pago: {pedido?.esEfectivo ? 'Efectivo' : 'Mercado Pago'}</p>
      </div>
      <div>
        <table>
          <thead>
            <tr>
              <th>Cantidad</th>
              <th>Detalle Producto</th>
              <th>Precio Unit.</th>
            </tr>
          </thead>
          <tbody>
            {detallePedidos.map((detalle) => (
              <tr key={detalle.idDetallePedido}>
                <td>{detalle.cantidad}</td>
                <td>{detalle.Producto.nombre}</td>
                <td>{detalle.Producto.precio}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3}>Total: {pedido?.totalPedido}</td>
            </tr>
          </tfoot>
        </table>
        <div>
          Tipo de Pago: {pedido?.esEfectivo ? 'Efectivo' : 'Mercado Pago'}
          <br />
          Descuento: {/* Agrega el descuento */}
          <br />
          Envío: {pedido?.esDelivery ? 'Envio domicilio' : 'Retiro local'}
          <br />
          Total a pagar: {pedido?.totalPedido}
        </div>
      </div>
      <div>
        <h2>Envío</h2>
        <p>
          Dirección: {usuario?.Domicilio.calle} {usuario?.Domicilio.numero},{' '}
          {usuario?.Domicilio.localidad}
        </p>
      </div>
      <div>
        <p>
          Muchas gracias {usuario?.nombre}, {usuario?.apellido} por comprar en
          <br />
          El Buen Sabor
        </p>
      </div>
      <div>
        <button className="btn btn-primary">Descarga</button>
        <button className="btn btn-primary">Nota de Crédito</button>
        <button className="btn btn-primary">Compartir</button>
      </div>
    </div>
  );
};

export default GenerarFacturaModal;
