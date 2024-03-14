import { useState } from 'react';
import { IPedidoDto } from '../../interface/IPedido';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || "";
const MP_ACCESS_TOKEN = process.env.REACT_APP_MP_ACCESS_TOKEN || ""; // Tu Access Token de Mercado Pago

export const MercadoPago = (pedidoCompleto: IPedidoDto) => {
  const [preferenceId, setPreferenceId] = useState<number | null>(null);

  const handleConfirmarPedido = async () => {
    if (pedidoCompleto !== null) {
      try {        
        const response = await axios.post(`${API_URL}/mercado-pago-preference`, {
          pedido: pedidoCompleto,
          preference: {
            items: pedidoCompleto.detallesPedidos.map((detalle) => ({
              title: detalle.producto.nombre,
              quantity: detalle.cantidad,
              currency_id: 'ARS', // Moneda (en este caso, pesos argentinos)
              unit_price: detalle.producto.precio,
            })),
            back_urls: {
              success: 'http://localhost:3000/pago-exitoso',
              failure: 'http://localhost:3000/pago-fallido',
              pending: 'http://localhost:3000/pago-pendiente',
            },
            auto_return: 'approved',
            // notification_url: 'https://tu-sitio.com/mercado-pago-notificaciones', // URL para recibir notificaciones de Mercado Pago
            notification_url: 'http://localhost:3000/mercado-pago-notificaciones',
            external_reference: 'tu-id-de-usuario', // ID de usuario para identificar la transacción
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
            // Redireccionar al usuario a la página de pago de Mercado Pago
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

  return { handleConfirmarPedido, preferenceId: preferenceId || null };
};
