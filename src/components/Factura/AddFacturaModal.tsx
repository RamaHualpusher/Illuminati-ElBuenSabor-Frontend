// esta factura creoq ue tengo que ver la forma de 
// que sea para visualizar nada mas como boton final en factura.tsx


import { Pedido } from '../../interface/Pedido';

const AddFacturaModal = (pedido: Pedido) => {
  const { Usuario, DetallePedido, totalPedido } = pedido;

  return (
    <div>
      <div>
        <img src="/assets/img/logo-grupo-illuminati.jpg" alt="Logo de la empresa" />
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
        <p>Número de Pedido: {pedido.numeroPedido}</p>
        <p>Fecha: {pedido.fechaPedido.toString()}</p>
        <p>Forma de Pago: {pedido.esEfectivo ? 'Efectivo' : 'Mercado Pago'}</p>
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
            {DetallePedido.map((detalle) => (
              <tr key={detalle.idDetallePedido}>
                <td>{detalle.cantidad}</td>
                <td>{detalle.Producto.nombre}</td>
                <td>{detalle.Producto.precio}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3}>Total: {totalPedido}</td>
            </tr>
          </tfoot>
        </table>
        <div>
          Tipo de Pago: {pedido.esEfectivo? 'Efectivo' : 'Mercado Pago'}
          <br />
          Descuento: {/* Agrega el descuento */}
          <br />
          Envío: {pedido.esDelivery? 'Envio domicilio' : 'Retiro local'}
          <br />
          Total a pagar: {pedido.totalPedido}
        </div>
      </div>
      <div>
        <h2>Envío</h2>
        <p>
          Dirección: {Usuario.Domicilio.calle} {Usuario.Domicilio.numero},{' '}
          {Usuario.Domicilio.localidad}
        </p>
      </div>
      <div>
        <p>
          Muchas gracias {Usuario.nombre}, {Usuario.apellido} por comprar en
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

export default AddFacturaModal;
