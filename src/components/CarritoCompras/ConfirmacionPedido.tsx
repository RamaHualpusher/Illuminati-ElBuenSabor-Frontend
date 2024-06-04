import React, { useContext, useEffect, useState } from "react";
import CartTabla from "./CartTabla";
import CartTarjeta from "./CartTarjeta";
import { CartContext, CartItem } from "../../context/cart/CartProvider";
import axios from "axios";
import { IPedidoDto } from "../../interface/IPedido";
import { IProducto } from "../../interface/IProducto";
import { IDetallePedido } from "../../interface/IDetallePedido";
import { Alert, Button, Modal } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import { IProductoIngrediente } from "../../interface/IProductoIngrediente";
import GenerarTicket from "../Ticket/GenerarTicket";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/User/UserContext";

interface ConfirmacionPedidoProps {
  cartItems: CartItem[];
  modificarCantidad: (id: number, cantidad: number) => void;
  eliminarDetallePedido: (id: number) => void;
  onCancel: () => void;
  onContinue: () => void;
  isCartEmpty: boolean;
}

const ConfirmacionPedido: React.FC<ConfirmacionPedidoProps> = ({
  cartItems,
  modificarCantidad,
  eliminarDetallePedido,
  onCancel,
  onContinue,
  isCartEmpty,
}) => {
  const { clearCart } = useContext(CartContext);
  const { usuarioContext } = useUser();
  const [productos, setProductos] = useState<IProducto[] | null>(null);
  const [subTotal, setSubTotal] = useState(0);
  const [pedidoCompleto, setPedidoCompleto] = useState<IPedidoDto | null>(null);
  const [pedidoConfirmado, setPedidoConfirmado] = useState<Boolean>(false);
  const [esDelivery, setEsDelivery] = useState(true);
  const [esEfectivo, setEsEfectivo] = useState(true);
  const [totalPedido, setTotalPedido] = useState(0);
  const { loginWithRedirect, user, isAuthenticated } = useAuth0();
  const [showAlert, setShowAlert] = useState(!isAuthenticated);
  const [insufficientStock, setInsufficientStock] = useState<
    {
      isInsufficient: boolean;
      productName: string;
    }[]
  >([]); // Use an array to store multiple insufficient stock errors

  const API_URL = process.env.REACT_APP_API_URL || "";
  const MP_ACCESS = process.env.REACT_APP_MP_ACCESS_TOKEN || "";
  const MP_PUBLIC = process.env.REACT_APP_MP_PUBLIC_KEY || "";
  const [preferenceId, setPreferenceId] = useState<string>(); //para mercado pago
  const [showTicketModal, setShowTicketModal] = useState<boolean>(false);
  const [returnUrl, setReturnUrl] = useState<string | null>(null);
  const navigate = useNavigate(); // Obtiene la función navigate desde useNavigate

  const handleClose = () => {
    navigate("/"); // Redirige a la página principal al hacer click en "Cerrar"
  };

  useEffect(() => {
    if (isAuthenticated) {
      const fetchProductos = async () => {
        try {
          const response = await axios.get(`${API_URL}producto`);
          setProductos(response.data);
        } catch (error) {
          console.error("Error al obtener productos:", error);
        }
      };

      fetchProductos();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const totalProducto = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    setSubTotal(totalProducto);
  }, [cartItems]);

  useEffect(() => {
    if (
      usuarioContext !== null &&
      cartItems.length > 0 &&
      productos !== null &&
      esDelivery !== null &&
      esEfectivo !== null
    ) {
      const detallesPedido: IDetallePedido[] = [];

      cartItems.forEach((cartItem) => {
        const productoEncontrado = productos.find(
          (producto) => producto.id === cartItem.id
        );
        if (productoEncontrado) {
          const detallePedido: IDetallePedido = {
            cantidad: cartItem.quantity,
            subTotal: cartItem.quantity * cartItem.price,
            producto: productoEncontrado,



            //aca invente que es 5, tengo que ver cuanto es el maximo
            maxCantidadProducto: 5,



            
          };
          detallesPedido.push(detallePedido);
        }
      });

      const nuevoTotalPedido = esEfectivo ? subTotal * 0.9  : subTotal + 500;

      //aca tenemos que poner segun el producto, el tiempo estimado segun hamburguesa, papas fritas, etc
      const calcularHoraEstimadaFin = () => {
        const horaActual = new Date();
        const esBebida = detallesPedido.some(
          (detalle) => detalle.producto.esBebida
        );
        if (!esBebida) {
          horaActual.setMinutes(horaActual.getMinutes() + 20);
        }
        return horaActual;
      };

      const nuevoPedidoCompleto: IPedidoDto = { 
        activo: true,
        horaEstimadaFin: calcularHoraEstimadaFin(),
        esDelivery: esDelivery,
        esEfectivo: esEfectivo,
        estadoPedido: "A confirmar",
        fechaPedido: new Date(),
        usuario: usuarioContext,
        detallesPedidos: detallesPedido,
        total: nuevoTotalPedido,
      };
      setTotalPedido(nuevoTotalPedido);
      setPedidoCompleto(nuevoPedidoCompleto);
    }
  }, [usuarioContext, cartItems, subTotal, esDelivery, esEfectivo, productos]);

  //agregado por Javier
  useEffect(() => {
    if (pedidoConfirmado && pedidoCompleto) {
      setShowTicketModal(true);      
      setPedidoConfirmado(true);
    }
  }, [pedidoConfirmado, pedidoCompleto]); //tambien agregue para factura el", pedidoCompleto"


  const createPreference = async () => {
    if (!pedidoCompleto || !pedidoCompleto.usuario) {
      alert("El pedido o el usuario no puede ser nulo.");
      return;
    }

    if (pedidoCompleto !== null) {
      try {
        let response;

        if (esEfectivo) {
          // Si el pago es en efectivo, utiliza la URL del controlador PedidoController
          response = await axios.post(`${API_URL}pedido`, pedidoCompleto);
          console.log("Respuesta al guardar el pedido:", response.data);
          if (response.data) {
            setPedidoCompleto(response.data);
            setPedidoConfirmado(true);
            clearCart();
          }
        } else {
          // Si el pago es con Mercado Pago, crea la preferencia de pago
            initMercadoPago(MP_PUBLIC, { locale: 'es-AR' });
            response = await axios.post(`${API_URL}mercado-pago-dato/mercadoPago`, pedidoCompleto);
            setPreferenceId(response.data.preferenceId);

          console.log("Respuesta al crear preferencia de MercadoPago:", response.data);

        }
      } catch (error) {
        console.error("Error al crear preferencia de pago:", error);
      }
    }
  };

  //hasta aca agregado por javier

  const handleConfirmarPedido = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setShowAlert(true);
      return;
    }

    if (usuarioContext === null) {
      console.error("El usuario no está cargado. No se puede confirmar el pedido.");
      return;
    }

    if (pedidoCompleto !== null) {
      try {
        // Validar el stock de ingredientes antes de confirmar el pedido
        const validationPromises = pedidoCompleto.detallesPedidos.map(
          async (detallePedido) => {
            try {
              // Limpiar el array de errores antes de la validación
              setInsufficientStock([]);
              const response = await axios.get(
                `${API_URL}producto/${detallePedido.producto.id}`
              );
              const producto = response.data;
              const ingredientesSuficientes =
                producto.productosIngredientes.every(
                  (productoIngrediente: IProductoIngrediente) =>
                    productoIngrediente.ingrediente.stockActual >=
                    productoIngrediente.cantidad * detallePedido.cantidad
                );
              if (!ingredientesSuficientes) {
                setInsufficientStock((prevState) => [
                  ...prevState,
                  {
                    isInsufficient: true,
                    productName: detallePedido.producto.nombre,
                  },
                ]);
                console.error(
                  `No hay suficiente stock para ${detallePedido.producto.nombre}`
                );
                return false;
              }
              return true;
            } catch (error) {
              console.error("Error al validar el stock:", error);
              return false;
            }
          }
        );

        const validationResults = await Promise.all(validationPromises);

        if (validationResults.every((result) => result)) {
          // Todos los productos tienen suficiente stock, proceder con el pedido
          await createPreference(); //este es para crear la preferencia de mercado pago
        }
      } catch (error) {
        console.error("Error al enviar el pedido o factura:", error);
      }
    }
  };

  const handleLoginRedirect = () => {
    setReturnUrl(window.location.href);
    loginWithRedirect();
  };

  const handleEsEfectivo = (esEfectivo: boolean) => {
    setEsEfectivo(esEfectivo);
  };

  const handleEsDelivery = (esDelivery: boolean) => {
    setEsDelivery(esDelivery);
    setEsEfectivo(false);
  };

  return (
    <div style={{ marginTop: "90px" }}>
      {/* Mostrar la alerta con el número de pedido */}
      {pedidoConfirmado && (
        <div className="container mt-3">
          <Alert variant="success">
            ¡Pedido realizado con éxito! Número de pedido: {pedidoCompleto?.id}
            <Button variant="primary" onClick={onContinue} className="ms-3">
              Continuar
            </Button>
          </Alert>
        </div>
      )}
      <div className="justify-content-center">
        <h1 className="display-4">Carrito de Compras</h1>
      </div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-6">
            <h1 className="display-6 mb-3">
              <small className="text-body-secondary">
                ¿Desea agregar o eliminar algo?
              </small>
            </h1>
            <div className="card shadow">
              <CartTabla
                cartItems={cartItems}
                modificarCantidad={modificarCantidad}
                eliminarDetallePedido={eliminarDetallePedido}
              />
            </div>
          </div>
          <div className="col-md-6">
            <h1 className="display-6 mb-3">
              <small className="text-body-secondary">
                Seleccione el tipo de envío y pago
              </small>
            </h1>
            <CartTarjeta
              esDelivery={esDelivery}
              esEfectivo={esEfectivo}
              handleEsDelivery={handleEsDelivery}
              handleEsEfectivo={handleEsEfectivo}
              domicilio={usuarioContext ? usuarioContext.domicilio : null}
              subTotal={subTotal}
              totalPedido={totalPedido}
              usuario={usuarioContext}
            />
          </div>
        </div>
      </div>
      <form onSubmit={handleConfirmarPedido}>
        <div className="d-flex justify-content-center align-items-center mb-4">
          <button
            type="submit"
            className="btn btn-primary me-2"
            disabled={isCartEmpty || !isAuthenticated}
          >
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
      {preferenceId &&
        <Wallet initialization={{ preferenceId: preferenceId.toString(), redirectMode: "blank" }} customization={{ texts: { valueProp: 'smart_option' } }} />
      }
      <div>
        {/* Modal del ticket */}
        <Modal show={showTicketModal} onHide={() => setShowTicketModal(false)}>
          {/* Aquí renderizamos el componente GenerarTicket */}
          {pedidoConfirmado && (
            <GenerarTicket
              pedido={pedidoCompleto}
              closeModal={() => setShowTicketModal(false)}
              show={showTicketModal}
              modificarCantidad={modificarCantidad}
              eliminarDetallePedido={eliminarDetallePedido}
            />
          )}
        </Modal>
      </div>
      {/* Mostrar el Alert cuando el carrito esté vacío */}
      {isCartEmpty && (
        <div className="container mt-3">
          <Alert show={true} variant="warning">
            No hay productos en el carrito. Agregue productos antes de
            confirmar.
          </Alert>
        </div>
      )}
      {/* Mostrar el mensaje de error de stock insuficiente */}
      {insufficientStock.map((error, index) => (
        <div className="container mt-3" key={index}>
          <Alert
            variant="danger"
            onClose={() =>
              setInsufficientStock((prevState) =>
                prevState.filter((_, i) => i !== index)
              )
            }
            dismissible
          >
            No hay suficiente stock para el producto: {error.productName}
          </Alert>
        </div>
      ))}
      {!isAuthenticated && (
        <div className="container mt-3">
          <Alert variant="danger" show={showAlert}>
            Por favor, inicie sesión para confirmar el pedido. <br />
            <div className="mt-1">
              <Button variant="primary" onClick={handleLoginRedirect}>
                Iniciar Sesión
              </Button>
            </div>
          </Alert>
        </div>
      )}
    </div>
  );
};

export default ConfirmacionPedido;