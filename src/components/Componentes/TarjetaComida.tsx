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
      <div className='container-fluid w-100'>
      <img
            className="card-image-top"
            src={imageSrc}
            alt="Card image cap"
            style={{
              width: "100%",
              height: "150px",
              borderRadius: "0%",
            }}
          />
      </div>
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