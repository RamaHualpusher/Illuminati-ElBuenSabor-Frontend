import React, { useContext, useState } from 'react';
import { CartContext } from './CartProvider';
import ConfirmacionPedido from './ConfirmacionPedido';
import { useNavigate } from 'react-router-dom';

const CarritoConConfirmacion: React.FC = () => {
  // Obtener el contexto del carrito
  const { cartItems, removeFromCart, incrementItem, decrementItem, clearCart } = useContext(CartContext);

  // Navegación
  const navigate = useNavigate();

  // Estados locales para el método de pago y tipo de envío
  const [metodoPago, setMetodoPago] = useState('Efectivo');
  const [tipoEnvio, setTipoEnvio] = useState('Delivery');

  // Función para modificar la cantidad de un ítem en el carrito
  const modificarCantidad = (id: number, cantidad: number) => {
    const item = cartItems.find(item => item.id === id);
    if (item) {
      if (cantidad > item.quantity) {
        incrementItem(id);
      } else if (cantidad < item.quantity) {
        decrementItem(id);
      }
    }
  };

  // Función para cancelar y vaciar el carrito
  const onCancel = () => {
    clearCart();
    navigate("/");
  }

  // Función para continuar con la compra y regresar a la página principal
  const onContinue = () => {
    navigate("/");
  }

  return (
    <>
      {/* Renderizar el componente de confirmación de pedido */}
      <ConfirmacionPedido
        cartItems={cartItems}
        metodoPago={metodoPago}
        tipoEnvio={tipoEnvio}
        setMetodoPago={setMetodoPago}
        setTipoEnvio={setTipoEnvio}
        modificarCantidad={modificarCantidad}
        eliminarDetallePedido={id => {
          removeFromCart(id);
        }}
        onCancel={onCancel}
        onContinue={onContinue}
      />
    </>
  );
}

export default CarritoConConfirmacion;
