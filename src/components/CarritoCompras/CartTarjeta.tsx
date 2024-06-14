import React, { useState, useEffect } from "react";
import { IDomicilio } from "../../interface/IDomicilio";
import { IEditUsuarioFromCliente, IUsuario } from "../../interface/IUsuario";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import AddDireccionModal from "../OpcionesCliente/MiDireccion/AddDireccionModal";
import EditDireccionModal from "../OpcionesCliente/MiDireccion/EditDireccionModal";
import EditPerfil from "../OpcionesCliente/MiPerfil/EditPerfil";

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
  usuario,
}) => {
  const costoDelivery = 500;
  const descuentoEfectivo = 0.1; // Descuento del 10% para pago en efectivo

  const [calle, setCalle] = useState("");
  const [numero, setNumero] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editModalShow, setEditModalShow] = useState(false);
  const [addModalShow, setAddModalShow] = useState(false);
  const [perfilModal, setPerfilModal] = useState(false);
  const [selectedDireccion, setSelectedDireccion] = useState<IDomicilio | null>(
    null
  );
  const { isAuthenticated, user } = useAuth0();
  const API_URL = process.env.REACT_APP_API_URL || "";
  const [nuevoDomicilio, setNuevoDomicilio] = useState<IDomicilio | null>(
    domicilio
  );

  useEffect(() => {
    const obtenerDomicilioUsuario = async () => {
      try {
        const response = await axios.get(
          `${API_URL}usuario/${user?.id}/domicilio`
        );
        return response.data;
      } catch (error) {
        console.error("Error al obtener la dirección del usuario:", error);
      }
    };
  }, [user?.id, API_URL]);

  useEffect(() => {
    if (domicilio) {
      setCalle(domicilio.calle || "");
      setNumero(domicilio.numero ? domicilio.numero.toString() : "");
      setLocalidad(domicilio.localidad || "");
    }
  }, [domicilio]);

  useEffect(() => {
    if (esDelivery) {
      handleEsEfectivo(false);
    }
  }, [esDelivery, handleEsEfectivo]);

  const handleClickDelivery = () => {
    handleEsDelivery(true);
    if (usuario && usuario?.domicilio) {
      setNuevoDomicilio(usuario?.domicilio);
    } else {
      setModalAbierto(true);
    }
  };

  const handleClickRetiroLocal = () => {
    handleEsDelivery(false);
    handleEsEfectivo(false);
  };

  const handleClickEfectivo = () => {
    handleEsEfectivo(true);
    !esDelivery;
  };

  const handleEditModalOpen = () => {
    setEditModalShow(true);
    setSelectedDireccion(domicilio);
  };

  const handleEditModalClose = () => {
    setEditModalShow(false);
  };

  const handleAddModalOpen = () => {
    setAddModalShow(true);
  };

  const handleAddModalClose = () => {
    setAddModalShow(false);
  };

  const handleClickMercadoPago = () => {
    handleEsEfectivo(false);
    !esEfectivo;
  };

  const handleCloseModal = () => {
    setModalAbierto(false);
  };

  const handleAddPerfilModalOpen = () => {
    setPerfilModal(true);
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (calle && numero && localidad) {
      const nuevaDireccion: IDomicilio = {
        activo: true,
        calle: calle,
        numero: parseInt(numero),
        localidad: localidad,
      };

      try {
        const domicilioUsuario = domicilio;

        if (domicilioUsuario) {
          domicilioUsuario.activo = true;
          domicilioUsuario.calle = nuevaDireccion.calle;
          domicilioUsuario.numero = nuevaDireccion.numero;
          domicilioUsuario.localidad = nuevaDireccion.localidad;

          await axios.put(
            `${API_URL}usuario/${usuario?.id}/domicilio`,
            domicilioUsuario
          );
          setNuevoDomicilio(domicilioUsuario);
        } else {
          await axios.post(`${API_URL}domicilio`, {
            ...nuevaDireccion,
            usuario: usuario,
          });
          setNuevoDomicilio(nuevaDireccion);
        }
        setModalAbierto(false);
      } catch (error) {
        console.error("Error al guardar la dirección:", error);
      }
    }
  };

  const handleDomicilioEdit = async (domicilio: IDomicilio) => {
    try {
      await axios.put(`${API_URL}usuario/${usuario?.id}/domicilio`, domicilio);
      setNuevoDomicilio(domicilio);
      setEditModalShow(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDomicilioAdd = async (domicilio: IDomicilio) => {
    try {
      await axios.post(`${API_URL}usuario/${usuario?.id}/domicilio`, domicilio);
      setAddModalShow(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClickDireccion = () => {
    setModalAbierto(true);
  };

  const calcularTotalPedido = () => {
    let total = subTotal;
    if (esDelivery) {
      total += costoDelivery;
    }
    if (esEfectivo) {
      total -= subTotal * descuentoEfectivo;
    }
    return total;
  };

  const handlePerfilModalClose = () => {
    setPerfilModal(false);
  };

  const handlePerfilEdit = async (editedUsuario: IEditUsuarioFromCliente) => {
    try {
      console.log(editedUsuario)
      await axios.put(
        `${API_URL}usuario/actualizar/${editedUsuario.id}`,
        editedUsuario
      );
      //actualizarUsuario(editedUsuario);
      setEditModalShow(false);
    } catch (error) {
      console.log(error);
    }
    handlePerfilModalClose();
  };

  return (
    <div className="d-flex justify-content-center align-items-center mb-4">
      <div className="card shadow" style={{ width: "25rem" }}>
        <h5 className="card-header">
          <div
            className="btn-group"
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
              onChange={handleClickDelivery}
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
              onChange={handleClickRetiroLocal}
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
                <strong>Dirección: </strong>
                {domicilio ? (
                  <span style={{ marginLeft: "10px" }}>
                    <>
                      {esDelivery ? (
                        <>
                          <span>
                            {domicilio.calle}, {domicilio.numero},{" "}
                            {domicilio.localidad}
                          </span>
                          <br />
                          <button
                            className="btn btn-success ms-2 mt-1 mb-2"
                            onClick={handleEditModalOpen}
                          >
                            Cambiar Dirección
                          </button>
                        </>
                      ) : (
                        <span>
                          Retiro en el Local{" "}
                          <span
                            className="icon"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              window.open(
                                "https://maps.app.goo.gl/aCW5vzKe88XF2poYA",
                                "_blank"
                              );
                            }}
                          >
                            <i className="bi bi-geo-alt-fill text-black"></i>
                          </span>
                        </span>
                      )}
                    </>
                  </span>
                ) : (
                  <button
                    className="btn btn-success"
                    onClick={handleAddModalOpen}
                  >
                    Agregar Dirección
                  </button>
                )}
              </p>
              <p className="lead mb-0">
                {usuario?.telefono ? (
                  <strong>Teléfono {usuario.telefono}</strong>
                ) : (
                  <>
                    <strong>Teléfono:</strong>
                    <button
                      className="btn btn-success ms-2 mt-1 mb-2"
                      onClick={handleAddPerfilModalOpen}
                    >
                      Agregar Teléfono
                    </button>
                  </>
                )}
              </p>

              <div className="mb-0">
                <p className="lead">
                  <strong>SubTotal: </strong>${subTotal}
                </p>
                {!esDelivery && esEfectivo && (
                  <>
                    <p className="lead">
                      <strong>Descuento:</strong> {descuentoEfectivo * 100}%
                    </p>
                  </>
                )}
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
              </div>
            </div>
          </div>
        </div>
        <div className="card-footer">
          <div className="container-fluid">
            <div className="d-flex flex-column align-items-center">
              <h5>Método de Pago</h5>
              <div className="d-flex justify-content-center">
                <div className="mb-0 me-2">
                  <input
                    type="radio"
                    className="btn-check"
                    id="mercadoPago-outlined"
                    autoComplete="off"
                    checked={esDelivery || !esEfectivo}
                    onChange={handleClickMercadoPago}
                  />
                  <label
                    className={
                      esDelivery ? "btn btn-primary" : "btn btn-outline-primary"
                    }
                    htmlFor="mercadoPago-outlined"
                  >
                    Mercado Pago
                  </label>
                </div>
                {!esDelivery && (
                  <div className="mb-0 me-2">
                    <input
                      type="radio"
                      className="btn-check"
                      id="efectivo-outlined"
                      autoComplete="off"
                      checked={!esDelivery && esEfectivo}
                      onChange={handleClickEfectivo}
                    />
                    <label
                      className={
                        !esDelivery && esEfectivo
                          ? "btn btn-primary"
                          : "btn btn-outline-primary"
                      }
                      htmlFor="efectivo-outlined"
                    >
                      Efectivo
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <AddDireccionModal
        show={addModalShow}
        handleClose={handleAddModalClose}
        handleDireccionAdd={handleDomicilioAdd}
      />
      <EditDireccionModal
        show={editModalShow}
        handleClose={handleEditModalClose}
        handleDireccionEdit={handleDomicilioEdit}
        selectedDireccion={selectedDireccion}
      />
      <EditPerfil
      show={perfilModal}
      handleClose={handlePerfilModalClose}
      selectedUsuario={usuario}
      handleClienteEdit={handlePerfilEdit}
      />
    </div>
  );
};

export default CartTarjeta;
