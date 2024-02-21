import React, { useState, useEffect } from 'react';
import { IPedido } from '../../interface/IPedido';
import { useAuth0 } from '@auth0/auth0-react';
import { MercadoPagoConfig } from 'mercadopago';

//entiendo que hay que utilizar axios para plicar este metodo con post en la base de datos
//una vez que mercado pago apruebe la compra
const API_URL = process.env.REACT_APP_API_URL || "";

export const MercadoPago = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pedidoCompleto, setPedidoCompleto] = useState<IPedido | null>(null);
  const { getAccessTokenSilently } = useAuth0();
  const [preferenceId, setPreferenceId] = useState(null);
  const token = process.env.REACT_APP_API_MP_TOKEN || "";
  const url: string = process.env.VITE_BACKEND_API_URL || ""; //(hay que agregar en ENV el link a el backend)
  const client = new MercadoPagoConfig({ accessToken: token });

  const handleConfirmarPedido = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setShowAlert(true);
      return;
    }

    if (pedidoCompleto !== null) {
      try {
        // Aquí obtenemos el token de Auth0 antes de hacer la solicitud a Mercado Pago
        const accesToken = await getAccessTokenSilently();
        // Verificar que se obtenga un token antes de continuar
        if (!accesToken) {
          console.error('No se pudo obtener el token de Auth0.');
          return;
        }

        const response = await fetch('confirmar-pedido', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accesToken}`,
          },
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
              external_reference: pedidoCompleto.numeroPedido.toString(),
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

