import React, { ReactNode, createContext, useReducer } from 'react';

interface CartItem {
    id: number;
    name: string;
    quantity: number;
    price: number;
    image: string;
    title: string;
}

interface CartProviderProps {
    children: ReactNode;
}

type CartAction =
    | { type: 'ADD_TO_CART'; payload: CartItem }
    | { type: 'REMOVE_FROM_CART'; payload: number }
    | { type: 'CLEAR_CART' };

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (itemId: number) => void;
    clearCart: () => void;
}

const initialCartState: CartItem[] = [];

export const CartContext = createContext<CartContextType>({
    cartItems: initialCartState,
    addToCart: () => { },
    removeFromCart: () => { },
    clearCart: () => { },
});

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

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    const [cartItems, dispatch] = useReducer(cartReducer, initialCartState);

    const addToCart = (item: CartItem) => {
        dispatch({ type: 'ADD_TO_CART', payload: item });
    };

    const removeFromCart = (itemId: number) => {
        dispatch({ type: 'REMOVE_FROM_CART', payload: itemId });
    };

    const clearCart = () => {
        dispatch({ type: 'CLEAR_CART' });
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export default CartProvider;
