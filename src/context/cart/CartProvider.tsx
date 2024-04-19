import React, { createContext, useReducer, ReactNode, useEffect } from "react";
import { IDetallePedido } from "../../interface/IDetallePedido";

export interface CartItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  image: string;
  title: string;
  detallePedido: IDetallePedido;
}

type CartAction =
  | { type: "ADD_TO_CART"; payload: CartItem }
  | { type: "REMOVE_FROM_CART"; payload: number }
  | { type: "INCREMENT_ITEM"; payload: number }
  | { type: "DECREMENT_ITEM"; payload: number }
  | { type: "CLEAR_CART" };

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: number) => void;
  incrementItem: (itemId: number) => void;
  decrementItem: (itemId: number) => void;
  clearCart: () => void;
}

const initialCartState: CartItem[] = [];

export const CartContext = createContext<CartContextType>({
  cartItems: initialCartState,
  addToCart: () => {},
  removeFromCart: () => {},
  incrementItem: () => {},
  decrementItem: () => {},
  clearCart: () => {},
});

const cartReducer = (state: CartItem[], action: CartAction): CartItem[] => {
  switch (action.type) {
    case "ADD_TO_CART":
      const existingItem = state.find((item) => item.id === action.payload.id);
      if (existingItem) {
        return state.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        return [...state, action.payload];
      }
    case "REMOVE_FROM_CART":
      return state.filter((item) => item.id !== action.payload);
    case "INCREMENT_ITEM":
      return state.map((item) =>
        item.id === action.payload
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    case "DECREMENT_ITEM":
      return state.map((item) =>
        item.id === action.payload && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
    case "CLEAR_CART":
      return [];
    default:
      return state;
  }
};

interface CartProviderProps {
  children: ReactNode;
}

/**
 * Proveedor de contexto para el carrito de compras.
 *
 * @param {CartProviderProps} props - Propiedades del componente.
 * @param {ReactNode} props.children - Componentes hijos.
 */
export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  // Función para guardar el estado del carrito en el localStorage
  const saveCartToLocalStorage = (cartItems: CartItem[]) => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  };

  // Función para recuperar el estado del carrito del localStorage
  const getCartFromLocalStorage = (): CartItem[] => {
    const cartItems = localStorage.getItem("cartItems");
    return cartItems ? JSON.parse(cartItems) : initialCartState;
  };

  const [cartItems, dispatch] = useReducer(
    cartReducer,
    getCartFromLocalStorage()
  );

  // Guardar el estado del carrito en el localStorage cada vez que cambie
  useEffect(() => {
    saveCartToLocalStorage(cartItems);
  }, [cartItems]);

  const addToCart = (item: CartItem) => {
    dispatch({ type: "ADD_TO_CART", payload: item });
  };

  const removeFromCart = (itemId: number) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: itemId });
  };

  const incrementItem = (itemId: number) => {
    dispatch({ type: "INCREMENT_ITEM", payload: itemId });
  };

  const decrementItem = (itemId: number) => {
    dispatch({ type: "DECREMENT_ITEM", payload: itemId });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        incrementItem,
        decrementItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
