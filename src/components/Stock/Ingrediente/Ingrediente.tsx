import React, { useState, useEffect } from 'react';
import { Container, Col, Row, Form } from 'react-bootstrap';
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
  const API_URL = "/assets/data/ingredientesEjemplo.json";
  const API_URL_Rubro = "assets/data/rubrosIngredientesEjemplo.json";

  // Configuración de acciones y columnas de la tabla
  const actions: IAction = {
    create: true,
    update: true
  };

  const columns: IColumn<IIngredientes>[] = [
    // Definición de las columnas...
    { title: 'ID', field: 'id' },
    { title: 'Nombre', field: 'nombre' },
    {
      title: 'Rubro', field: 'rubro', render: (ingredientes: IIngredientes) =>
        <span>{`${ingredientes.rubro ? ingredientes.rubro.nombre || "" : ""}`}</span>
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
      console.log("selectedRubro", selectedRubro);
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
        const responseData = await handleRequest('GET', API_URL);
        setIngred(responseData);
        setIngredComplete(responseData);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchRubros = async () => {
      // Obtener rubros desde la API
      try {
        const responseData = await handleRequest("GET", API_URL_Rubro);
        setRubros(responseData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchRubros();
    fetchData();
  }, []);

  if (!ingredComplete || !ingredComplete.length) {
    return <p>Cargando ingredientes...</p>;
  }

  // Agregar nuevo ingrediente mediante la API
  const handleIngredienteAdd = async (Ingredientes: IIngredientes) => {
    try {
      const newProducto = await handleRequest('POST', '/assets/data/ingredientesEjemplo.json', Ingredientes);

      setIngred([...ingred, newProducto]);
    } catch (error) {
      console.log(error);
    }
  };

  // Editar ingrediente existente mediante la API
  const handleIngredienteEdit = async (producto: IIngredientes) => {
    try {
      const updatedProducto = await handleRequest('PUT', `/assets/data/ingredientesEjemplo.json/${producto.id}`, producto);

      const newData = [...ingred];
      const index = newData.findIndex((item) => item.id === producto.id);
      newData[index] = updatedProducto;

      setIngred(newData);
    } catch (error) {
      console.log(error);
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
      // Otra lógica de manejo de errores o mensajes que desees agregar
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

  // Eliminar ingrediente mediante la API (esta por las dudas pero no tiene funcion)
  const handleIngredienteDelete = (rowData: string[], e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const ingredienteId: number = +rowData[0];
    fetch(`${"/assets/data/ingredientesEjemplo.json"}/${ingredienteId}`, {
      method: 'DELETE',
    })
      .then(response => {
        setIngred(ingred.filter(item => item.id !== ingredienteId));
      })
      .catch(error => {
        console.log(error);
      });
  }

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
      <p>No hay ingredientes disponibles con el rubro seleccionado.</p>
    ) : null;

  return (
    <div>
      <Container fluid>
        <div>
          {/* Filtros y mensajes */}
          <Form.Group controlId="id">
            <select
              className="form-select"
              name="id"
              value={selectedRubro ? selectedRubro : ""}
              onChange={handleSelectChange}
              style={{ width: "250px", margin: "10px" }}
            >
              <option value="">Todos los rubros</option>
              {rubros.map((rubro) => (
                <option key={rubro.id} value={rubro.id}>
                  {rubro.nombre || ""}
                </option>
              ))}
            </select>
          </Form.Group>
          {noProductosMessage}
          {/* Tabla de ingredientes */}
          <GenericTable
            data={filteredIngredientes}
            columns={columns}
            actions={actions}
            onAdd={handleAddModalOpen}
            onUpdate={handleEditModalOpen}
          />
        </div>
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
