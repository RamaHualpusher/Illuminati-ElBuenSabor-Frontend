import React, { useState, useEffect } from "react";
import { IDomicilio } from "../../interface/IDomicilio";
import { IUsuario } from "../../interface/IUsuario";
import { Button, Col, Modal, Row } from "react-bootstrap";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

interface CartTarjetaProps {
  esDelivery: boolean;
  esEfectivo: boolean;
  handleEsDelivery: (esDelivery: boolean) => void;
  handleEsEfectivo: (esEfectivo: boolean) => void;
  domicilio: IDomicilio | null;
  subTotal: number;
  totalPedido: number;
  usuario: IUsuario | null;
}

const CartTarjeta: React.FC<CartTarjetaProps> = ({
  esDelivery,
  esEfectivo,
  handleEsDelivery,
  handleEsEfectivo,
  domicilio,
  subTotal,
  totalPedido,
  usuario,
}) => {
  const costoDelivery = 500;
  const descuentoEfectivo = 0.1; // Descuento del 10% para pago en efectivo
  const [nuevoDomicilio, setNuevoDomicilio] = useState<IDomicilio | null>(
    domicilio
  );
  const [modalAbierto, setModalAbierto] = useState(false);
  const [calle, setCalle] = useState("");
  const [numero, setNumero] = useState("");
  const [localidad, setLocalidad] = useState("");
  const API_URL = process.env.REACT_APP_API_URL || "";
  const { isAuthenticated } = useAuth0();

  // Manejar la selección de "Delivery" y "Mercado Pago" al cargar el componente
  useEffect(() => {
    // Si el usuario tiene una dirección, establecemos los valores en los campos correspondientes
    if (domicilio) {
      setCalle(domicilio.calle || "");
      setNumero(domicilio.numero ? domicilio.numero.toString() : "");
      setLocalidad(domicilio.localidad || "");
    }
  }, [domicilio]);

  // Función para manejar el clic en el botón de Delivery
  const handleClickDelivery = () => {
    handleEsDelivery(true);
    handleEsEfectivo(false);
    if (usuario && usuario?.domicilio) {
      setNuevoDomicilio(usuario?.domicilio);
    } else {
      setModalAbierto(true);
    }
  };

  // Función para manejar el clic en el botón de Retiro en el Local
  const handleClickRetiroLocal = () => {
    handleEsDelivery(false);
  };

  // Función para manejar el clic en el botón de método de pago "Efectivo"
  const handleClickEfectivo = () => {
    handleEsDelivery(false);
    handleEsEfectivo(true);
  };

  // Función para manejar el clic en el botón de método de pago "Mercado Pago"
  const handleClickMercadoPago = () => {
    handleEsEfectivo(false);
  };

  const handleCloseModal = () => {
    setModalAbierto(false);
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (calle && numero && localidad) {
      const nuevaDireccion: IDomicilio = {
        activo: true,
        calle: calle,
        numero: parseInt(numero),
        localidad: localidad,
      };

      try {
        const domicilioUsuario = domicilio;

        if (domicilioUsuario) {
          domicilioUsuario.activo = true;
          domicilioUsuario.calle = nuevaDireccion.calle;
          domicilioUsuario.numero = nuevaDireccion.numero;
          domicilioUsuario.localidad = nuevaDireccion.localidad;

          // Si el usuario ya tiene una dirección, realizamos una solicitud PUT para actualizarla
          await axios.put(
            `${API_URL}usuario/${usuario?.id}/domicilio`,
            domicilioUsuario
          );
          // Actualizamos el estado del domicilio después de guardar la dirección
          setNuevoDomicilio(domicilioUsuario);
        } else {
          // Si el usuario no tiene una dirección, realizamos una solicitud POST para crearla
          await axios.post(`${API_URL}domicilio`, {
            ...nuevaDireccion,
            usuario: usuario,
          });
          // Actualizamos el estado del domicilio después de guardar la dirección
          setNuevoDomicilio(nuevaDireccion);
        }
        // Cerramos el modal después de enviar la solicitud
        setModalAbierto(false);
      } catch (error) {
        console.error("Error al guardar la dirección:", error);
      }
    }
  };

  const handleClickDireccion = () => {
    setModalAbierto(true);
  };

  // Calcular total del pedido teniendo en cuenta descuentos y costos adicionales
  const calcularTotalPedido = () => {
    let total = subTotal;
    if (esDelivery) {
      total += costoDelivery;
    }
    if (!esDelivery && esEfectivo) {
      total -= subTotal * descuentoEfectivo; // Aplicar descuento del 10% para pago en efectivo
    }
    return total;
  };

  return (
    <div className="d-flex justify-content-center align-items-center mb-4">
      <div className="card shadow" style={{ width: "25rem" }}>
        <h5 className="card-header">
          <div
            className="btn-group "
            role="group"
            aria-label="Basic example"
            style={{ width: "20rem" }}
          >
            <input
              type="radio"
              className="btn-check"
              id="delivery-outlined"
              autoComplete="off"
              checked={esDelivery}
              onChange={handleClickDelivery}
            />
            <label
              className="btn btn-outline-danger"
              htmlFor="delivery-outlined"
            >
              Delivery
            </label>
            <input
              type="radio"
              className="btn-check"
              id="retiroLocal-outlined"
              autoComplete="off"
              checked={!esDelivery}
              onChange={handleClickRetiroLocal}
            />
            <label
              className="btn btn-outline-danger"
              htmlFor="retiroLocal-outlined"
            >
              Retiro en el Local
            </label>
          </div>
        </h5>
        <div className="card-body">
          <div className="container-fluid">
            <div className="d-flex flex-column align-items-center">
              <h1 className="display-6">Detalle del Pedido</h1>
              {isAuthenticated && (
                <p className="lead mb-0">
                  <strong>Dirección:</strong>
                  {domicilio ? (
                    <span style={{ marginLeft: "10px" }}>
                      {domicilio ? (
                        <>
                          {esDelivery ? (
                            <>
                              <span>
                                {domicilio.calle}, {domicilio.numero},{" "}
                                {domicilio.localidad}
                              </span>
                              <br />
                              <button
                                className="btn btn-success ms-2 mt-1 mb-2"
                                onClick={handleClickDireccion}
                              >
                                Cambiar Dirección
                              </button>
                            </>
                          ) : (
                            <span>
                              Retiro en el Local{" "}
                              <span
                                className="icon"
                                style={{ cursor: 'pointer' }}
                                onClick={() => {
                                  window.open(
                                    "https://maps.app.goo.gl/aCW5vzKe88XF2poYA",
                                    "_blank"
                                  );
                                }}
                              >
                                <i className="bi bi-geo-alt-fill text-black"></i>
                              </span>
                            </span>
                          )}
                        </>
                      ) : (
                        <button
                          className="btn btn-success"
                          onClick={handleClickDireccion}
                        >
                          Agregar Dirección
                        </button>
                      )}

                      <br />
                    </span>
                  ) : (
                    <Modal
                      className="btn btn-success"
                      onClick={handleClickDireccion}
                    >
                      Agregar Dirección
                    </Modal>
                  )}
                </p>
              )}
              <div className="mb-0">
                <p className="lead">
                  <strong>SubTotal: </strong>${subTotal}
                </p>
                {!esDelivery && esEfectivo && (
                  <>
                    <p className="lead">
                      <strong>Descuento:</strong> {descuentoEfectivo * 100}%
                    </p>
                  </>
                )}
                {!esDelivery && (
                  <p className="lead">
                    <strong>Total: </strong>${calcularTotalPedido()}
                  </p>
                )}
                {esDelivery && (
                  <>
                    <p className="lead">
                      <strong>Costo del Delivery: </strong>${costoDelivery}
                    </p>
                    <p className="lead">
                      <strong>Total: </strong>${calcularTotalPedido()}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="card-footer">
          <div className="container-fluid">
            <div className="d-flex flex-column align-items-center">
              <h5>Método de Pago</h5>
              <div className="d-flex justify-content-center">
                <div className="mb-0 me-2">
                  <input
                    type="radio"
                    className="btn-check"
                    id="mercadoPago-outlined"
                    autoComplete="off"
                    checked={esDelivery}
                    onChange={handleClickMercadoPago}
                  />
                  <label
                    className={
                      !esEfectivo
                        ? "btn btn-primary"
                        : "btn btn-outline-primary"
                    }
                    htmlFor="mercadoPago-outlined"
                  >
                    Mercado Pago
                  </label>
                </div>
                {!esDelivery && (
                  <div className="mb-0 me-2">
                    <input
                      type="radio"
                      className="btn-check"
                      id="efectivo-outlined"
                      autoComplete="off"
                      checked={!esDelivery && esEfectivo} // Solo chequea si no es delivery y es efectivo
                      onChange={handleClickEfectivo}
                      disabled={esDelivery} // Deshabilita si es delivery
                    />
                    <label
                      className={
                        !esDelivery && esEfectivo
                          ? "btn btn-primary"
                          : "btn btn-outline-primary"
                      }
                      htmlFor="efectivo-outlined"
                    >
                      Efectivo
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {modalAbierto && (
        <div
          className="modal"
          tabIndex={-1}
          role="dialog"
          style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Cambiar Dirección</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={handleCloseModal}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleFormSubmit}>
                  <Row className="justify-content-center mb-2">
                    <Col md={11}>
                      <label htmlFor="calle" className="form-label">
                        Calle
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="calle"
                        value={calle}
                        onChange={(e) => setCalle(e.target.value)}
                      />
                    </Col>
                  </Row>
                  <Row className="mb-4">
                    <Col>
                      <label htmlFor="numero" className="form-label">
                        Número
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="numero"
                        value={numero}
                        onChange={(e) => setNumero(e.target.value)}
                      />
                    </Col>
                    <Col>
                      <label htmlFor="localidad" className="form-label">
                        Localidad
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="localidad"
                        value={localidad}
                        onChange={(e) => setLocalidad(e.target.value)}
                      />
                    </Col>
                  </Row>
                  <button type="submit" className="btn btn-primary">
                    Guardar Dirección
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartTarjeta;
