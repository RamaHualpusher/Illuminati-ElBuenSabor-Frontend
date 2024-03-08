import React, { useEffect, useState } from "react";
import CartTabla from "./CartTabla";
import CartTarjeta from "./CartTarjeta";
import { CartItem } from "../../context/cart/CartProvider";
import axios from 'axios';
import { IPedido } from "../../interface/IPedido";
import { IProducto } from "../../interface/IProducto";
import { IUsuario } from "../../interface/IUsuario";
import { useAuth0 } from "@auth0/auth0-react";
import { IDetallePedido } from "../../interface/IDetallePedido";
import { Alert, Button } from 'react-bootstrap';


interface ConfirmacionPedidoProps {
  cartItems: CartItem[];
  modificarCantidad: (id: number, cantidad: number) => void;
  eliminarDetallePedido: (id: number) => void;
  onCancel: () => void;
  onContinue: () => void;
  isCartEmpty: boolean; // Recibe la prop isCartEmpty
}

const ConfirmacionPedido: React.FC<ConfirmacionPedidoProps> = ({
  cartItems,
  modificarCantidad,
  eliminarDetallePedido,
  onCancel,
  onContinue,
  isCartEmpty, // Usa la prop isCartEmpty
}) => {
  const [usuario, setUsuario] = useState<IUsuario | null>(null);
  const [productos, setProductos] = useState<IProducto[] | null>(null);
  const [subTotal, setSubTotal] = useState(0);
  const [pedidoCompleto, setPedidoCompleto] = useState<IPedido | null>(null);
  const [esDelivery, setEsDelivery] = useState(true);
  const [esEfectivo, setEsEfectivo] = useState(true);
  const [totalPedido, setTotalPedido] = useState(0);
  const descuento = 0.1; // Descuento del 10% (0.1)
  const costoDelivery = 500;
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const [showAlert, setShowAlert] = useState(!isAuthenticated);
  const [confirmDisabled, setConfirmDisabled] = useState(!isAuthenticated);
  const API_URL = process.env.REACT_APP_API_URL || "";

  // Almacena la URL actual antes de redirigir
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  // Variable de estado para almacenar la URL anterior
  const [returnUrl, setReturnUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const response = await axios.get(`${API_URL}usuario/clientes`);
        const usuarioData = response.data[0];
        setUsuario(usuarioData);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchProductos = async () => {
      try {
        const response = await axios.get(`${API_URL}producto`);
        console.log(response)
        setProductos(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProductos();
    fetchUsuario();
  }, []);

  useEffect(() => {
    const totalProducto = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    setSubTotal(totalProducto);
  }, [cartItems]);

  useEffect(() => {
    // Después del inicio de sesión, redirige al usuario de vuelta a la página original
    if (isAuthenticated && returnUrl) {
      window.location.href = returnUrl;
    }
  }, [isAuthenticated, returnUrl]);


  // Almacena la URL actual antes de redirigir
  const handleLoginRedirect = () => {
    setReturnUrl(window.location.href);
    loginWithRedirect();
  };

  const handleEsEfectivo = (esEfectivo: boolean) => {
    setEsEfectivo(esEfectivo);
  };

  // Cambia el nombre de la función y la prop de tipoEnvio a esDelivery
  const handleEsDelivery = (esDelivery: boolean) => {
    setEsDelivery(esDelivery);
  };

  const convertirCartItemADetallePedido = (cartItem: CartItem): IDetallePedido => {
    // Verificar si productos es null o no está definido
    if (!productos) {
        throw new Error("La lista de productos está vacía.");
    }
    
    const productoEncontrado = productos.find(producto => producto.id === cartItem.id);
    
    if (productoEncontrado) {
      // Imprimir el producto encontrado para verificar que tenga el id esperado
      console.log("Producto encontrado:", productoEncontrado);
      
      const detallePedido: IDetallePedido = {
        id: Math.floor(Math.random()*1000),
        cantidad: cartItem.quantity,
        Productos: productoEncontrado        
      };
      
      return detallePedido;
    } else {
      throw new Error(`Producto con ID ${cartItem.id} no encontrado.`);
    }
};

  useEffect(() => {
    if (usuario !== null && cartItems.length > 0) {
      const domicilioUsuario = usuario.domicilio;

      // Calcula el total del pedido aquí
      const nuevoTotalPedido =
        esDelivery ? subTotal + costoDelivery : subTotal - subTotal * descuento;

      const nuevoPedidoCompleto: IPedido = {
        numeroPedido: 0,
        horaEstimadaFin: new Date(),
        esDelivery: esDelivery,
        esEfectivo: esEfectivo,
        estadoPedido: "A confirmar",
        fechaPedido: new Date(),
        Usuario: {
          id: usuario.id,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          email: usuario.email,
          clave: usuario.clave,
          claveConfirm: usuario.claveConfirm,
          telefono: usuario.telefono,
          activo: usuario.activo,
          domicilio: domicilioUsuario,
          rol: {
            id: usuario.rol.id,
            nombreRol: usuario.rol.nombreRol,
          },
        },
        DetallePedido: cartItems.map(convertirCartItemADetallePedido),        
      };

      setTotalPedido(nuevoTotalPedido); // Actualiza el estado del total del pedido
      setPedidoCompleto(nuevoPedidoCompleto);
      console.log("Se cargó el Pedido");
    }
  }, [usuario, cartItems, subTotal, esDelivery, esEfectivo]);

  const handleConfirmarPedido = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      // El usuario no ha iniciado sesión, muestra un mensaje de alerta.
      setShowAlert(true);
      return;
    }


    if (pedidoCompleto !== null) {

      // pedidoCompleto?.DetallePedido.forEach((detalle, index) => {
      //   console.log(`Detalle ${index + 1}:`);
      //   console.log("---------------------------------");
      //   console.log("Pedido:");
      //   console.log("Es delivery:", pedidoCompleto.esDelivery);
      //   console.log("Es efectivo:", pedidoCompleto.esEfectivo);
      //   console.log("Fecha Pedido:", pedidoCompleto.fechaPedido);
      //   console.log("Estado Pedido:", pedidoCompleto.estadoPedido);
      //   console.log("Total Pedido:", pedidoCompleto.totalPedido);
      //   console.log("---------------------------------");
      //   console.log("Productos:");
      //   console.log("Cantidad del Producto:", detalle.cantidad);
      //   console.log("Producto:", detalle.Productos.nombre);
      //   console.log("Tiempo Producto:", detalle.Productos.tiempoEstimadoCocina);
      //   console.log("Imagen Producto:", detalle.Productos.imagen);
      //   console.log("Precio individual Producto", detalle.Productos.precio);
      //   console.log("Preparacion Producto", detalle.Productos.preparacion);
      //   console.log("Es bebida Producto", detalle.Productos.esBebida);
      //   console.log("Estado Producto", detalle.Productos.estado);
      //   console.log("Rubro Producto", detalle.Productos.Rubro.nombre);
      //   console.log("---------------------------------");
      //   console.log("ProductosIngredientes:");
      //   detalle.Productos.ProductoIngrediente?.forEach((prodIng, prodIngIndex) => {
      //     console.log(`ProductoIngrediente ${prodIngIndex + 1}:`);
      //     console.log("Cantidad:", prodIng.cantidad);
      //     console.log("Nombre Ingrediente:", prodIng.Ingredientes.nombre);
      //     console.log("Precio Costo Ingrediente:", prodIng.Ingredientes.precioCosto);
      //     console.log("Unidad Medida Ingrediente:", prodIng.Ingredientes.unidadMedida);
      //      console.log("Rubro Ingrediente:", prodIng.Ingredientes.Rubro.nombre);
      //   });

      // });

      try {
        const response = await axios.post(`${API_URL}pedido`, pedidoCompleto); //Cambiar la url
        console.log("Pedido enviado al servidor:", response.data);
      } catch (error) {
        console.error("Error al enviar el pedido:", error);
      }
    }
  };

  return (
    <div style={{ marginTop: "90px" }}>
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
              totalPedido={totalPedido} />
          </div>
        </div>
      </div>

      <form onSubmit={handleConfirmarPedido}>
        <div className="d-flex justify-content-center align-items-center mb-4">
          <button type="submit"
            className="btn btn-primary me-2"
            disabled={confirmDisabled || isCartEmpty}>
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
      {/* Mostrar el Alert cuando el carrito esté vacío */}
      {isCartEmpty && (
        <div className="container mt-3">
          <Alert show={true} variant="warning">
            No hay productos en el carrito. Agregue productos antes de confirmar.
          </Alert>
        </div>
      )}

      <div className="container mt-3">
        <Alert show={showAlert} variant="danger">
          Por favor, inicie sesión para confirmar el pedido.    <br />
          <div className="mt-1">
            <Button variant="primary" onClick={handleLoginRedirect}>
              Iniciar Sesión
            </Button>
          </div>

        </Alert>
      </div>
    </div>
  );
};

export default ConfirmacionPedido;
