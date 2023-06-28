import React, { useEffect, useState } from "react";
import { DetallePedido } from "../../interface/DetallePedido";
import { Usuario } from "../../interface/Usuario";
import { Domicilio } from "../../interface/Domicilio";
import AdminBar from "../NavBar/AdminBar";
import { PDFViewer } from "@react-pdf/renderer";
import FacturaPDF from "./FacturaPDF ";
import { useLocation } from "react-router-dom";


interface GenerarFacturaModalProps {
  // Modifica la prop para que sea obligatoria
  closeModal: () => void; // Agrega la función closeModal para cerrar el modal
}

const GenerarFacturaModal: React.FC<GenerarFacturaModalProps> = ({  
  closeModal,
}) => {
  const [detallePedidos, setDetallePedidos] = useState<DetallePedido[]>([]);
  const [usuario, setUsuario] = useState<Usuario>();
  const [domicilio, setDomicilio] = useState<Domicilio>();
  const location = useLocation();
  const pedidoParam = location.pathname.split("/factura/")[1];
  const pedido = pedidoParam ? JSON.parse(decodeURIComponent(pedidoParam)) : null;

  useEffect(() => {
    if (pedido) {
      setDetallePedidos(pedido.DetallePedido || []);
      setUsuario(pedido.Usuario);
      if (pedido.Usuario) {
        setDomicilio(pedido.Usuario.Domicilio);
      }
    }
  }, [pedido]);

  if (!pedido) {
    return <div>Error: Pedido no encontrado</div>;
  }

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <AdminBar />
        <div className="modal-content">
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
            <p>Número de Pedido: {pedido.numeroPedido}</p>
            <p>Fecha: {pedido.fechaPedido?.toLocaleString()}</p>
            <p>
              Forma de Pago: {pedido.esEfectivo ? "Efectivo" : "Mercado Pago"}
            </p>
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
                  <td colSpan={3}>Total: {pedido.totalPedido}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div className="payment-container">
            <p>
              Tipo de Pago: {pedido.esEfectivo ? "Efectivo" : "Mercado Pago"}
              <br />
              Descuento: {/* Agrega el descuento */}
              <br />
              Envío: {pedido.esDelivery ? "Envío domicilio" : "Retiro local"}
              <br />
              Total a pagar: {pedido.totalPedido}
            </p>
          </div>
          <div className="shipping-container">
            <h2>Envío</h2>
            <p>
              Dirección: {usuario?.Domicilio?.calle} {usuario?.Domicilio?.numero},{" "}
              {usuario?.Domicilio?.localidad}
            </p>
          </div>
          <div className="thankyou-container">
            <p>
              Muchas gracias {usuario?.nombre} {usuario?.apellido} por comprar en
              <br />
              El Buen Sabor
            </p>
          </div>
          <div className="pdf-container">
            <PDFViewer>
              <FacturaPDF
                pedido={pedido}
                detallePedidos={detallePedidos}
                usuario={usuario}
              />
            </PDFViewer>
          </div>
          <div className="buttons-container">
            <button className="btn btn-primary" onClick={closeModal}>
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerarFacturaModal;
