import React, { useState, useEffect } from 'react';
import { Container, Col, Row, Form } from 'react-bootstrap';
import EditIngredienteModal from './EditIngredienteModal';
import AddIngredienteModal from './AddIngredienteModal';
import { Ingredientes } from '../../../interface/Ingredientes';
import { handleRequest } from '../../FuncionRequest/FuncionRequest';
import { Action, Column } from '../../../interface/CamposTablaGenerica';
import GenericTable from "../../GenericTable/GenericTable";
import { Rubro } from "../../../interface/Rubro";

const Ingrediente: React.FC = () => {
  const [editModalShow, setEditModalShow] = useState(false);
  const [addModalShow, setAddModalShow] = useState(false);
  const [selectedIngrediente, setSelectedIngrediente] = useState<Ingredientes | null>(null);
  const [ingred, setIngred] = useState<Ingredientes[]>([]);
  const [ingredComplete, setIngredComplete] = useState<Ingredientes[]>([]);
  const [rubros, setRubros] = useState<Rubro[]>([]);
  const [selectedRubro, setSelectedRubro] = useState<number | null>(null);
  const [selectedRubroName, setSelectedRubroName] = useState<string>("");
  const [filteredIngredientes, setFilteredIngredientes] = useState<Ingredientes[]>([]);
  const API_URL = "/assets/data/ingredientesEjemplo.json";
  const API_URL_Rubro = "assets/data/rubrosIngredientesEjemplo.json";

  const actions: Action = {
    create: true,
    update: true
  };

  const columns: Column<Ingredientes>[] = [
    { title: 'ID', field: 'idIngredientes' },
    { title: 'Nombre', field: 'nombre' },
    {
      title: 'Rubro', field: 'Rubro', render: (ingredientes: Ingredientes) =>
        <span>{`${ingredientes.Rubro.nombre}`}</span>
    },
    { title: 'Precio', field: 'precioCosto' },
    { title: 'Min Stock', field: 'stockMinimo' },
    { title: 'Stock Actual', field: 'stockActual' },
    { title: 'UM', field: 'unidadMedida' },
    {
      title: "Estado",
      field: "estado",
      render: (ingredientes: Ingredientes) => (
        <span className={`${ingredientes.estado ? "text-success" : "text-danger"}`}>
          {ingredientes.estado ? <h2><i className="bi bi-unlock-fill "></i></h2> : <h2><i className="bi bi-lock-fill"></i></h2>}
        </span>
      ),
    },
  ];

  useEffect(() => {
    const filterIngredientes = () => {
      console.log("selectedRubro", selectedRubro);
      if (selectedRubro) {
        const filtered = ingredComplete.filter(
          (ingrediente) => ingrediente.Rubro.idRubro === selectedRubro
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseData = await handleRequest('GET', API_URL);
        setIngred(responseData);
        setIngredComplete(responseData);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchRubros = async () => {
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

  const handleIngredienteAdd = async (Ingredientes: Ingredientes) => {
    try {
      const newProducto = await handleRequest('POST', '/assets/data/ingredientesEjemplo.json', Ingredientes);

      setIngred([...ingred, newProducto]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleIngredienteEdit = async (producto: Ingredientes) => {
    try {
      const updatedProducto = await handleRequest('PUT', `/assets/data/ingredientesEjemplo.json/${producto.idIngredientes}`, producto);

      const newData = [...ingred];
      const index = newData.findIndex((item) => item.idIngredientes === producto.idIngredientes);
      newData[index] = updatedProducto;

      setIngred(newData);
    } catch (error) {
      console.log(error);
    }
  };

  const ingredienteGeneric = (id: number) => {
    let i: number = 0;
    let x: boolean = true;
    while (x) {
      if (i >= ingredComplete.length) {
        // No se encontró el ingrediente, salir del ciclo
        x = false;
      } else if (ingredComplete[i].idIngredientes === +id) {
        // Ingrediente encontrado
        return ingredComplete[i];
      }
      i = i + 1;
    }
    return ingredComplete[0];
  };

  const handleEditModalOpen = (item: Ingredientes) => {
    setSelectedIngrediente(ingredienteGeneric(item.idIngredientes));
    setEditModalShow(true);
  };

  const handleEditModalClose = () => {
    setSelectedIngrediente(null);
    setEditModalShow(false);
  };

  const handleAddModalOpen = () => {
    setAddModalShow(true);
  };

  const handleAddModalClose = () => {
    setAddModalShow(false);
  };


  const handleIngredienteDelete = (rowData: string[], e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const ingredienteId: number = +rowData[0];
    fetch(`${"/assets/data/ingredientesEjemplo.json"}/${ingredienteId}`, {
      method: 'DELETE',
    })
      .then(response => {
        setIngred(ingred.filter(item => item.idIngredientes !== ingredienteId));
      })
      .catch(error => {
        console.log(error);
      });
  }

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    const selectedOption = event.currentTarget.options[event.currentTarget.selectedIndex];
    const selectedRubroId = parseInt(value);
    const selectedRubro = rubros.find((rubro) => rubro.idRubro === selectedRubroId);
    setSelectedRubro(selectedRubroId ? selectedRubroId : null);
    setSelectedRubroName(selectedOption.text);
  };

  const noProductosMessage =
    selectedRubro && filteredIngredientes.length === 0 ? (
      <p>No hay ingredientes disponibles con el rubro seleccionado.</p>
    ) : null;

  return (
    <div>
      <Container fluid>
        <div>
          <Form.Group controlId="idrubro">
            <select
              className="form-select"
              name="idRubro"
              value={selectedRubro ? selectedRubro : ""}
              onChange={handleSelectChange}
              style={{ width: "250px", margin: "10px" }}
            >
              <option value="">Todos los rubros</option>
              {rubros.map((rubro) => (
                <option key={rubro.idRubro} value={rubro.idRubro}>
                  {rubro.nombre}
                </option>
              ))}
            </select>
          </Form.Group>
          {noProductosMessage}
          <GenericTable
            data={filteredIngredientes}
            columns={columns}
            actions={actions}
            onAdd={handleAddModalOpen}
            onUpdate={handleEditModalOpen}
          />
        </div>
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
