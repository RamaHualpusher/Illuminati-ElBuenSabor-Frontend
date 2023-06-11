import React, { useContext } from 'react';
import { CartContext } from './CartProvider';
import { ProductoManufacturado } from '../../interface/ProductoManufacturado';
import { ProductoManufacturadoVenta } from '../../interface/ProductoManufacturadoVenta';

interface CartItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  image: string;
  title: string;
  productoManufacturado?: ProductoManufacturado;
  productoManufacturadoVenta?: ProductoManufacturadoVenta;
}

interface CartItemProps {
  item: CartItem;
}

export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { removeFromCart, incrementItem, decrementItem } = useContext(CartContext);

  return (
    <div className="d-flex align-items-start">
      <div>
        <img src={item.image} alt={item.name} className="img-fluid rounded-circle me-2" style={{width: '50px', height: '50px'}} />
      </div>
      <div>
        <h3 className="h5">{item.name}</h3>
        <p className="small mb-1">
          <button className="btn btn-sm btn-outline-secondary" onClick={() => decrementItem(item.id)}>-</button>
          Cantidad: {item.quantity}
          <button className="btn btn-sm btn-outline-secondary" onClick={() => incrementItem(item.id)}>+</button>
        </p>
        <button className="btn btn-sm btn-outline-danger" onClick={() => removeFromCart(item.id)}>
          <i className="bi bi-trash"></i>
        </button>
      </div>
    </div>
  );
};

export default CartItem;