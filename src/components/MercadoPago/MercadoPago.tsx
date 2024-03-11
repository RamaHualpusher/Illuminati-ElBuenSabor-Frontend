import React, { useState, useEffect } from 'react';
import { IPedido } from '../../interface/IPedido';
import { MercadoPagoConfig } from 'mercadopago';

//entiendo que hay que utilizar axios para plicar este metodo con post en la base de datos
//una vez que mercado pago apruebe la compra
const API_URL = process.env.REACT_APP_API_URL || "";

export const MercadoPago = () => {
  const [pedidoCompleto, setPedidoCompleto] = useState<IPedido | null>(null);
  const [preferenceId, setPreferenceId] = useState(null);
  const token = process.env.REACT_APP_API_MP_TOKEN || "";
  const url: string = process.env.VITE_BACKEND_API_URL || ""; //(hay que agregar en ENV el link a el backend)
  const client = new MercadoPagoConfig({ accessToken: token });

  const handleConfirmarPedido = async (e: React.FormEvent) => {
    e.preventDefault();
    

    if (pedidoCompleto !== null) {
      try {        

        const response = await fetch('confirmar-pedido', {
          method: 'POST',         
          body: JSON.stringify({
            preference: {
              email: pedidoCompleto.Usuario.email,
              nombre: pedidoCompleto.Usuario.nombre,
              apellido: pedidoCompleto.Usuario.apellido,
              items: pedidoCompleto.DetallePedido.map((detalle) => ({
                title: detalle.Productos.nombre,
                quantity: detalle.cantidad,
                currency_id: detalle.id,                
                unit_price: detalle.Productos.precio,
              })),
             // external_reference: pedidoCompleto.id.toString(),
              // back_urls: {
              //   success: 'https://www.success.com',
              //   failure: 'http://www.failure.com',
              //   pending: 'http://www.pending.com',
              // },
              auto_return: 'approved',
            },
            pedidoCompleto,
          }),
        });

        if (!response.ok) {
          const text = await response.text();
          throw new Error(`Error al generar la preferencia: ${response.statusText}. Body: ${text}`);
        }

        const data = await response.json();
        setPreferenceId(data.id);

      } catch (error) {
        console.error('Error al crear preferencia:', error);
      }
    }
  };

  function setShowAlert(arg0: boolean) {
    throw new Error('Funcion no implementada.');
  }

  return { handleConfirmarPedido, preferenceId, setPedidoCompleto }
};

