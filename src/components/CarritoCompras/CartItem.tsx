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
  const { removeFromCart } = useContext(CartContext);

  return (
    <div className="cart-item">
      <img src={item.image} alt={item.name} className="cart-item__image" />
      <div className="cart-item__details">
        <h3 className="cart-item__name">{item.name}</h3>
        <p className="cart-item__title">{item.title}</p>
        <p className="cart-item__quantity">Cantidad: {item.quantity}</p>
        <p className="cart-item__price">Price: ${item.price}</p>
        {item.productoManufacturado && (
          <div>
            <h4>Producto Manufacturado:</h4>
            <p>Nombre: {item.productoManufacturado.nombre}</p>
            {/* Agrega más propiedades del producto manufacturado según tus necesidades */}
          </div>
        )}
        {item.productoManufacturadoVenta && (
          <div>
            <h4>Producto Manufacturado Venta:</h4>
            <p>ID: {item.productoManufacturadoVenta.idProductoManufacturadoVenta}</p>
            <p>Precio de venta: {item.productoManufacturadoVenta.precioVenta}</p>
            {/* Agrega más propiedades del producto manufacturado venta según tus necesidades */}
          </div>
        )}
        <button className="cart-item__remove" onClick={() => removeFromCart(item.id)}>
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default CartItem;



