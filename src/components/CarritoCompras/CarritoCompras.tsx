import React from 'react';
import CartIcon from './CartIcon';
import CartProvider from './CartProvider';
import CartItem from './CartItem';

const CarritoCompras: React.FC = () => {
  const cartItems = [
    {
      id: 1,
      name: 'Producto 1',
      quantity: 1,
      price: 10.99,
      image: 'product1.jpg',
      title: 'Descripción del producto 1',
    },
    {
      id: 2,
      name: 'Producto 2',
      quantity: 2,
      price: 5.99,
      image: 'product2.jpg',
      title: 'Descripción del producto 2',
    },
  ];

  return (
    <CartProvider>
      <div>
        <h1>Carrito de Compras</h1>
        <CartIcon icon="clear-cart-icon" onClick={() => console.log('Borrar datos')} />
        <CartIcon icon="remove-from-cart-icon" onClick={() => console.log('Remover del carrito')} />
        <CartIcon icon="add-to-cart-icon" onClick={() => console.log('Agregar al carrito')} />
        <CartIcon icon="cart-icon" onClick={() => console.log('Cart')} />
        <div>
          {cartItems.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>
      </div>
    </CartProvider>
  );
};

export default CarritoCompras;

