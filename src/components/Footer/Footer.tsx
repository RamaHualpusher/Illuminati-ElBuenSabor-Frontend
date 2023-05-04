import React from "react";

const Footer = () => {
  return (
    <div className="footer-container bg-secondary">
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <h5 className="contact-us">Contactanos</h5>
            <div className="footer-contact-item">
              <i className="bi bi-geo-alt icon"></i>
              <span>Mendoza-Argentina</span>
            </div>
            <div className="footer-contact-item">
              <i className="bi bi-whatsapp icon"></i>
              <span>+54-9-2616172242</span>
            </div>
            <div className="footer-contact-item">
              <i className="bi bi-envelope icon"></i>
              <span>ElBuenSaborMendoza@gmail.com</span>
            </div>
          </div>
          <div className="col-md-4">
            <div className="arrow-container">
              <div className="arrow-bottom">
                <div className="img-logo"></div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <h5 className="payment-methods">Métodos de pago</h5>
            <div className="footer-payment-item">
              <i className="bi bi-credit-card-2-front icon"></i>
              <i className="bi bi-credit-card-2-front icon"></i>
              <i className="bi bi-paypal icon"></i>
              <i className="bi bi-credit-card-2-front icon"></i>
              <i className="bi bi-apple icon"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;