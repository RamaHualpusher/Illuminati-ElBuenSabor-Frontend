import React, { useEffect, useState } from "react";
import { CartItem } from "./CartProvider";
import CartTabla from "./CartTabla";
import CartTarjeta from "./CartTarjeta";
import { Domicilio } from "../../interface/Domicilio";

interface ConfirmacionPedidoProps {
  cartItems: CartItem[];
  metodoPago: string;
  tipoEnvio: string;
  setMetodoPago: (metodo: string) => void;
  setTipoEnvio: (tipo: string) => void;
  modificarCantidad: (id: number, cantidad: number) => void;
  eliminarDetallePedido: (id: number) => void;
  onCancel: () => void;
  onContinue: () => void;
}

const ConfirmacionPedido: React.FC<ConfirmacionPedidoProps> = ({
  cartItems,
  metodoPago,
  tipoEnvio,
  setMetodoPago,
  setTipoEnvio,
  modificarCantidad,
  eliminarDetallePedido,
  onCancel,
  onContinue
}) => {
  const [domicilio, setDomicilio] = useState<Domicilio | null>(null);
  const [costoDelivery, setCostoDelivery] = useState(500);
  const descuento = 0.1; // Descuento del 10% (0.1)
  const [subTotal, setSubTotal] = useState(0);

  useEffect(() => {
    const fetchDomicilio = async () => {
      try {
        const response = await fetch("/assets/data/clienteTabla.json");
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setDomicilio(data[0].Domicilio);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchDomicilio();
  }, []);

  useEffect(() => {
    const totalProducto = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    setSubTotal(totalProducto);
  }, [cartItems]);

  const handleMetodoPago = (metodo: string) => {
    setMetodoPago(metodo);
  };

  const handleTipoEnvio = (tipo: string) => {
    setTipoEnvio(tipo);
  };

  const handleConfirmarPedido = (e: React.FormEvent) => {
    e.preventDefault();
    // Objeto completo a imprimir en la consola
    const pedidoCompleto = {
      cartItems,
      metodoPago,
      tipoEnvio,
      subTotal,
      domicilio,
      costoDelivery,
      descuento
    };
    console.log("Pedido completo:", pedidoCompleto);
  };

  return (
    <div style={{ marginTop: "90px" }}>
      <div className="row justify-content-center">
        <h1 className="display-4 mb-0">Carrito de Compras</h1>
      </div>

      <div className="container-fluid">
        <div className="row">
          <div className="col-md-6">
            <h1 className="display-6 mb-3">
              <small className="text-body-secondary">
                ¿Desea agregar o eliminar algo?
              </small>
            </h1>
            <CartTabla
              cartItems={cartItems}
              modificarCantidad={modificarCantidad}
              eliminarDetallePedido={eliminarDetallePedido}
            />
          </div>

          <div className="col-md-6">
            <h1 className="display-6 mb-3">
              <small className="text-body-secondary">
                Seleccione el tipo de envío y pago
              </small>
            </h1>
            <CartTarjeta
              tipoEnvio={tipoEnvio}
              metodoPago={metodoPago}
              handleTipoEnvio={handleTipoEnvio}
              handleMetodoPago={handleMetodoPago}
              domicilio={domicilio}
              costoDelivery={costoDelivery}
              descuento={descuento}
              subTotal={subTotal}
            />
          </div>
        </div>
      </div>

      <form onSubmit={handleConfirmarPedido}>
        <div className="d-flex justify-content-center align-items-center mb-4">
          <button type="submit" className="btn btn-primary me-2">
            Confirmar Pedido
          </button>
          <button
            type="button"
            className="btn btn-secondary me-2"
            onClick={onContinue}
          >
            Seguir Agregando Productos
          </button>
          <button type="button" className="btn btn-danger" onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConfirmacionPedido;
