import React from 'react';

interface CartIconProps {
  icon: string;
  onClick: () => void;
}

const CartIcon: React.FC<CartIconProps> = ({ icon, onClick }) => {
  return (
    <button className="cart-icon" onClick={onClick}>
      <i className={icon}></i>
    </button>
  );
};

export default CartIcon;
