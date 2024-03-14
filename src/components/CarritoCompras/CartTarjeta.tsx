import React, { useEffect, useState } from "react";
import { IDomicilio } from "../../interface/IDomicilio";
import { IPedidoDto } from '../../interface/IPedido';
import { MercadoPago } from "../MercadoPago/MercadoPago";

interface CartTarjetaProps {
  esDelivery: boolean;
  esEfectivo: boolean;
  handleEsDelivery: (esDelivery: boolean) => void;
  handleEsEfectivo: (esEfectivo: boolean) => void;
  domicilio: IDomicilio | null;
  subTotal: number;
  totalPedido: number;
  handleMercadoPagoClick: () => void;
}

const CartTarjeta: React.FC<CartTarjetaProps> = ({
  esDelivery,
  esEfectivo,
  handleEsDelivery,
  handleEsEfectivo,
  domicilio,
  subTotal,
  totalPedido,
  handleMercadoPagoClick
}) => {
  const costoDelivery = 500;
  const descuentoEfectivo = 0.1; // Descuento del 10% para pago en efectivo
  const [nuevoDomicilio, setNuevoDomicilio] = useState<IDomicilio | null>(
    domicilio
      ? {
        calle: "Retiro en el local",
        numero: 0,
        localidad: "",
      }
      : null
  );
  const [preferenceId, setPreferenceId] = useState<string | null>(null);

  useEffect(() => {
    if (esDelivery) {
      // Cuando se selecciona Delivery, automáticamente selecciona Mercado Pago
      handleEsEfectivo(false);
    }

    if (!esDelivery) {
      setNuevoDomicilio(domicilio);
    }
  }, [esDelivery, handleEsEfectivo, domicilio, nuevoDomicilio]);

  useEffect(() => {
    // Aquí redirige al usuario a la página de Mercado Pago cuando se obtiene el preferenceId
    if (preferenceId) {
      window.location.href = `https://www.mercadopago.com/checkout/v1/redirect?preference_id=${preferenceId}`;
    }
  }, [preferenceId]);

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
              value="delivery"
              autoComplete="off"
              checked={esDelivery}
              onChange={() => {
                handleEsDelivery(true);
                handleEsEfectivo(false);
              }}
            />
            <label className="btn btn-outline-danger" htmlFor="delivery-outlined">
              Delivery
            </label>
            <input
              type="radio"
              className="btn-check"
              id="retiroLocal-outlined"
              value="retiroLocal"
              autoComplete="off"
              checked={!esDelivery}
              onChange={() => {
                handleEsDelivery(false);
                handleEsEfectivo(false);
              }}
            />
            <label className="btn btn-outline-danger" htmlFor="retiroLocal-outlined">
              Retiro en el Local
            </label>
          </div>
        </h5>
        <div className="card-body">
          <div className="container-fluid">
            <div className="d-flex flex-column align-items-center">
              <h1 className="display-6">Detalle del Pedido</h1>
              <p className="lead mb-0">
                <strong>Dirección:</strong>
                {esDelivery ? (
                  // Si es delivery, mostrar la dirección habitual del usuario
                  domicilio ? (
                    <p>
                      {domicilio.calle}, {domicilio.numero},{" "}
                      {domicilio.localidad}
                    </p>
                  ) : (
                    // Si no hay dirección habitual, mostrar un mensaje indicando que no está disponible
                    <p>Dirección no disponible</p>
                  )
                ) : (
                  // Si no es delivery, mostrar la nueva dirección solo si está definida
                  nuevoDomicilio ? (
                    <p>
                      {nuevoDomicilio.calle}, {nuevoDomicilio.numero},{" "}
                      {nuevoDomicilio.localidad}
                    </p>
                  ) : (
                    // Si no hay nueva dirección, mostrar un mensaje de "Retiro en el Local"
                    <p>Retiro en el Local</p>
                  )
                )}
              </p>
              <div className="mb-0">
                {esEfectivo && (
                  <p className="lead">
                    <strong>SubTotal: </strong>${subTotal}
                  </p>
                )}
                {esDelivery && (
                  <p className="lead">
                    <strong>Costo del Delivery: </strong>${costoDelivery}
                  </p>
                )}
                {!esDelivery && esEfectivo && (
                  <p className="lead">
                    <strong>Descuento:</strong> {descuentoEfectivo * 100}%
                  </p>
                )}
                <p className="lead">
                  <strong>Total: </strong>${calcularTotalPedido()}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="card-footer">
          <div className="container-fluid">
            <div className="d-flex flex-column align-items-center">
              <h5>Método de Pago</h5>
              <div className="mb-0">
                {!esDelivery && (
                  <>
                    <input
                      type="radio"
                      className="btn-check"
                      id="mercadoPago-outlined"
                      autoComplete="off"
                      checked={!esEfectivo}
                      onChange={() => {
                        handleEsEfectivo(false);
                        handleMercadoPagoClick();
                      }}
                    />
                    <label
                      className="btn btn-outline-primary mx-2"
                      htmlFor="mercadoPago-outlined"
                    >
                      Mercado Pago
                    </label>
                  </>
                )}
                <input
                  type="radio"
                  className="btn-check"
                  id="mercadoPago-outlined"
                  autoComplete="off"
                  checked={!esEfectivo}
                  onChange={() => handleEsEfectivo(false)}
                />
                <label
                  className="btn btn-outline-primary mx-2"
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
  );
};

export default CartTarjeta;
