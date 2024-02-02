import React, { useState, useEffect } from 'react';
import { Container, Col, Row, Form, Alert } from 'react-bootstrap';
import EditIngredienteModal from './EditIngredienteModal';
import AddIngredienteModal from './AddIngredienteModal';
import { IIngredientes } from '../../../interface/IIngredientes';
import { handleRequest } from '../../FuncionRequest/FuncionRequest';
import { IAction, IColumn } from '../../../interface/ICamposTablaGenerica';
import GenericTable from "../../GenericTable/GenericTable";
import { IRubro } from "../../../interface/IRubro";

const Ingrediente: React.FC = () => {
  // Estados del componente
  const [editModalShow, setEditModalShow] = useState(false);
  const [addModalShow, setAddModalShow] = useState(false);
  const [selectedIngrediente, setSelectedIngrediente] = useState<IIngredientes | null>(null);
  const [ingred, setIngred] = useState<IIngredientes[]>([]);
  const [ingredComplete, setIngredComplete] = useState<IIngredientes[]>([]);
  const [rubros, setRubros] = useState<IRubro[]>([]);
  const [selectedRubro, setSelectedRubro] = useState<number | null>(null);
  const [selectedRubroName, setSelectedRubroName] = useState<string>("");
  const [filteredIngredientes, setFilteredIngredientes] = useState<IIngredientes[]>([]);
  const API_URL = process.env.REACT_APP_API_URL || "";
  const [filterOption, setFilterOption] = useState<string>("all");
  const [cartel, setCartel] = useState(false);

  // Configuración de acciones y columnas de la tabla
  const actions: IAction = {
    create: true,
    update: true,
    delete: true
  };

  const columns: IColumn<IIngredientes>[] = [
    // Definición de las columnas...
    { title: 'ID', field: 'id' },
    { title: 'Nombre', field: 'nombre' },
    {
      title: 'Rubro',
      field: 'rubro', render: (
        ingredientes: IIngredientes) =>
        <span>{`${ingredientes.rubro.nombre}`}</span>
    },
    { title: 'Precio', field: 'precioCosto' },
    { title: 'Min Stock', field: 'stockMinimo' },
    { title: 'Stock Actual', field: 'stockActual' },
    { title: 'UM', field: 'unidadMedida' },
    {
      title: "Estado",
      field: "activo",
      render: (ingredientes: IIngredientes) => (
        <span className={`${ingredientes.activo ? "text-success" : "text-danger"}`}>
          {ingredientes.activo ? <h2><i className="bi bi-unlock-fill "></i></h2> : <h2><i className="bi bi-lock-fill"></i></h2>}
        </span>
      ),
    },
  ];

  // Filtrar ingredientes según el rubro seleccionado
  useEffect(() => {
    const filterIngredientes = () => {
      if (selectedRubro) {
        const filtered = ingredComplete.filter(
          (ingrediente) => ingrediente.rubro.id === selectedRubro
        );
        setFilteredIngredientes(filtered);
      } else {
        setFilteredIngredientes(ingredComplete);
      }
    };

    if (ingredComplete.length > 0) {
      filterIngredientes();
    }
  }, [selectedRubro, ingredComplete]);

  // Cargar ingredientes y rubros al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      // Obtener ingredientes desde la API
      try {
        let url = API_URL + "ingrediente";

        if (filterOption === "active") {
          url = API_URL + "ingrediente/active";
        } else if (filterOption === "inactive") {
          url = API_URL + "ingrediente/inactive";
        }

        const responseData = await handleRequest('GET', url);
        setIngred(responseData);
        setIngredComplete(responseData);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchRubros = async () => {
      // Obtener rubros desde la API
      try {
        const responseData = await handleRequest("GET", API_URL + "rubro");
        setRubros(responseData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchRubros();
    fetchData();
  }, [filterOption]);

  // Agregar nuevo ingrediente mediante la API
  const handleIngredienteAdd = async (Ingredientes: IIngredientes) => {
    try {
      const newProducto = await handleRequest('POST', API_URL + "ingrediente", Ingredientes);
      setIngred([...ingred, newProducto]);
      setIngredComplete([...ingredComplete, newProducto]);
    } catch (error) {
      console.log(error);
    }
  };

  // Editar ingrediente existente mediante la API
  const handleIngredienteEdit = async (producto: IIngredientes) => {
    try {
      const updatedProducto = await handleRequest('PUT', `${API_URL + "ingrediente"}/${producto.id}`, producto);

      if (updatedProducto) {
        const newData = ingred.map((item) =>
          item.id === producto.id ? updatedProducto : item
        );
        setIngred(newData);
        setIngredComplete(newData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Eliminar ingrediente mediante la API (esta por las dudas pero no tiene funcion)
  const handleIngredienteDelete = async (item: IIngredientes) => {
    const itemId: number = item.id || 0;

    try {
      await handleRequest('DELETE', `${API_URL + "ingrediente"}/${itemId}`);
      setIngred(ingred.filter((item) => item.id !== itemId));
      setIngredComplete(ingred.filter((item) => item.id !== itemId));
      console.log("Ingrediente eliminado correctamente");
    } catch (error) {
      console.log("Error al eliminar Ingrediente:", error);
    }
  };

  // Función para obtener un ingrediente por ID
  const ingredienteGeneric = (id: number) => {
    // Obtener un ingrediente por ID
    let i: number = 0;
    let x: boolean = true;
    while (x) {
      if (i >= ingredComplete.length) {
        // No se encontró el ingrediente, salir del ciclo
        x = false;
      } else if (ingredComplete[i].id === +id) {
        // Ingrediente encontrado
        return ingredComplete[i];
      }
      i = i + 1;
    }
    return ingredComplete[0];
  };

  // Abrir modal de edición con los datos del ingrediente
  const handleEditModalOpen = (item: IIngredientes) => {
    if (item.id !== undefined) {
      setSelectedIngrediente(ingredienteGeneric(item.id));
      setEditModalShow(true);
    } else {
      console.error("ID del ingrediente es undefined");
    }
  };


  // Cerrar modal de edición
  const handleEditModalClose = () => {
    setSelectedIngrediente(null);
    setEditModalShow(false);
  };

  // Abrir modal de agregar
  const handleAddModalOpen = () => {
    setAddModalShow(true);
  };

  // Cerrar modal de agregar
  const handleAddModalClose = () => {
    setAddModalShow(false);
  };

  // Manejar cambio de selección de rubro
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    const selectedOption = event.currentTarget.options[event.currentTarget.selectedIndex];
    const selectedRubroId = parseInt(value);
    const selectedRubro = rubros.find((rubro) => rubro.id === selectedRubroId);
    setSelectedRubro(selectedRubroId ? selectedRubroId : null);
    setSelectedRubroName(selectedOption.text);
  };

  // Mensaje cuando no hay ingredientes con el rubro seleccionado
  const noProductosMessage =
    selectedRubro && filteredIngredientes.length === 0 ? (
      <div className="d-inline-block text-center alert-container">
        <Alert variant="info" className="p-3">
          No hay ingredientes disponibles con el rubro seleccionado.
        </Alert>
      </div>
    ) : null;

  return (
    <div>
      <Container fluid>
        <Row>
          <Col>
            {noProductosMessage}
          </Col>
        </Row>
        <Row className="mt-3">
          <Col sm={3} className="mb-3">
            <Form.Group controlId="id">
              <select
                className="form-select"
                name="id"
                value={selectedRubro ? selectedRubro : ""}
                onChange={handleSelectChange}
                style={{ width: "100%" }}
              >
                <option value="">Todos los rubros</option>
                {rubros.map((rubro) => (
                  <option key={rubro.id} value={rubro.id}>
                    {rubro.nombre}
                  </option>
                ))}
              </select>
            </Form.Group>
          </Col>
          <Col sm={2} className="mb-3">
            <Form.Group controlId="filterOption">
              <select
                className="form-select"
                name="filterOption"
                value={filterOption}
                onChange={(e) => setFilterOption(e.target.value)}
                style={{ width: "100%" }}
              >
                <option value="all">Todos</option>
                <option value="active">Activos</option>
                <option value="inactive">Inactivos</option>
              </select>
            </Form.Group>
          </Col>
        </Row>

        {/* Tabla de ingredientes */}
        <GenericTable
          data={filteredIngredientes}
          columns={columns}
          actions={actions}
          onAdd={handleAddModalOpen}
          onUpdate={handleEditModalOpen}
          onDelete={handleIngredienteDelete}
        />

        {/* Modales de edición y adición */}
        <EditIngredienteModal
          show={editModalShow}
          handleClose={handleEditModalClose}
          handleIngredientesEdit={handleIngredienteEdit}
          selectedIngredientes={selectedIngrediente}
        />
        <AddIngredienteModal
          show={addModalShow}
          handleClose={handleAddModalClose}
          handleIngredienteAdd={handleIngredienteAdd}
        />
      </Container>
    </div>

  );
};

export default Ingrediente;
