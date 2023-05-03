import React from 'react';
import { Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

interface Props {
    name: string;
    imageUrl: string;
    description: string;
    price: number;
}

export const Body: React.FC<Props> = ({ name, imageUrl, description, price }) => {
    const { id } = useParams<{ id: string }>();

    return (
        <div className="body-container">
            <div className="body-name">{name}</div>
            <img src={imageUrl} alt={name} className="body-image" />
            <div className="body-description">{description}</div>
            <div className="body-price">{`$${price}`}</div>
            <Button variant="primary">Detalles</Button>
            <div className="body-add-to-cart">
                <Button variant="secondary">{`Agregar al carrito (${id})`}</Button>
            </div>
        </div>
    );
};

export default Body;



