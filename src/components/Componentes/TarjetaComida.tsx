import React from 'react';

interface CardProps {
  imageSrc: string;
  title: string;
  text: string;
  buttonText: string;
}

const Card: React.FC<CardProps> = ({ imageSrc, title, text, buttonText }) => {
  return (
    <div className="card" style={{ width: '18rem' }}>
      <img src={imageSrc} className="card-img-top" alt="Card image cap" />
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="card-text">{text}</p>
        <a href="#" className="btn btn-primary">
          {buttonText}
        </a>
      </div>
    </div>
  );
};

export default Card;