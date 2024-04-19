import React, { useState, useEffect } from "react";
import { IIngredientes } from "../../../interface/IIngredientes";
import EditCompraIngredientesModal from "./EditCompraIngredientesModal";
import { Button, Col, Container, Form, Modal, Row } from "react-bootstrap";
import axios from "axios";
import GenericTable from "../../GenericTable/GenericTable";
import { IColumn } from "../../../interface/ICamposTablaGenerica";

const CompraIngrediente: React.FC = () => {
  const [ingredientes, setIngredientes] = useState<IIngredientes[]>([]);
  const stockMinimoPercentage = 20;
  const [editModalShow, setEditModalShow] = useState(false);
  const [selectedIngrediente, setSelectedIngrediente] =
    useState<IIngredientes | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [filterOption, setFilterOption] = useState<string>("all");
  const API_URL = process.env.REACT_APP_API_URL || "";

  useEffect(() => {
    axios
      .get(API_URL + "ingrediente")
      .then((response) => {
        setIngredientes(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [filterOption]);

  useEffect(() => {
    // Verificar bajo stock después de cada actualización
    let todosConMasStock = false;
    let bucle = false;
    ingredientes.forEach((item) => {
      bucle = true;
      const difference = item.stockActual - item.stockMinimo;
      if (
        difference <= 0 ||
        difference <= (stockMinimoPercentage / 100) * item.stockMinimo
      ) {
        todosConMasStock = true;
        setModalMessage(
          `${item.nombre} está bajo en stock o por llegar al minimo!`
        );
        setShowModal(true);
        return; // Salir del bucle si se muestra una alerta
      }
    });
    if (!todosConMasStock && bucle) {
      setModalMessage("¡Todos los productos tienen suficiente stock!");
      setShowModal(true);
    }
  }, []);

  // Columnas para la tabla
  const columns: IColumn<IIngredientes>[] = [
    { title: "Nombre", field: "nombre" },
    { title: "Stock Mínimo", field: "stockMinimo" },
    { title: "Stock Actual", field: "stockActual" },
    { title: "Precio Costo", field: "precioCosto" },
    { title: "Unidad de Medida", field: "unidadMedida" },
    {
      title: "Estado",
      field: "activo",
      render: (ingrediente: IIngredientes) => (
        <span
          className={`${ingrediente.activo ? "text-success" : "text-danger"}`}
        >
          {ingrediente.activo ? (
            <h2>
              <i className="bi bi-unlock-fill "></i>
            </h2>
          ) : (
            <h2>
              <i className="bi bi-lock-fill"></i>
            </h2>
          )}
        </span>
      ),
    },
    {
      title: "Rubro",
      field: "rubro",
      render: (ingredientes: IIngredientes) => (
        <span>{`${
          ingredientes.rubro ? ingredientes.rubro.nombre || "" : ""
        }`}</span>
      ),
    },

    // Calcula el Stock Dif
    {
      title: "Stock Dif",
      render: (row: IIngredientes) => (
        <span
          className={`badge ${
            row.stockActual - row.stockMinimo < 0 ? "bg-danger" : "bg-success"
          }`}
        >
          {`${row.stockActual - row.stockMinimo}`}
        </span>
      ),
      field: "nombre",
      showColumn: true,
    },
  ];

  //Abrir modal de edición
  const openEditModal = () => {
    setEditModalShow(true);
  };

  //Cerrar modal de edición
  const handleEditModalClose = () => {
    setSelectedIngrediente(null);
    setEditModalShow(false);
  };

  //Editar ingrediente, se envía a la API y se actualiza el estado del mismo
  const handleIngredienteEdit = async (
    ingrediente: IIngredientes,
    cantidad: number
  ) => {
    try {
      const { id } = ingrediente;
      const updatedIngrediente = await axios.put(
        `${API_URL}ingrediente/${id}/addStock/${cantidad}`
      );

      const newData = ingredientes.map((item) =>
        item.id === id ? updatedIngrediente.data : item
      );

      setIngredientes(newData);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container>
      <Row>
        <Col>
          <h2 className="display-6 text-center mb-3">
            Ingredientes Bajos de Stock
          </h2>
          <div className="d-flex justify-content-start align-items-center mb-1">
            <Button variant="primary" className="me-2" onClick={openEditModal}>
              Comprar <i className="bi bi-cart-plus-fill fs-5 ms-2"></i>
            </Button>
            <div className="d-flex align-items-center">
              <Form.Select
                value={filterOption}
                onChange={(e) => setFilterOption(e.target.value)}
              >
                <option value="all">Mostrar Todos</option>
                <option value="active">Mostrar solo Activos</option>
                <option value="inactive">Mostrar solo Inactivos</option>
              </Form.Select>
            </div>
          </div>
          <GenericTable
            data={ingredientes.filter((ingrediente) => {
              return (
                filterOption === "all" ||
                (filterOption === "active" && ingrediente.activo) ||
                (filterOption === "inactive" && !ingrediente.activo)
              );
            })}
            columns={columns}
            actions={{}} // No permitir acciones
            showDate={false} // No mostrar opciones de búsqueda por fecha
            onSearch={false} // No mostrar buscador
          />
          <EditCompraIngredientesModal
            show={editModalShow}
            handleClose={handleEditModalClose}
            handleIngredientesEdit={handleIngredienteEdit}
            selectedIngredientes={selectedIngrediente}
          />
          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Body>{modalMessage}</Modal.Body>
            </Modal.Header>
            <Modal.Footer style={{ padding: "5px" }}>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cerrar
              </Button>
            </Modal.Footer>
          </Modal>
        </Col>
      </Row>
    </Container>
  );
};

export default CompraIngrediente;
