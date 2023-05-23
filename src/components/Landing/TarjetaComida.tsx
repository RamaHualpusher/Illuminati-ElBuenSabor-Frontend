import React from 'react';
import { Link } from 'react-router-dom';

interface CardProps {
  id: number;
  imageSrc: string;
  title: string;
  text: string;
  buttonText: string;
}

const Card: React.FC<CardProps> = ({ imageSrc, title, text, buttonText, id }) => {
  return (
    <div className="card" style={{ width: '18rem', marginBottom: '20px', marginLeft: '16px'}}>
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
        <a href="#" className="btn btn-primary mb-2">
          {buttonText}
        </a>
        <Link to={`/productos/${id}`} className="btn btn-primary float-right">
          Ver Detalles
        </Link>
      </div>
    </div>
  );
};

export default Card;
