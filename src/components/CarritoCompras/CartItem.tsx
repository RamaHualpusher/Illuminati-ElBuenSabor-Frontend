import React, { useContext } from 'react';
import { CartContext } from './CartProvider';
import { Producto } from '../../interface/Producto';
import { DetallePedido } from '../../interface/DetallePedido';

interface CartItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  image: string;
  title: string;
  Producto?: Producto;
}

interface CartItemProps {
  item: CartItem & { DetallePedido: DetallePedido };
}

export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { removeFromCart, incrementItem, decrementItem } = useContext(CartContext);

  return (
    <div className="d-flex align-items-start w-100">
      <div>
        <img src={item.image} alt={item.name} className="img-fluid rounded-circle me-2" style={{ width: "50px", height: "50px" }} />
      </div>
      <div className="flex-grow-1">
        <div className='d-flex justifi-content-between align-items-center'>
          <h3 className="h5 flex-grow-1">{item.name}</h3>
          <p>${item.price * item.quantity}</p>
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <button className="btn btn-sm btn-outline-secondary mx-1" onClick={() => decrementItem(item.id)}>
              -
            </button>
            <button className="btn btn-sm btn-outline-secondary mx-1 px-3 p-2" disabled>
              <span className="h6">{item.quantity}</span>
            </button>
            <button className="btn btn-sm btn-outline-secondary mx-1" onClick={() => incrementItem(item.id)}>
              +
            </button>
          </div>
          <button className="btn btn-sm btn-outline-danger" onClick={() => removeFromCart(item.id)}>
            <i className="bi bi-trash"></i>
          </button>
        </div>
      </div>

    </div>
  );
};

export default CartItem;