import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark py-5">
      <Container>
        <Row className="align-items-center">
          <Col md={4}>
            <p className="text-muted mb-0">© {new Date().getFullYear()} El Buen Sabor</p>
          </Col>
          <Col md={7}>
            <ul className="list-unstyled mb-0 d-flex justify-content-end ">
              <li className="mx-2">
                <i className="bi bi-whatsapp text-white"></i>
                <a href={`https://wa.me/5492613695874`} target="_blank" rel="noreferrer" className="footer-link text-white px-1" >
                  +54 9 261 3695874
                </a>
              </li>
              <li className="mx-2">
                <i className="bi bi-geo-alt text-white"></i>
                <span className="footer-text text-white px-1">Mendoza-Argentina</span>
              </li>
              <li className="mx-2">
                <i className="bi bi-envelope text-white"></i>
                <a href="mailto:elbuensaborutin@gmail.com" className="footer-link text-white px-1">
                  elbuensaborutin@gmail.com
                </a>
              </li>
            </ul>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
