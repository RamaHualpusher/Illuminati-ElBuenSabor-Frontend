import React, { useContext, useEffect, useState } from "react";
import CartTabla from "./CartTabla";
import CartTarjeta from "./CartTarjeta";
import { CartContext, CartItem } from "../../context/cart/CartProvider";
import axios from 'axios';
import { IPedidoDto } from "../../interface/IPedido";
import { IProducto } from "../../interface/IProducto";
import { IUsuario } from "../../interface/IUsuario";
import { IDetallePedido } from "../../interface/IDetallePedido";
import { Alert, Button, Modal } from 'react-bootstrap';
import { useAuth0 } from "@auth0/auth0-react";
import { IProductoIngrediente } from "../../interface/IProductoIngrediente";
import GenerarTicket from "../Ticket/GenerarTicket";
import { IMercadoPagoDatos } from "../../interface/IMercadoPagoDatos";
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { useNavigate } from "react-router-dom";

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
  const [usuario, setUsuario] = useState<IUsuario | null>(null);
  const [productos, setProductos] = useState<IProducto[] | null>(null);
  const [subTotal, setSubTotal] = useState(0);
  const [pedidoCompleto, setPedidoCompleto] = useState<IPedidoDto | null>(null);
  const [pedidoConfirmado, setPedidoConfirmado] = useState<Boolean>(false);
  const [esDelivery, setEsDelivery] = useState(true);
  const [esEfectivo, setEsEfectivo] = useState(true);
  const [totalPedido, setTotalPedido] = useState(0);
  const { loginWithRedirect, user, isAuthenticated } = useAuth0();
  const [showAlert, setShowAlert] = useState(!isAuthenticated);
  const [insufficientStock, setInsufficientStock] = useState<{
    isInsufficient: boolean;
    productName: string;
  }[]>([]); // Use an array to store multiple insufficient stock errors

  const API_URL = process.env.REACT_APP_API_URL || "";
  const MP_ACCESS = process.env.REACT_APP_MP_ACCESS_TOKEN || "";
  const MP_PUBLIC = process.env.REACT_APP_MP_PUBLIC_KEY || "";
  const [preferenceId, setPreferenceId] = useState<number | null>(null); //para mercado pago
  const [showTicketModal, setShowTicketModal] = useState<boolean>(false);
  const [returnUrl, setReturnUrl] = useState<string | null>(null);
  const navigate = useNavigate(); // Obtiene la función navigate desde useNavigate 

  const handleClose = () => {
    navigate("/"); // Redirige a la página principal al hacer click en "Cerrar"
  };

  // Función para crear un nuevo cliente en el servidor
  const crearNuevoCliente = async () => {
    try {
      if (user && isAuthenticated) {
        const response = await axios.post(`${API_URL}usuario/clientes`, {
          nombre: user.given_name,
          apellido: user.family_name,
          email: user.email,
          clave: null, // No tenemos la contraseña aquí
          telefono: "", // No tenemos el teléfono aquí
          idDomicilio: 0, // No tenemos el id de domicilio aquí
          calle: "", // No tenemos la calle aquí
          numero: NaN, // No tenemos el número aquí
          localidad: "", // No tenemos la localidad aquí
          idRol: 0, // No tenemos el id de rol aquí
          nombreRol: "" // No tenemos el nombre de rol aquí
        });
        console.log("Respuesta al crear nuevo cliente:", JSON.stringify(response.data));
        // Si se crea exitosamente el nuevo cliente, lo establecemos en el estado
        setUsuario(response.data);
      }
    } catch (error) {
      console.error("Error al crear el nuevo cliente:", error);
      // Aquí puedes manejar el error de forma adecuada, por ejemplo, mostrar un mensaje al usuario
    }
  };

  useEffect(() => {
    const verificarUsuarioExistente = async () => {
      if (isAuthenticated && user) {
        try {
          const response = await axios.post(`${process.env.REACT_APP_API_URL}usuario/clientes/email`, {
            nombre: user.given_name,
            apellido: user.family_name,
            email: user.email,
            clave: null, // No tenemos la contraseña aquí
            telefono: "", // No tenemos el teléfono aquí
            idDomicilio: 0, // No tenemos el id de domicilio aquí
            calle: "", // No tenemos la calle aquí
            numero: 0, // No tenemos el número aquí
            localidad: "", // No tenemos la localidad aquí
            idRol: 0, // No tenemos el id de rol aquí
            nombreRol: "" // No tenemos el nombre de rol aquí
          });
          console.log("Respuesta al verificar usuario existente:", JSON.stringify(response.data));
          // Si el usuario existe, lo establecemos en el estado
          setUsuario(response.data);
        } catch (error: any) {
          // Si el usuario no existe, intentamos crearlo
          if (error.response && error.response.status === 404) {
            console.log("El usuario no existe, creándolo...");
            crearNuevoCliente(); // Llamamos a la función para crear un nuevo cliente
          } else {
            console.error("Error al verificar el usuario:", error);
          }
        }
      }
    };

    verificarUsuarioExistente();
  }, [isAuthenticated, user]);

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
    if (usuario !== null &&
      cartItems.length > 0 &&
      productos !== null &&
      esDelivery !== null &&
      esEfectivo !== null
    ) {
      const detallesPedido: IDetallePedido[] = [];

      cartItems.forEach((cartItem) => {
        const productoEncontrado = productos.find(producto => producto.id === cartItem.id);
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

      const nuevoTotalPedido =
        esDelivery ? subTotal + 500 : subTotal * 0.9;

      //aca tenemos que poner segun el producto, el tiempo estimado segun hamburguesa, papas fritas, etc
      const calcularHoraEstimadaFin = () => {
        const horaActual = new Date();
        horaActual.setMinutes(horaActual.getMinutes() + 20);
        return horaActual;
      };

      const nuevoPedidoCompleto: IPedidoDto = {
        activo: true,
        horaEstimadaFin: new Date(), // aca deberia ir la linea 168 calcularHoraEstimadaFin
        esDelivery: esDelivery,
        esEfectivo: esEfectivo,
        estadoPedido: "A confirmar",
        fechaPedido: new Date(),
        usuario: usuario!,
        detallesPedidos: detallesPedido,
        total: nuevoTotalPedido
      };
      console.log("Pedido completo:", JSON.stringify(nuevoPedidoCompleto));
      setTotalPedido(nuevoTotalPedido);
      setPedidoCompleto(nuevoPedidoCompleto);
    }
  }, [usuario, cartItems, subTotal, esDelivery, esEfectivo, productos]); 

  //agregado por Javier
  useEffect(() => {
    if (pedidoConfirmado && pedidoCompleto) {
      setShowTicketModal(true);
      //agregue esto para factura
      // const facturaGenerada = convertirPedidoAFactura(pedidoCompleto);
      // setFacturaGenerada(facturaGenerada);
      setPedidoConfirmado(true);
    }
  }, [pedidoConfirmado, pedidoCompleto]); //tambien agregue para factura el", pedidoCompleto"

  //usamos este para cuando el pedido pase por mercado pago, tiene que esperar que se concrete el pago
  const verificarPago = async () => {
    // Implementa la lógica para verificar el estado del pago en Mercado Pago
    // Por simplicidad, este ejemplo simplemente espera 3 segundos antes de considerar el pago como completado
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(true); // Simula la confirmación del pago de Mercado Pago
      }, 3000);
    });
  };
  
  const createPreference = async () => {
    if (pedidoCompleto !== null) {
      try {
        let response;
        let responsePedidoCompleto;
        //creo que esto no deberia estar porque si se crea la preferencia, es porque le pago va a ser con mercado pago
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
          // Si el pago es con Mercado Pago, utiliza la URL del controlador MercadoPagoDatosController
          // y envía los datos del pedido junto con la preferencia de pago          
          initMercadoPago(MP_PUBLIC);
          response = await axios.post(`${API_URL}mercado-pago-dato/prueba`, {
            reference: {
              items: [
                {
                  title: 'Pedido de ' + pedidoCompleto.usuario.nombre + " " + pedidoCompleto.usuario.apellido, // Título del pedido
                  quantity: 1, // Cantidad de ítems (puede ser 1 si es un pedido completo)
                  currency_id: 'ARS', // Moneda en la que se realiza el pago
                  unit_price: pedidoCompleto.total, // Precio total del pedido
                }
              ],
              back_urls: {
                success: 'http://localhost:3000/pago-exitoso',
                failure: 'http://localhost:3000/pago-fallido',
                pending: 'http://localhost:3000/pago-pendiente',
              },
              auto_return: 'approved',
              //esto me redirige al sitio cuando el pago esta okey
              notification_url: "https://localhost:3000/confirmacion-pedido"
            }
          });
  
          console.log("Respuesta al guardar datos de MercadoPago:", response.data);
  
          if (response.data) {
            const mercadoPagoResponse: IMercadoPagoDatos = response.data;
            //esto debe guardar el id de mercado pago en el pedido
            pedidoCompleto.mercadoPagoDatos = mercadoPagoResponse;
            // Realizar la verificación del pago con Mercado Pago antes de guardar el pedido
            const pagoConfirmado = await verificarPago();
            if (pagoConfirmado) {
              responsePedidoCompleto = await axios.post(`${API_URL}pedido`, pedidoCompleto);
              setPedidoCompleto(responsePedidoCompleto.data);
              setPedidoConfirmado(true);
              // Aquí puedes guardar la preferencia de pago en el estado o realizar cualquier otra acción necesaria
              // Por ejemplo, si deseas mostrar el botón de pago de Mercado Pago, puedes obtener el ID de preferencia y establecerlo en el estado
              // setPreferenceId(mercadoPagoResponse.preferenceId);
              // generarFactura();
              clearCart();
            } else {
              console.log("El pago no se ha confirmado. El pedido no se guardará en la base de datos.");
            }
          }
        }
        // Retorna la respuesta del servidor
        return response.data;
      } catch (error) {
        console.error('Error al crear preferencia de pago o guardar el pedido:', error);
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

    if (usuario === null) {
      console.error("El usuario no está cargado. No se puede confirmar el pedido.");
      return;
    }

    if (pedidoCompleto !== null) {
      try {
        // Validar el stock de ingredientes antes de confirmar el pedido
        const validationPromises = pedidoCompleto.detallesPedidos.map(async (detallePedido) => {
          try {
            // Limpiar el array de errores antes de la validación
            setInsufficientStock([]);
            const response = await axios.get(`${API_URL}producto/${detallePedido.producto.id}`);
            const producto = response.data;
            const ingredientesSuficientes = producto.productosIngredientes.every(
              (productoIngrediente: IProductoIngrediente) =>
                productoIngrediente.ingrediente.stockActual >= productoIngrediente.cantidad * detallePedido.cantidad
            );
            if (!ingredientesSuficientes) {
              setInsufficientStock(prevState => [...prevState, { isInsufficient: true, productName: detallePedido.producto.nombre }]);
              console.error(`No hay suficiente stock para ${detallePedido.producto.nombre}`);
              return false;
            }
            return true;
          } catch (error) {
            console.error("Error al validar el stock:", error);
            return false;
          }
        });

        const validationResults = await Promise.all(validationPromises);

        if (validationResults.every((result) => result)) {
          // Todos los productos tienen suficiente stock, proceder con el pedido
          const response = await axios.post(`${API_URL}pedido`, pedidoCompleto);

          console.log("Pedido enviado al servidor:", response.data);
          // await createPreference(); //este es para crear la preferencia de mercado pago

          // Mostrar la alerta con el número de pedido generado
          if (response.data) {
            setPedidoCompleto(response.data);
            setPedidoConfirmado(true);
            clearCart();           
          }
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
    if (esDelivery && user && isAuthenticated) {
      // Si es Delivery y el usuario está autenticado, buscar y establecer el domicilio del usuario
      buscarDomicilioUsuario();
      setEsEfectivo(true); // Cambia esEfectivo a true cuando se selecciona Delivery
    } else if (!esDelivery) {
      // Si es Retiro en el Local, establecer el domicilio como "Retiro en el Local"
      setUsuario((prevUsuario) => ({
        ...prevUsuario!,
        domicilio: {
          calle: "Retiro en el Local",
          numero: NaN,
          localidad: "",
        },
      }));
      setEsEfectivo(true); // Cambia esEfectivo a true cuando se selecciona Retiro en Local
    }
  };
  
  const buscarDomicilioUsuario = async () => {
    try {
      const response = await axios.get(`${API_URL}usuario/${usuario?.id}/domicilio`);
      const domicilioUsuario = response.data;
      setUsuario((prevUsuario) => ({
        ...prevUsuario!,
        domicilio: domicilioUsuario,
      }));
    } catch (error) {
      console.error("Error al obtener el domicilio del usuario:", error);
    }
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
              domicilio={usuario ? usuario.domicilio : null}
              subTotal={subTotal}
              totalPedido={totalPedido}
              usuario={usuario} />
          </div>
        </div>
      </div>
      <form onSubmit={handleConfirmarPedido}>
        <div className="d-flex justify-content-center align-items-center mb-4">
          <button type="submit"
            className="btn btn-primary me-2"
            disabled={isCartEmpty || !isAuthenticated}>
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
      {/* {preferenceId &&
        <Wallet initialization={{ preferenceId: preferenceId.toString() }} customization={{ texts: { valueProp: 'smart_option' } }} />
      } */}
      <div>
        {/* Modal del ticket */}
        <Modal show={showTicketModal} onHide={() => setShowTicketModal(false)}>
          <Modal.Body>
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
          </Modal.Body>
        </Modal>
      </div>
      {/* Mostrar el Alert cuando el carrito esté vacío */}
      {isCartEmpty && (
        <div className="container mt-3">
          <Alert show={true} variant="warning">
            No hay productos en el carrito. Agregue productos antes de confirmar.
          </Alert>
        </div>
      )}
      {/* Mostrar el mensaje de error de stock insuficiente */}
      {insufficientStock.map((error, index) => (
        <div className="container mt-3" key={index}>
          <Alert variant="danger" onClose={() => setInsufficientStock(prevState => prevState.filter((_, i) => i !== index))} dismissible>
            No hay suficiente stock para el producto: {error.productName}
          </Alert>
        </div>
      ))}
      {!isAuthenticated && (
        <div className="container mt-3">
          <Alert variant="danger" show={showAlert}>
            Por favor, inicie sesión para confirmar el pedido.    <br />
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