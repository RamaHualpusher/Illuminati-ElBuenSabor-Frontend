import React, { useContext, useEffect, useState } from "react";
import CartTabla from "./CartTabla";
import CartTarjeta from "./CartTarjeta";
import { CartContext, CartItem } from "../../context/cart/CartProvider";
import axios from "axios";
import { IPedidoDto } from "../../interface/IPedido";
import { IProducto, IProductoDto } from "../../interface/IProducto";
import { IUsuario } from "../../interface/IUsuario";
import { IDetallePedidoDto } from "../../interface/IDetallePedido";
import { Alert, Button, Container } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import { IIngredientes } from "../../interface/IIngredientes";
import { IProductoIngrediente } from "../../interface/IProductoIngrediente";

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
  const [insufficientStock, setInsufficientStock] = useState<
    {
      isInsufficient: boolean;
      productName: string;
    }[]
  >([]); // Use an array to store multiple insufficient stock errors

  const API_URL = process.env.REACT_APP_API_URL || "";

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
          numero: 0, // No tenemos el número aquí
          localidad: "", // No tenemos la localidad aquí
          idRol: 0, // No tenemos el id de rol aquí
          nombreRol: "", // No tenemos el nombre de rol aquí
        });
        console.log(
          "Respuesta al crear nuevo cliente:",
          JSON.stringify(response.data)
        );
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
          const response = await axios.post(
            `${process.env.REACT_APP_API_URL}usuario/clientes/email`,
            {
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
              nombreRol: "", // No tenemos el nombre de rol aquí
            }
          );
          console.log(
            "Respuesta al verificar usuario existente:",
            JSON.stringify(response.data)
          );
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
    console.log("Subtotal del pedido:", totalProducto);
    setSubTotal(totalProducto);
  }, [cartItems]);

  useEffect(() => {
    if (usuario !== null && cartItems.length > 0 && productos !== null) {
      const detallesPedido: IDetallePedidoDto[] = [];

      cartItems.forEach((cartItem) => {
        const productoEncontrado = productos.find(
          (producto) => producto.id === cartItem.id
        );
        if (productoEncontrado) {
          const detallePedido: IDetallePedidoDto = {
            cantidad: cartItem.quantity,
            producto: productoEncontrado,
          };
          detallesPedido.push(detallePedido);
        }
      });

      const nuevoTotalPedido = esDelivery ? subTotal + 500 : subTotal * 0.9;

      const nuevoPedidoCompleto: IPedidoDto = {
        activo: true,
        horaEstimadaFin: new Date(),
        esDelivery: esDelivery,
        esEfectivo: esEfectivo,
        estadoPedido: "A confirmar",
        fechaPedido: new Date(),
        usuario: usuario!,
        detallesPedidos: detallesPedido,
        total: nuevoTotalPedido,
      };
      console.log("Pedido completo:", JSON.stringify(nuevoPedidoCompleto));
      setTotalPedido(nuevoTotalPedido);
      setPedidoCompleto(nuevoPedidoCompleto);
    }
  }, [usuario, cartItems, subTotal, esDelivery, esEfectivo, productos]);

  const handleConfirmarPedido = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setShowAlert(true);
      return;
    }

    if (usuario === null) {
      console.error(
        "El usuario no está cargado. No se puede confirmar el pedido."
      );
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
          const response = await axios.post(`${API_URL}pedido`, pedidoCompleto);
          console.log("Pedido enviado al servidor:", response.data);

          // Mostrar la alerta con el número de pedido generado
          if (response.data) {
            setPedidoCompleto(response.data);
            setPedidoConfirmado(true);
            clearCart();
          }
        }
      } catch (error) {
        console.error("Error al enviar el pedido:", error);
      }
    }
  };

  const handleLoginRedirect = () => {
    loginWithRedirect();
  };

  const handleEsEfectivo = (esEfectivo: boolean) => {
    setEsEfectivo(esEfectivo);
  };

  const handleEsDelivery = (esDelivery: boolean) => {
    setEsDelivery(esDelivery);
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
            <Container className="card shadow" fluid>
              {/* Mostrar el Alert cuando el carrito esté vacío */}
              {isCartEmpty && (
                <div className="container mt-4">
                  <Alert show={true} variant="warning">
                    No hay productos en el carrito. Agregue productos antes de
                    confirmar.
                  </Alert>
                </div>
              )}
              <CartTabla
                cartItems={cartItems}
                modificarCantidad={modificarCantidad}
                eliminarDetallePedido={eliminarDetallePedido}
              />
            </Container>
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
