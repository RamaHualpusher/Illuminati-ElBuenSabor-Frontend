import React from "react";
import { Col, Container, Row } from "react-bootstrap";

interface Props {
  backgroundImage: string;
}

const ComoFunc: React.FC<Props> = ({ backgroundImage }) => {
  return (
    <div
      style={{
        backgroundImage: `url(/assets/img/FondoComoFunc.jpg)`,
        backgroundSize: "cover",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <div className="d-flex align-items-center justify-content-center" style={{ height: "100vh"  }}>
        <Container>
          <h1 >¿Como Funciona?</h1>
          <Row className="justify-content-center">
            <Col lg={4} md={6} xs={12} className="text-center">
              <div
                style={{
                  width: "200px",
                  height: "200px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(255,255,255,0.5)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "20px",
                  border: "2px solid black",
                }}
              >
                <i className="bi bi-hand-index-thumb" style={{ fontSize: "5rem", marginBottom: "10px" }}/>
              </div>
              <div style={{ width: "200px" }}>
               <h5>1-Elegí tu comida</h5> 
                <div style={{ marginTop: "20px" }}>
                  Encontra en nuestro Menu la comida que más te guste y ordená directamente desde la aplicación.
                </div>
              </div>

            </Col>
            <Col lg={4} md={6} xs={12} className="text-center">
              <div
                style={{
                  width: "200px",
                  height: "200px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(255,255,255,0.5)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "20px",
                  border: "2px solid black",
                }}
              >
                <i className="bi bi-bag" style={{ fontSize: "5rem", marginBottom: "10px" }}/> 
              </div>
              <div style={{ width: "200px" }}>
                <h5>2-Hacé tu orden</h5> 
                <div style={{ marginTop: "20px" }}>
                  De forma fácil y rápida. Podes pagar online o en la entrega.
                </div>
              </div>
            </Col>
            <Col lg={4} md={6} xs={12} className="text-center">
              <div
                style={{
                  width: "200px",
                  height: "200px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(255,255,255,0.5)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "20px",
                  border: "2px solid black",
                }}
              >
                <i className="bi bi-car-front" style={{ fontSize: "5rem", marginBottom: "10px" }}/> 
              </div>
              <div style={{ width: "200px" }}>
                <h5> 3-Recibí tu comida</h5>
                <div style={{ marginTop: "20px" }}>
                  Retira tu pedido en nuestro local o te lo llevamos a la puerta de tu casa y disfruta de nuestra comida.
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

    </div>
  );
};

export default ComoFunc;
