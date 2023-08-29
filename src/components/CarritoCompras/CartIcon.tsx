import React from 'react';
import { ICartIconProps } from '../../interface/CarritoCompras';

/**
 * Componente para mostrar un ícono de carrito de compras.
 * 
 * @param {ICartIconProps} props - Propiedades del componente.
 * @param {string} props.icon - Clase CSS del ícono a mostrar.
 * @param {() => void} props.onClick - Función para manejar el clic en el ícono.
 */
const CartIcon: React.FC<ICartIconProps> = ({ icon, onClick }) => {
  return (
    <button className="cart-icon" onClick={onClick}>
      <i className={icon}></i>
    </button>
  );
};

export default CartIcon;
