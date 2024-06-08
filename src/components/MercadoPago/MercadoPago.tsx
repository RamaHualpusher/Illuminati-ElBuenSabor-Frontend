import { useState } from 'react';
import { IPedidoDto } from '../../interface/IPedido';
import axios from 'axios';
import { IMercadoPagoDatos } from '../../interface/IMercadoPagoDatos';

const API_URL = process.env.REACT_APP_API_URL || "";
const MP_ACCESS_TOKEN = process.env.REACT_APP_MP_ACCESS_TOKEN || ""; 

/*const MercadoPago = (pedidoCompleto: IPedidoDto) => {
  const [preferenceId, setPreferenceId] = useState<number | null>(null);

  const handleConfirmarPedido = async () => {
    if (pedidoCompleto !== null) {
      try {        
        const response = await axios.post(`${API_URL}mercado-pago-dato`, {
          pedido: pedidoCompleto,
          preference: {
            items: pedidoCompleto.detallesPedidos.map((detalle) => ({
              title: detalle.producto.nombre,
              quantity: detalle.cantidad,
              currency_id: 'ARS',
              unit_price: detalle.producto.precio,
            })),
            back_urls: {
              success: 'http://localhost:3000/pago-exitoso',
              failure: 'http://localhost:3000/pago-fallido',
              pending: 'http://localhost:3000/pago-pendiente',
            },
            auto_return: 'approved',
            notification_url: 'http://localhost:8080/api/mercado-pago-dato',
            external_reference: '77314873',
          },
        }, {
          headers: {
            Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
          },
        });

        if (response.status === 201) {
          const data = response.data;
          if (data.id) {
            setPreferenceId(data.id);
            window.location.href = data.init_point;
          } else {
            console.error('Error: ID de preferencia de pago es undefined');
          }
        } else {
          console.error('Error al crear preferencia de pago en Mercado Pago:', response.statusText);
        }
      } catch (error) {
        console.error('Error al crear preferencia de pago en Mercado Pago:', error);
      }
    }
  };

  return { handleConfirmarPedido, preferenceId };
};*/

const MercadoPago =(pedido:IPedidoDto)=>{
  const handleConfirmarPedido=async()=>{
    if(pedido!=null){
      try{
        const response =await axios.post(`${API_URL}/pedido/mercadoPagoPre`,pedido);

        const preference:IMercadoPagoDatos={
          fechaCreacion:response.data.fechaCreacion,
          estado:response.data.estado,
          preferenceId:response.data.preferenceId,
          pedido: response.data.pedido
        };
      }catch(e){
        console.log("Verga"+e);
      }
    }
  }
}

export default MercadoPago;
