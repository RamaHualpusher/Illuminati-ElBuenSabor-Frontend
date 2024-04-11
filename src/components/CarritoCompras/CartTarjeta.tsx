import React, { useState, useEffect } from "react";
import { IDomicilio } from "../../interface/IDomicilio";
import { IUsuario } from "../../interface/IUsuario";

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
  usuario
}) => {
  const costoDelivery = 500;
  const descuentoEfectivo = 0.1; // Descuento del 10% para pago en efectivo   
  const [nuevoDomicilio, setNuevoDomicilio] = useState<IDomicilio | null>(
    domicilio
      ? {
        calle: "Retiro en local",
        numero: NaN,
        localidad: "",
      }
      : null
  );

  // Función para manejar el clic en el botón de Delivery
  const handleClickDelivery = () => {
    handleEsDelivery(true);
    handleEsEfectivo(false);
    setNuevoDomicilio(usuario?.domicilio || null);
  };

  // Función para manejar el clic en el botón de Retiro en el Local
  const handleClickRetiroLocal = () => {   
    handleEsDelivery(false);
    setNuevoDomicilio({
      calle: "Retiro en el Local",
      numero: NaN,
      localidad: "",
    });  
  };

  // Función para manejar el clic en el botón de método de pago "Efectivo"
  const handleClickEfectivo = () => {
    handleEsEfectivo(true);
  };

  // Función para manejar el clic en el botón de método de pago "Mercado Pago"
  const handleClickMercadoPago = () => {
    handleEsEfectivo(false);
  };

  // Calcular total del pedido teniendo en cuenta descuentos y costos adicionales
  const calcularTotalPedido = () => {
    let total = subTotal;
    if (esDelivery) {
      total += costoDelivery;
    } else if (esEfectivo) {
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
              onChange={() => handleClickDelivery()}
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
              onChange={() => handleClickRetiroLocal()}
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
              <p className="lead mb-0">
                <strong>Dirección:</strong>{" "}
                {esDelivery ? (
                  // Si es delivery, mostrar la dirección habitual del usuario o un mensaje si no está disponible
                  domicilio ? (
                    <p>
                      {usuario?.domicilio.calle}, {usuario?.domicilio.numero},{" "}
                      {usuario?.domicilio.localidad}
                    </p>
                  ) : (
                    <p>Dirección no disponible</p>
                  )
                ) : (
                  // Si no es delivery, mostrar la nueva dirección o un mensaje de "Retiro en el Local"
                  <p>{nuevoDomicilio?.calle}</p>
                )}
              </p>
              <div className="mb-0">
                <p className="lead">
                  <strong>SubTotal: </strong>${subTotal}
                </p>
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
                {!esDelivery && esEfectivo && (
                  <>
                    <p className="lead">
                      <strong>Descuento:</strong> {descuentoEfectivo * 100}%
                    </p>
                    <p className="lead">
                      <strong>Total con Descuento: </strong>${calcularTotalPedido()}
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
                      className={!esDelivery && esEfectivo ? "btn btn-primary" : "btn btn-outline-primary"}
                      htmlFor="efectivo-outlined"
                    >
                      Efectivo
                    </label>
                  </div>
                )}
                <div className="mb-0">
                  <input
                    type="radio"
                    className="btn-check"
                    id="mercadoPago-outlined"
                    autoComplete="off"
                    checked={true}
                    onChange={handleClickMercadoPago}
                  />
                  <label
                    className={!esEfectivo ? "btn btn-primary" : "btn btn-outline-primary"}
                    htmlFor="mercadoPago-outlined"
                  >
                    Mercado Pago
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartTarjeta;
