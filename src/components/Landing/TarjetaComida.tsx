import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../CarritoCompras/CartProvider';

interface CardProps {
  id: number;
  imageSrc: string;
  title: string;
  text: string;
  buttonText: string;
  onButtonClick: () => void;
}

const TarjetaComida: React.FC<CardProps> = ({ imageSrc, title, text, buttonText, id }) => {
  const [showCart, setShowCart] = useState(false);
  const { addToCart } = useContext(CartContext); // Obtener la función addToCart del contexto del carrito

  const handleCartClick = () => {
    const item = { id, name: title, quantity: 1, price: 0, title }; // Removiendo la propiedad 'image'
    addToCart(item);
    setShowCart(true);
  };
  

  return (
    <div className="card" style={{ width: '18rem', marginBottom: '20px', marginLeft: '16px' }}>
      <img
        className="card-img-top"
        src={imageSrc}
        alt="Card image cap"
        style={{
          width: '100%',
          height: '150px',
          objectFit: 'cover',
          borderRadius: '0%',
        }}
      />

      <div className="card-body">

        <h5 className="card-title">{title}</h5>
        <p className="card-text">{text}</p>

        <button onClick={handleCartClick} className="btn btn-primary mb-2">
          {buttonText}
        </button>
        <Link to={`/productos/${id}`} className="btn btn-primary float-right">
          Ver Detalles
        </Link>

      </div>
    </div>
  );
};

export default TarjetaComida;



