// esta factura creoq ue tengo que ver la forma de 
// que sea para visualizar nada mas como boton final en factura.tsx

import React, { useState, useEffect } from "react";
import { Pedido } from '../../interface/Pedido';
import { DetallePedido } from "../../interface/DetallePedido";
import { Usuario } from "../../interface/Usuario";
import { Domicilio } from "../../interface/Domicilio";
import { useParams } from "react-router-dom";
import { handleRequest } from "../FuncionRequest/FuncionRequest";
import AdminBar from "../NavBar/AdminBar";
import FacturaPDF from "./FacturaPDF ";
import { PDFViewer } from "@react-pdf/renderer";

const GenerarFacturaModal: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [pedido, setPedidos] = useState<Pedido>();
  const [detallePedidos, setDetallePedidos] = useState<DetallePedido[]>([]);
  const [usuario, setUsuario] = useState<Usuario>();
  const [domicilio, setDomicilio] = useState<Domicilio>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const responseData = await handleRequest('GET', 'assets/data/pedidos.json');
          const pedidos: Pedido[] = responseData;
          setPedidos(pedidos.find((pedido: Pedido) => pedido.idPedido === parseInt(id)))
          if (pedido)
            setUsuario(pedido.Usuario);
          if (usuario)
            setDomicilio(usuario.Domicilio);
          setDetallePedidos(pedido?.DetallePedido || []);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);


  return (
    <div style={{ marginTop: "5rem" }}>
      <AdminBar />
      <center>
        <div style={{ border: '1px solid black', borderRadius: '10px', padding: '10px', width: '400px' }}>
          <img src="/assets/img/logo-grupo-illuminati.jpg" alt="Logo de la empresa" width={100} />
          <div style={{ textAlign: 'left', marginBottom: '10px' }}>
            El Buen Sabor
            <br />
            Dirección: Aristides villanueva 356, Ciudad
            <br />
            CUIT: 12-5541252-8
          </div>
          <div style={{ border: '1px solid black', borderRadius: '10px', padding: '10px', textAlign: 'left', marginBottom: '10px' }}>
            <h2>DETALLES DEL PEDIDO</h2>
            <p>Número de Pedido: {pedido?.numeroPedido}</p>
            <p>Fecha: {pedido?.fechaPedido.toString()}</p>
            <p>Forma de Pago: {pedido?.esEfectivo ? 'Efectivo' : 'Mercado Pago'}</p>
          </div>
          <div style={{ border: '1px solid black', borderRadius: '10px', padding: '10px', marginBottom: '10px' }}>
            <table>
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
                    <td>{detalle?.Producto.nombre}</td>
                    <td>{detalle?.Producto.precio}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3}>Total: {pedido?.totalPedido}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div style={{ border: '1px solid black', borderRadius: '10px', padding: '10px', textAlign: 'right', marginBottom: '10px' }}>
            Tipo de Pago: {pedido?.esEfectivo ? 'Efectivo' : 'Mercado Pago'}
            <br />
            Descuento: {/* Agrega el descuento */}
            <br />
            Envío: {pedido?.esDelivery ? 'Envío domicilio' : 'Retiro local'}
            <br />
            Total a pagar: {pedido?.totalPedido}
          </div>
          <div style={{ textAlign: 'left', marginBottom: '10px' }}>
            <h2>Envío</h2>
            <p>
              Dirección: {usuario?.Domicilio.calle} {usuario?.Domicilio.numero},{' '}
              {usuario?.Domicilio.localidad}
            </p>
          </div>
          <div style={{ border: '1px solid black', borderRadius: '10px', padding: '10px', textAlign: 'justify', marginBottom: '10px' }}>
            <p>
              Muchas gracias {usuario?.nombre} {usuario?.apellido} por comprar en
              <br />
              El Buen Sabor
            </p>
          </div>
          <div>
            <PDFViewer>
              <FacturaPDF pedido={pedido} detallePedidos={detallePedidos} usuario={usuario} />
            </PDFViewer>
            <button className="btn btn-primary">Nota de Crédito</button>
            <button className="btn btn-primary">Compartir</button>
          </div>

        </div>
      </center>
    </div>

  );
};

export default GenerarFacturaModal;
