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
    numeroPedido,
    fechaPedido,
    esEfectivo,
    totalPedido,
    Usuario,
    DetallePedido,
  } = pedido;

  // Función para verificar si un valor está presente o proporcionar un valor predeterminado
  const getOrDefault = (value: any, defaultValue: any) => {
    return value !== null && value !== undefined ? value : defaultValue;
  };

  return (
    <div className="mt-5">
      <Container fluid>
        <div className="border p-4 bg-white">
          <div className="row">
            {/* Logo */}
            <div className="col-md-3">
              <img
                src="/assets/img/logo-grupo-illuminati.jpg"
                alt="Logo"
                className="img-fluid"
              />
            </div>
            {/* Detalles del Restaurante */}
            <div className="col-md-6 text-center">
              <h3 className="mb-0">El Buen Sabor</h3>
              <p className="mb-0">Dirección: Aristides villanueva 356, Ciudad</p>
              <p className="mb-0">CUIT: 12-5541252-8</p>
            </div>
            {/* Detalles del Pedido */}
            <div className="col-md-3">
              <div className="text-end">
                <h5 className="mb-0">DETALLES DEL PEDIDO</h5>
                <p className="mb-0">Número de Pedido: {getOrDefault(numeroPedido, "")}</p>
                <p className="mb-0">Fecha: {getOrDefault(new Date(fechaPedido).toLocaleString(), "")}</p>
                <p className="mb-0">Forma de Pago: {esEfectivo ? "Efectivo" : "Mercado Pago"}</p>
              </div>
            </div>
          </div>
          {/* Detalles del Pedido */}
          <div className="table-container">
            <Table striped bordered>
              <thead>
                <tr>
                  <th>Cantidad</th>
                  <th>Detalle Producto</th>
                  <th>Precio Unit.</th>
                </tr>
              </thead>
              <tbody>
                {DetallePedido && DetallePedido.length > 0 && DetallePedido.map((detalle) => (
                  <tr key={detalle?.idDetallePedido}>
                    <td>{getOrDefault(detalle?.cantidad, "")}</td>
                    <td>
                      <ul>
                        {Array.isArray(detalle?.Productos) ? detalle?.Productos?.map((producto) => (
                          <li key={producto?.idProducto}>
                            {getOrDefault(producto?.nombre, "")}
                          </li>
                        )) : ""}
                      </ul>
                    </td>
                    <td>
                      <ul>
                        {Array.isArray(detalle?.Productos) ? detalle?.Productos.map((producto) => (
                          <li key={producto?.idProducto}>
                            {getOrDefault(producto?.precio, "")}
                          </li>
                        )) : ""}
                      </ul>
                    </td>
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
          {/* Detalles del Pago y Envío */}
          <div className="payment-container">
            <div className="left-section" style={{ textAlign: "left" }}>
              <div>
                Tipo de Pago: {esEfectivo ? "Efectivo" : "Mercado Pago"}
                <br />
                Descuento:
                <br />
                Envío: {pedido.esDelivery ? "Envío domicilio" : "Retiro local"}
              </div>
              <div>Total a pagar: ${getOrDefault(totalPedido, "")}</div>
            </div>
            <div className="right-section">
              <div>Envío</div>
              <div>
                <p>
                  Dirección: {getOrDefault(Usuario?.Domicilio?.calle, "")} {getOrDefault(Usuario?.Domicilio?.numero, "")},
                  <br />
                  {getOrDefault(Usuario?.Domicilio?.localidad, "")}
                </p>
              </div>
            </div>
          </div>
          {/* Mensaje de Agradecimiento */}
          <div className="thankyou-container" style={{ textAlign: "center" }}>
            <p>
              Muchas gracias {getOrDefault(Usuario?.nombre, "")} {getOrDefault(Usuario?.apellido, "")} por comprar en
              <br />
              El Buen Sabor
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default FacturaPDF;
