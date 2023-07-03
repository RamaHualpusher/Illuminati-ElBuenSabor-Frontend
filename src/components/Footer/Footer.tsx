import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark py-5">
      <Container>
        <Row className="align-items-center">
          <Col md={4} className="text-center text-md-start mb-3 mb-md-0">
            <p className="text-muted mb-0">© {new Date().getFullYear()} El Buen Sabor</p>
          </Col>
          <Col md={8} className="text-center text-md-end">
            <ul className="list-unstyled mb-0 d-flex justify-content-center justify-content-md-end">
              <li className="mx-2">
                <i className="bi bi-whatsapp text-white"></i>
                <a href={`https://wa.me/5492613695874`} target="_blank" rel="noreferrer" className="footer-link text-white px-1" >
                  +54 9 261 3695874
                </a>
              </li>
              <li className="mx-2">
                <i className="bi bi-geo-alt text-white"></i>
                <a href="https://www.google.com/maps/search/?api=1&query=Av.%20Ar%C3%ADstides%20Villanueva%20436,%20Mendoza" target="_blank" rel="noreferrer" className="footer-link text-white px-1">
                  <span className="footer-text text-white px-1">Av. Arístides Villanueva 436, Mendoza</span>
                </a>
              </li>
              <li className="mx-2">
                <i className="bi bi-envelope text-white"></i>
                <a href="mailto:elbuensaborutn@gmail.com" className="footer-link text-white px-1">
                  elbuensaborutn@gmail.com
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
