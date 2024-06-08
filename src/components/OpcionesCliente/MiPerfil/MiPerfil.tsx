import React, { useState, useEffect } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import { IEditUsuarioPerfil, IUsuario, IEditUsuarioFromCliente } from "../../../interface/IUsuario";
import EditPerfil from "./EditPerfil";
import { useUser } from "../../../context/User/UserContext";
import AddDireccionModal from "../MiDireccion/AddDireccionModal";
import axios from "axios";
import { IDomicilio } from "../../../interface/IDomicilio";
import EditDireccionModal from "../MiDireccion/EditDireccionModal";

const MiPerfil: React.FC = () => {
  const { user, isAuthenticated } = useAuth0();
  const { usuarioContext, setUsuarioContext } = useUser();
  const defaultImage = "assets/img/EditPerfil.jpg";
  const [selectedUsuario, setSelectedUsuario] = useState<IUsuario | null>(null);
  const [editModalShow, setEditModalShow] = useState(false);
  const [showAddDireccionModal, setShowAddDireccionModal] = useState(false);
  const [showEditDireccionModal, setShowEditDireccionModal] = useState(false);
  const [selectedDireccion, setSelectedDireccion] = useState<IDomicilio | null>(null);
  const API_URL = process.env.REACT_APP_API_URL || "";

  const initialUsuarioState: IEditUsuarioPerfil = {
    id: 0,
    nombre: "",
    apellido: "",
    email: "",
    clave: "", // Default value to prevent type errors
    telefono: "",
    domicilio: {
      calle: "",
      numero: 0,
      localidad: "",
    },
  };

  const [usuario, setUsuario] = useState<IEditUsuarioPerfil>(initialUsuarioState);

  useEffect(() => {
    if (usuarioContext) {
      setUsuario({
        ...usuarioContext,
        clave: usuarioContext.clave || "", // Ensure clave is never undefined
      });
    }
  }, [usuarioContext]);

  const actualizarUsuario = (nuevosDatos: Partial<IEditUsuarioPerfil>) => {
    setUsuario((prevUsuario) => {
      const usuarioActualizado = { ...prevUsuario, ...nuevosDatos };
      setUsuarioContext((prevUsuarioContexto) => {
        return { ...(prevUsuarioContexto as IUsuario), ...nuevosDatos };
      });
      return usuarioActualizado;
    });
  };
  
  const handleEditModalOpen = () => {
    setUsuario(usuarioContext ? {
      ...usuarioContext,
      clave: usuarioContext.clave || "", // Ensure clave is never undefined
    } : initialUsuarioState);
    setEditModalShow(true);
  };

  const handleEditModalClose = () => {
    setEditModalShow(false);
  };

  const handleAddDireccionModalOpen = () => {
    setShowAddDireccionModal(true);
  };

  const handleEditDireccionModalOpen = () => {
    setShowEditDireccionModal(true);
    setSelectedDireccion(usuarioContext?.domicilio || null);
  };

  const handleDireccionModalClose = () => {
    setShowAddDireccionModal(false);
    setShowEditDireccionModal(false);
  };

  const handleDomicilioAdd = async (domicilio: IDomicilio) => {
    try {
      await axios.post(`${API_URL}usuario/${usuario?.id}/domicilio`, domicilio);
      actualizarUsuario({ domicilio });
      setShowAddDireccionModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDomicilioEdit = async (domicilio: IDomicilio) => {
    try {
      await axios.put(`${API_URL}usuario/${usuario?.id}/domicilio`, domicilio);
      actualizarUsuario({ domicilio });
      setShowEditDireccionModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePerfilEdit = async (usuarioEditado: IEditUsuarioPerfil) => {
    try {
      await axios.put(`${API_URL}usuario/${usuarioEditado.id}`, usuarioEditado);
      actualizarUsuario(usuarioEditado);
      setEditModalShow(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        backgroundImage: `url("${defaultImage}")`,
        backgroundSize: "cover",
        width:"100%"
      }}
    >
      <div className="card" style={{ width: "80%", height: "75%"}}>
        <div className="card-header">
          <h1 className="display-6 text-start"> Mi Perfil</h1>
        </div>
        <div className="card-body">
          <Row>
            <Col
              className="d-flex align-items-start justify-content-center"
              md={4}
            >
              <img
                className="rounded-circle"
                src={user?.picture}
                alt={user?.name}
                style={{ width: "80%", height: "80%"}}
              />
            </Col>
            <Col className="d-flex flex-column align-items-start" md={8} style={{fontSize:"1.2rem"}}>
              {usuario?.nombre && usuario?.apellido ? (
                <p className="card-text">
                  Nombre: {usuario?.nombre} {usuario?.apellido}
                </p>
              ) : (
                <p className="card-text">Nombre: Sin datos</p>
              )}
              {usuario?.email ? (
                <p className="card-text">Email: {usuario?.email}</p>
              ) : (
                <p className="card-text">Email: Sin datos</p>
              )}
              {usuario?.telefono ? (
                <p className="card-text">Telefono: {usuario?.telefono}</p>
              ) : (
                <p className="card-text">Telefono: Sin datos</p>
              )}
              {usuario?.domicilio ? (
                <>
                  <p className="card-text">
                    Domicilio: {usuario?.domicilio.calle},{" "}
                    {usuario?.domicilio.numero}, {usuario?.domicilio.localidad}{" "}
                    <Button
                      variant="primary"
                      onClick={handleEditDireccionModalOpen}
                    >
                      Editar
                    </Button>
                  </p>
                </>
              ) : (
                <>
                  <p className="card-text">Domicilio: Sin datos</p>
                  <Button
                    variant="primary"
                    onClick={handleAddDireccionModalOpen}
                  >
                    Agregar dirección
                  </Button>
                </>
              )}
            </Col>
          </Row>
          <Row md={8} className="d-flex justify-content-center">
            <Col>
              <Button
                variant="primary"
                onClick={handleEditModalOpen}
                className="mt-3"
              >
                Editar Perfil
              </Button>
            </Col>
          </Row>
        </div>
      </div>
      <EditPerfil
        show={editModalShow}
        handleClose={handleEditModalClose}
        handleClienteEdit={handlePerfilEdit}
        selectedUsuario={{
          ...usuario,
          clave: usuario.clave || "", // Ensure clave is never undefined
        }}
      />
      <AddDireccionModal
        show={showAddDireccionModal}
        handleClose={handleDireccionModalClose}
        handleDireccionAdd={handleDomicilioAdd}
      />
      <EditDireccionModal
        show={showEditDireccionModal}
        handleClose={handleDireccionModalClose}
        handleDireccionEdit={handleDomicilioEdit}
        selectedDireccion={selectedDireccion}
      />
    </div>
  );
};

export default MiPerfil;
