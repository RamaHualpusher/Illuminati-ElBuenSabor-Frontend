import React, { useReducer } from 'react';

interface CartItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

type CartAction =
  | { type: 'ADD_TO_CART'; payload: CartItem }
  | { type: 'REMOVE_FROM_CART'; payload: number }
  | { type: 'CLEAR_CART' };

const cartReducer = (state: CartItem[], action: CartAction): CartItem[] => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.find(item => item.id === action.payload.id);
      if (existingItem) {
        return state.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        return [...state, action.payload];
      }
    case 'REMOVE_FROM_CART':
      return state.filter(item => item.id !== action.payload);
    case 'CLEAR_CART':
      return [];
    default:
      return state;
  }
};

const CartReducerExample: React.FC = () => {
  const [cartItems, dispatch] = useReducer(cartReducer, []);

  const addToCart = (item: CartItem) => {
    dispatch({ type: 'ADD_TO_CART', payload: item });
  };

  const removeFromCart = (itemId: number) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: itemId });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  // Resto del código y componentes que utilizan el contexto y los reducers

  return (
    <div>
      {/* Contenido del carrito de compras */}
    </div>
  );
};

export default CartReducerExample;
