import React from "react";

const Footer = () => {
  return (
    <div className="footer-container bg-secondary">
      <div className="container">
        <div className="row justify-content-center align-items-center">
          <div className="col-md-4 text-center">
            <h5 className="contact-us">Contactanos</h5>
            <div className="footer-contact-item">
              <i className="bi bi-geo-alt icon"></i>
              <span>Mendoza-Argentina</span>
            </div>
            <div className="footer-contact-item">
              <i className="bi bi-whatsapp icon"></i>
              <span>+54-9-2616321232</span>
            </div>
            <div className="footer-contact-item">
              <i className="bi bi-envelope icon"></i>
              <span>elbuensaborutn@gmail.com</span>
            </div>
          </div>
          <div className="col-md-4">
            <div className="arrow-container">
              <div className="arrow-bottom">
                <div className="img-logo"></div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Footer;
