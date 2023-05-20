import React from "react";
import { Col, Container, Row } from "react-bootstrap";

interface Props {
  backgroundImage: string;
}

const ComoFunc: React.FC<Props> = ({ backgroundImage }) => {
  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <div className="d-flex align-items-center justify-content-center" style={{ height: "100vh" }}>
        <Container>
          <h1 className="text-center">¿Cómo Funciona?</h1>
          <Row className="justify-content-center">
            <Col lg={4} md={6} xs={12} className="text-center">
              <div className="circle-div bg-light d-flex flex-column align-items-center justify-content-center mb-4 rounded-circle mx-auto" style={{ width: "200px", height: "200px" }}>
                <i className="bi bi-hand-index-thumb" style={{ fontSize: "5rem" }} />
              </div>
              <div>
                <h5>1-Elegí tu comida</h5>
                <p>
                  Encontrá en nuestro menú la comida que más te guste y ordénala directamente desde la aplicación.
                </p>
              </div>
            </Col>
            <Col lg={4} md={6} xs={12} className="text-center">
              <div className="circle-div bg-light d-flex flex-column align-items-center justify-content-center mb-4 rounded-circle mx-auto" style={{ width: "200px", height: "200px" }}>
                <i className="bi bi-bag" style={{ fontSize: "5rem" }} />
              </div>
              <div>
                <h5>2-Hacé tu orden</h5>
                <p>De forma fácil y rápida. Podés pagar online o en la entrega.</p>
              </div>
            </Col>
            <Col lg={4} md={6} xs={12} className="text-center">
              <div className="circle-div bg-light d-flex flex-column align-items-center justify-content-center mb-4 rounded-circle mx-auto" style={{ width: "200px", height: "200px" }}>
                <i className="bi bi-car-front" style={{ fontSize: "5rem" }} />
              </div>
              <div>
                <h5>3-Recibí tu comida</h5>
                <p>Retirá tu pedido en nuestro local o te lo llevamos a la puerta de tu casa y disfrutá de nuestra comida.</p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default ComoFunc;
