import { Domicilio } from "../../interface/Domicilio";

interface CartTarjetaProps {
    tipoEnvio: string;
    metodoPago: string;
    handleTipoEnvio: (tipo: string) => void;
    handleMetodoPago: (metodo: string) => void;
    domicilio: Domicilio | null;
    costoDelivery: number;
    descuento: number;
    subTotal: number;
}

const CartTarjeta: React.FC<CartTarjetaProps> = ({
    tipoEnvio,
    metodoPago,
    handleTipoEnvio,
    handleMetodoPago,
    domicilio,
    costoDelivery,
    descuento,
    subTotal,
}) => {
    const total =
        tipoEnvio === "Delivery"
            ? subTotal + costoDelivery
            : subTotal - subTotal * descuento;

    return (
        <div className="d-flex justify-content-center align-items-center mb-4">
            <div className="card" style={{ width: "25rem" }}>
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
                            checked={tipoEnvio === "Delivery"}
                            onChange={() => handleTipoEnvio("Delivery")}
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
                            checked={tipoEnvio === "Retiro en el Local"}
                            onChange={() => handleTipoEnvio("Retiro en el Local")}
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
                                {tipoEnvio === "Delivery" && (
                                    <p className="lead">
                                        <strong>Costo del Delivery: </strong>${costoDelivery}
                                    </p>
                                )}
                                {tipoEnvio === "Retiro en el Local" && (
                                    <p className="lead">
                                        <strong>Descuento:</strong> {descuento * 100}%
                                    </p>
                                )}
                                <p className="lead">
                                    <strong>Total: </strong>${total}
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
                                {tipoEnvio === "Retiro en el Local" && (
                                    <>
                                        <input
                                            type="radio"
                                            className="btn-check"
                                            id="efectivo-outlined"
                                            autoComplete="off"
                                            checked={metodoPago === "Efectivo"}
                                            onChange={() => handleMetodoPago("Efectivo")}
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
                                    checked={metodoPago === "Mercado Pago"}
                                    onChange={() => handleMetodoPago("Mercado Pago")}
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
