import React, { useEffect, useState } from "react";
import CartTabla from "./CartTabla";
import CartTarjeta from "./CartTarjeta";
import { CartItem } from "./CartProvider";
import axios from 'axios';
import { Pedido } from "../../interface/Pedido";
import { DetallePedido } from "../../interface/DetallePedido";
import { Usuario } from "../../interface/Usuario";
import { Producto } from "../../interface/Producto";
import { useAuth0 } from "@auth0/auth0-react";


interface ConfirmacionPedidoProps {
  cartItems: CartItem[];
  modificarCantidad: (id: number, cantidad: number) => void;
  eliminarDetallePedido: (id: number) => void;
  onCancel: () => void;
  onContinue: () => void;
}

const ConfirmacionPedido: React.FC<ConfirmacionPedidoProps> = ({
  cartItems,
  modificarCantidad,
  eliminarDetallePedido,
  onCancel,
  onContinue
}) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [productos, setProductos] = useState<Producto[] | null>(null);
  const [subTotal, setSubTotal] = useState(0);
  const [pedidoCompleto, setPedidoCompleto] = useState<Pedido | null>(null);
  const [esDelivery, setEsDelivery] = useState(true);
  const [esEfectivo, setEsEfectivo] = useState(true);
  const [totalPedido, setTotalPedido] = useState(0);
  const descuento = 0.1; // Descuento del 10% (0.1)
  const costoDelivery = 500;
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const response = await axios.get("/assets/data/clienteTabla.json");
        const usuarioData = response.data[0];
        setUsuario(usuarioData);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchProductos = async () => {
      try {
        const response = await axios.get("/assets/data/productosLanding.json");
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

  const handleEsEfectivo = (esEfectivo: boolean) => {
    setEsEfectivo(esEfectivo);
  };

  // Cambia el nombre de la función y la prop de tipoEnvio a esDelivery
  const handleEsDelivery = (esDelivery: boolean) => {
    setEsDelivery(esDelivery);
  };

  const convertirCartItemADetallePedido = (cartItem: CartItem): DetallePedido => {
    const productoEncontrado = productos?.find(producto => producto.idProducto === cartItem.id);

    if (productoEncontrado) {
      const detallePedido: DetallePedido = {
        idDetallePedido: 0,
        cantidad: cartItem.quantity,
        Productos:
        {
          idProducto: productoEncontrado.idProducto,
          nombre: productoEncontrado.nombre,
          tiempoEstimadoCocina: productoEncontrado.tiempoEstimadoCocina,
          denominacion: productoEncontrado.denominacion,
          imagen: productoEncontrado.imagen,
          stockMinimo: productoEncontrado.stockMinimo,
          stockActual: productoEncontrado.stockActual,
          preparacion: productoEncontrado.preparacion,
          precio: productoEncontrado.precio,
          esBebida: productoEncontrado.esBebida,
          estado: productoEncontrado.estado,
          Rubro: {
            idRubro: productoEncontrado.Rubro.idRubro,
            nombre: productoEncontrado.Rubro.nombre,
          },
          ProductoIngrediente: [],
        },

      };
      return detallePedido;
    } else {
      throw new Error(`Producto con ID ${cartItem.id} no encontrado.`);
    }
  };

  useEffect(() => {
    if (usuario !== null && cartItems.length > 0) {
      const domicilioUsuario = usuario.Domicilio;

      // Calcula el total del pedido aquí
      const nuevoTotalPedido =
        esDelivery ? subTotal + costoDelivery : subTotal - subTotal * descuento;

      const nuevoPedidoCompleto: Pedido = {
        idPedido: 0,
        numeroPedido: 0,
        horaEstimadaFin: new Date(),
        esDelivery: esDelivery,
        esEfectivo: esEfectivo,
        estadoPedido: "A confirmar",
        fechaPedido: new Date(),
        Usuario: {
          idUsuario: usuario.idUsuario,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          email: usuario.email,
          clave: usuario.clave,
          claveConfirm: usuario.claveConfirm,
          telefono: usuario.telefono,
          estado: usuario.estado,
          Domicilio: domicilioUsuario,
          Rol: {
            idRol: usuario.Rol.idRol,
            nombreRol: usuario.Rol.nombreRol,
          },
        },
        DetallePedido: cartItems.map(convertirCartItemADetallePedido),
        totalPedido: nuevoTotalPedido,
      };

      setTotalPedido(nuevoTotalPedido); // Actualiza el estado del total del pedido
      setPedidoCompleto(nuevoPedidoCompleto);
      console.log("Se cargó el Pedido");
    }
  }, [usuario, cartItems, subTotal, esDelivery, esEfectivo]);

  const handleConfirmarPedido = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      // El usuario no ha iniciado sesión, muestra un mensaje y un botón para iniciar sesión.
      alert("Por favor, inicie sesión para confirmar el pedido.");
      loginWithRedirect(); // Redirige al usuario a la página de inicio de sesión de Auth0.
      return;
    }

    if (pedidoCompleto !== null) {
      pedidoCompleto?.DetallePedido.forEach((detalle, index) => {
        console.log(`Detalle ${index + 1}:`);
        console.log("ID del Producto:", detalle.Productos.idProducto);
        console.log("Nombre del Producto:", detalle.Productos.nombre);
        console.log("Precio del Producto:", detalle.Productos.precio);
        console.log("Cantidad del Producto:", detalle.cantidad);
        console.log("Es delivery:", pedidoCompleto.esDelivery);
        console.log("Es efectivo:", pedidoCompleto.esEfectivo);
        console.log("Fecha Pedido:", pedidoCompleto.fechaPedido);
        console.log("Estado Pedido:", pedidoCompleto.estadoPedido);
        console.log("Total Pedido:", pedidoCompleto.totalPedido);
      });

      try {
        const response = await axios.post("/api/pedido", pedidoCompleto);
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
              domicilio={usuario ? usuario.Domicilio : null}
              subTotal={subTotal}
              totalPedido={totalPedido} />
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
