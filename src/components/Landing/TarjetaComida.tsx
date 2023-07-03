import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext, CartItem } from "../CarritoCompras/CartProvider";
import { ICardProps } from "../../interface/ICard";

const TarjetaComida: React.FC<ICardProps> = ({ producto, buttonText }) => {
  const { addToCart } = useContext(CartContext);

  const handleCartClick = () => {
    const item: CartItem = {
      id: producto.idProducto,
      name: producto.nombre,
      quantity: 1,
      price: producto.precio,
      image: producto.imagen,
      title: producto.nombre,
      DetallePedido: {
        idDetallePedido: 0,
        cantidad: 0,
        Producto: producto,
      },
    };
    addToCart(item);
  };

  return (
    <div
      className="card"
      style={{ width: "18rem", marginBottom: "20px", marginLeft: "16px" }}
    >
      <img
        className="card-img-top"
        src={producto.imagen}
        alt="Card image cap"
        style={{
          width: "100%",
          height: "150px",
          objectFit: "cover",
          borderRadius: "0%",
        }}
      />

      <div className="card-body">
        <h5 className="card-title">{producto.nombre}</h5>
        <p className="card-text">{producto.denominacion}</p>

        <button
          onClick={handleCartClick}
          className="btn btn-primary mb-2"
        >
          {buttonText}
        </button>
        <Link to={`/productos/${producto.idProducto}`} className="btn btn-primary float-right">
          Ver Detalles
        </Link>
      </div>
    </div>
  );
};

export default TarjetaComida;
