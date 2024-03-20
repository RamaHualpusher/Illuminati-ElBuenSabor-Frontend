import React, { useContext } from 'react';
import { CartContext } from '../../context/cart/CartProvider';
import { IDetallePedido } from '../../interface/IDetallePedido';
import { IProducto } from '../../interface/IProducto';

interface CartItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  image: string;
  title: string;
  Producto?: IProducto;
}

interface CartItemProps {
  item: CartItem & { DetallePedido: IDetallePedido };
}

/**
 * Componente para representar un artículo en el carrito de compras.
 * 
 * @param {CartItemProps} props - Propiedades del componente.
 * @param {CartItem} props.item - Información del artículo en el carrito.
 */
export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { removeFromCart, incrementItem, decrementItem } = useContext(CartContext);

  const unitPrice = item.price;
  const subtotal = item.price * item.quantity;

  const handleDecrement = () => {
    if (item.quantity > 1) {
      decrementItem(item.id);
    }
  };

  return (
    <div className="d-flex align-items-start w-100">
      <div>
        <img src={item.image} alt={item.name} className="img-fluid rounded-circle me-2" style={{ width: "50px", height: "50px" }} />
      </div>
      <div className="flex-grow-1">
        <div className='d-flex justify-content-between align-items-center'>
          <h3 className="h5 flex-grow-1">{item.name}</h3>
          <p>Unitario: ${unitPrice}</p>
        </div>
        <div className='d-flex justify-content-between align-items-center'>
          <p>Subtotal: ${subtotal}</p>
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <button className="btn btn-sm btn-outline-secondary mx-1" onClick={handleDecrement}>
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