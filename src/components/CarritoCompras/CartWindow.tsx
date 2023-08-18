import React from 'react';
import CartItem from '../CarritoCompras/CartItem';

interface CartWindowProps {
  cartItems: CartItem[];
}

/**
 * Componente que muestra los elementos en el carrito de compras.
 * 
 * @param {CartWindowProps} props - Propiedades del componente.
 */
const CartWindow: React.FC<CartWindowProps> = ({ cartItems }) => {
  if (cartItems.length === 0) {
    // Mostrar mensaje si el carrito está vacío
    return (
      <div className="cart-window">
        <h2 className="cart-window-title">Agregue productos al carrito de compras</h2>
      </div>
    );
  }

  // Mostrar elementos del carrito
  return (
    <div className="cart-window" style={{ backgroundColor: "lightblue", border: "1px solid black" }}>
      {cartItems.map((item) => (
        <CartItem key={item.id} item={item} />
      ))}
    </div>
  );
};

export default CartWindow;
