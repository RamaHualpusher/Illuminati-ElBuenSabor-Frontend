import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext, CartItem } from "../CarritoCompras/CartProvider";
import { ICardProps } from "../../interface/ICard";
import { DetallePedido } from "../../interface/DetallePedido";

/**
 * Componente de tarjeta para mostrar información de un producto.
 */
const TarjetaComida: React.FC<ICardProps> = ({ producto, buttonText, showButton }) => {
  // Obtener la función addToCart del contexto del carrito
  const { addToCart } = useContext(CartContext);

  // Manejar el clic en el botón del carrito
  const handleCartClick = () => {
    if (producto.stockActual > 0) {
      // Crear un objeto DetallePedido para el carrito
      const detallePedido: DetallePedido = {
        idDetallePedido: 0,
        cantidad: 1,
        Productos: producto
      };

      // Crear un objeto CartItem para agregar al carrito
      const item: CartItem = {
        id: producto.idProducto,
        name: producto.nombre,
        quantity: 1,
        price: producto.precio,
        image: producto.imagen,
        title: producto.nombre,
        DetallePedido: detallePedido,
      };
      addToCart(item); // Agregar el item al carrito
    }
  };

  // Renderizar el botón o el mensaje de sin stock
  const renderButton = () => {
    if (showButton && producto.stockActual > 0) {
      return (
        <button onClick={handleCartClick} className="btn btn-primary mb-2">
          {buttonText}
        </button>
      );
    } else {
      return (
        <div className="alert alert-danger p-2" role="alert">
          Sin Stock
        </div>
      );
    }
  };

  return (
    <div className="card" style={{ width: "18rem", marginBottom: "20px", marginLeft: "16px" }}>
      {/* Imagen del producto */}
      <img
        className="card-img-top"
        src={producto.imagen}
        alt={`Imagen de ${producto.nombre}`}
        style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "0%" }}
      />
      <div className="card-body">
        {/* Título y descripción del producto */}
        <h5 className="card-title">{producto.nombre}</h5>
        <p className="card-text">{producto.denominacion}</p>

        {/* Botón de agregar al carrito o mensaje de sin stock */}
        {renderButton()}

        {/* Enlace para ver detalles del producto */}
        <Link to={`/productos/${producto.idProducto}`} className="btn btn-primary float-right">
          Ver Detalles
        </Link>
      </div>
    </div>
  );
};

export default TarjetaComida;
