import React from "react";
import { CartItem } from "../../context/cart/CartProvider";

interface CartTablaProps {
    cartItems: CartItem[];
    modificarCantidad: (id: number, cantidad: number) => void;
    eliminarDetallePedido: (id: number) => void;
}

/**
 * Componente que muestra una tabla con los elementos del carrito de compras.
 * 
 * @param {CartTablaProps} props - Propiedades del componente.
 */
const CartTabla: React.FC<CartTablaProps> = ({
    cartItems,
    modificarCantidad,
    eliminarDetallePedido
}) => {
    
    return (
        <div className="d-flex justify-content-center align-items-center mb-4">
            <div className="container">
                {cartItems.map((item) => (
                    <div className="d-flex align-items-start w-100" key={item.id}>
                        <div>
                            <img src={item.image} alt={item.name} className="img-fluid rounded-circle me-2" style={{ width: "50px", height: "50px" }} />
                        </div>
                        <div className="flex-grow-1">
                            <div className='d-flex justify-content-between align-items-center'>
                                <h3 className="h5 flex-grow-1">{item.name}</h3>
                                <p>${item.price * item.quantity}</p>
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <button className="btn btn-sm btn-outline-secondary mx-1" onClick={(e) => {
                                        e.preventDefault();
                                        modificarCantidad(item.id, item.quantity - 1);
                                    }}>
                                        -
                                    </button>
                                    <button className="btn btn-sm btn-outline-secondary mx-1 px-3 p-2" disabled>
                                        <span className="h6 ">{item.quantity}</span>
                                    </button>
                                    <button className="btn btn-sm btn-outline-secondary mx-1" onClick={(e) => {
                                        e.preventDefault();
                                        modificarCantidad(item.id, item.quantity + 1);
                                    }}>
                                        +
                                    </button>
                                </div>
                                <button className="btn btn-sm btn-outline-danger" onClick={(e) => {
                                    e.preventDefault();
                                    eliminarDetallePedido(item.id)
                                }}>
                                    <i className="bi bi-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CartTabla;