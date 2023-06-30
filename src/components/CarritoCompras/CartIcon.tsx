import React from 'react';
import { ICartIconProps } from '../../interface/CarritoCompras';

const CartIcon: React.FC<ICartIconProps> = ({ icon, onClick }) => {
  return (
    <button className="cart-icon" onClick={onClick}>
      <i className={icon}></i>
    </button>
  );
};

export default CartIcon;
