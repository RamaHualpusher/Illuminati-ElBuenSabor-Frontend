import React, { useContext, useState } from 'react';
import { CartContext } from './CartProvider';
import ConfirmacionPedido from './ConfirmacionPedido';
import { useNavigate } from 'react-router-dom';
const CarritoConConfirmacion: React.FC = () => {
    const { cartItems, removeFromCart, incrementItem, decrementItem, clearCart } = useContext(CartContext);
    const navigate = useNavigate();
  const [metodoPago, setMetodoPago] = useState('Efectivo');
  const [tipoEnvio, setTipoEnvio] = useState('Delivery');

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
  const onCancel = () => {
    clearCart();
    navigate("/");
  }
  
  const onContinue = () => {
    navigate("/");
  }

  return (
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
  );
}

export default CarritoConConfirmacion;
