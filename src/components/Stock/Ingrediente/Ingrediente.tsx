import React, { useState, useEffect } from 'react';
import { Container, Col, Row } from 'react-bootstrap';
import EditIngredienteModal from './EditIngredienteModal';
import AddIngredienteModal from './AddIngredienteModal';
import { Ingredientes } from '../../../interface/Ingredientes';
import { handleRequest } from '../../FuncionRequest/FuncionRequest';
import { Action, Column } from '../../../interface/CamposTablaGenerica';
import GenericTable from "../../GenericTable/GenericTable";

const Ingrediente: React.FC = () => {
  const [editModalShow, setEditModalShow] = useState(false);
  const [addModalShow, setAddModalShow] = useState(false);
  const [selectedIngrediente, setSelectedIngrediente] = useState<Ingredientes | null>(null);
  const [ingred, setIngred] = useState<Ingredientes[]>([]);
  const [ingredComplete, setIngredComplete] = useState<Ingredientes[]>([]);
  const API_URL = "/assets/data/ingredientesEjemplo.json";

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
      title: 'Estado', field: 'estado', render: (ingredientes: Ingredientes) =>
        <span>{ingredientes.estado ? 'Alta' : 'Baja'}</span>
    },
  ];

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
    fetchData();
  }, []);

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

  const handleIngredienteAdd = async (Ingredientes: Ingredientes) => {
    try {
      const newProducto = await handleRequest('POST', '/assets/data/ingredientesEjemplo.json', Ingredientes);

      setIngred([...ingred, newProducto]);
    } catch (error) {
      console.log(error);
    }
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

  return (
    <div>
      <Container fluid>
        <Row className="justify-content-start align-items-center mb-3">
          <Col sm={10}>
            <h1>Buscar Ingredientes</h1>
          </Col>
        </Row>
        <div>
          <GenericTable
            data={ingred}
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
