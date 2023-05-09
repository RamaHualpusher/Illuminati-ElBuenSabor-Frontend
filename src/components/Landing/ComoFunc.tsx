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
      <Container>
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
                marginBottom: "20px"
              }}
            >
              <i className="bi bi-person-circle" style={{  fontSize: "5rem", marginBottom: "10px" }}></i>
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
                marginBottom: "20px"
              }}
            >
              <i className="bi bi-person-circle" style={{ fontSize: "5rem", marginBottom: "10px" }}></i>
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
                marginBottom: "20px"
              }}
            >
              <i className="bi bi-person-circle" style={{ fontSize: "5rem", marginBottom: "10px" }}></i>
            </div>
            
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ComoFunc;
