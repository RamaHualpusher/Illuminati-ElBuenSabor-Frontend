import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

interface BodyProps {
  name: string;
  image: string;
  description: string;
  price: number;
}

const Body: React.FC<BodyProps> = ({ name, image, description, price }) => {
  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <h3>{name}</h3>
        </Col>
      </Row>
      <Row>
        <Col xs={12} sm={6}>
          <img src={image} alt={name} className="img-fluid" />
        </Col>
        <Col xs={12} sm={6}>
          <p>{description}</p>
          <p>Precio: ${price}</p>
          <Button variant="primary">Detalles</Button>{' '}
          <Button variant="success">Agregar al carrito</Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Body;




