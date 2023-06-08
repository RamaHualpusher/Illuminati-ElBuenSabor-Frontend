import React, { useContext } from 'react';
import { CartContext } from './CartProvider';

interface CartItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  image: string;
  title: string;
}

interface CartItemProps {
  item: CartItem;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { removeFromCart } = useContext(CartContext);

  return (
    <div className="cart-item">
      <img src={item.image} alt={item.name} className="cart-item__image" />
      <div className="cart-item__details">
        <h3 className="cart-item__name">{item.name}</h3>
        <p className="cart-item__title">{item.title}</p>
        <p className="cart-item__quantity">Quantity: {item.quantity}</p>
        <p className="cart-item__price">Price: ${item.price}</p>
        <button className="cart-item__remove" onClick={() => removeFromCart(item.id)}>
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;


