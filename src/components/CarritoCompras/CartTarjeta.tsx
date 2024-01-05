import React, { useEffect } from "react";
import { IDomicilio } from "../../interface/IDomicilio";

interface CartTarjetaProps {
  esDelivery: boolean;
  esEfectivo: boolean;
  handleEsDelivery: (esDelivery: boolean) => void;
  handleEsEfectivo: (esEfectivo: boolean) => void;
  domicilio: IDomicilio | null;
  subTotal: number;
  totalPedido: number;
}

const CartTarjeta: React.FC<CartTarjetaProps> = ({
  esDelivery,
  esEfectivo,
  handleEsDelivery,
  handleEsEfectivo,
  domicilio,
  subTotal,
  totalPedido,
}) => {
  const descuento = 0.1; // Descuento del 10% (0.1)
  const costoDelivery = 500;

  // Manejar la selección de "Delivery" y "Mercado Pago" al cargar el componente
  useEffect(() => {
    if (esDelivery) {
      // Cuando se selecciona Delivery, automáticamente selecciona Mercado Pago
      handleEsEfectivo(false);
    }
  }, [esDelivery, handleEsEfectivo]);

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
              onChange={() => handleEsDelivery(true)}
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
              onChange={() => handleEsDelivery(false)}
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
                <strong>Dirección:</strong>
                {domicilio && (
                  <p>
                    {domicilio.calle}, {domicilio.numero},{" "}
                    {domicilio.localidad}
                  </p>
                )}
              </p>

              <div className="mb-0">
                <p className="lead">
                  <strong>SubTotal: </strong>${subTotal}
                </p>
                {esDelivery && (
                  <p className="lead">
                    <strong>Costo del Delivery: </strong>${costoDelivery}
                  </p>
                )}
                {!esDelivery && (
                  <p className="lead">
                    <strong>Descuento:</strong> {descuento * 100}%
                  </p>
                )}
                <p className="lead">
                  <strong>Total: </strong>${totalPedido}
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
                      id="efectivo-outlined"
                      autoComplete="off"
                      checked={esEfectivo}
                      onChange={() => handleEsEfectivo(true)}
                    />
                    <label
                      className="btn btn-outline-primary mx-1"
                      htmlFor="efectivo-outlined"
                    >
                      Efectivo
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
