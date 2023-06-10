import React from 'react';
import CartItem from '../CarritoCompras/CartItem';

interface CartWindowProps {
  cartItems: CartItem[];
}

const CartWindow: React.FC<CartWindowProps> = ({ cartItems }) => {
  if (cartItems.length === 0) {
    return (
      <div className="cart-window">
        <h2 className="cart-window-title">Agregue productos al carrito de compras</h2>
      </div>
    );
  }

  return (
    <div className="cart-window" style={{ backgroundColor: "lightblue", border: "1px solid black" }}>
      {cartItems.map((item) => (
        <CartItem key={item.id} item={item} />
      ))}
    </div>
  );
};

export default CartWindow;
