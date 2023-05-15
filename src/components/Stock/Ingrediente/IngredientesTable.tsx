import React, { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import EditIngredienteModal from './EditIngredienteModal';
import AddIngredienteModal from './AddIngredienteModal';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Ingrediente } from '../../../interface/interfaces';

interface IngredientesTableProps {}

const IngredientesTable: React.FC<IngredientesTableProps> = () => {
  const [data, setData] = useState<Ingrediente[]>([]);
  const [editModalShow, setEditModalShow] = useState(false);
  const [addModalShow, setAddModalShow] = useState(false);
  const [selectedIngrediente, setSelectedIngrediente] = useState<Ingrediente | null>(null);

  useEffect(() => {
    fetch("/assets/data/ingredientesEjemplo.json")
      .then(response => response.json())
      .then(data => {
        setData(data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const handleEditModalOpen = (ingrediente: Ingrediente) => {
    setSelectedIngrediente(ingrediente);
    setEditModalShow(true);
  }

  const handleEditModalClose = () => {
    setSelectedIngrediente(null);
    setEditModalShow(false);
  }

  const handleAddModalOpen = () => {
    setAddModalShow(true);
  }

  const handleAddModalClose = () => {
    setAddModalShow(false);
  }

  const handleIngredienteEdit = (ingrediente: Ingrediente) => {
    fetch(`${"/assets/data/ingredientesEjemplo.json"}/${ingrediente.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ingrediente),
    })
      .then(response => response.json())
      .then(updatedIngrediente => {
        const newData = [...data];
        const index = newData.findIndex(item => item.id === updatedIngrediente.id);
        newData[index] = updatedIngrediente;
        setData(newData);
      })
      .catch(error => {
        console.log(error);
      });
  }

  const handleIngredienteAdd = (ingrediente: Ingrediente) => {
    fetch("/assets/data/ingredientesEjemplo.json", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ingrediente),
    })
      .then(response => response.json())
      .then(addedIngrediente => {
        setData([...data, addedIngrediente]);
      })
      .catch(error => {
        console.log(error);
      });
  }

  const handleIngredienteDelete = (ingrediente: Ingrediente) => {
    fetch(`${"/assets/data/ingredientesEjemplo.json"}/${ingrediente.id}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          setData(data.filter(item => item.id !== ingrediente.id));
        } else {
          throw new Error('Delete request failed');
        }
      })
      .catch(error => {
        console.log(error);
      });
  }
  return (
    <>
      <div className="d-flex justify-content-start align-items-center mb-3">
        <h3>Ingredientes</h3>
      </div>
      <div className="d-flex justify-content-start align-items-center mb-3">
        <Button variant="success" onClick={handleAddModalOpen}>
          Agregar Ingrediente
        </Button>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>NOMBRE</th>
            <th>RUBRO</th>
            <th>MIN STOCK</th>
            <th>STOCK ACTUAL</th>
            <th>PRECIO</th>
            <th>UM</th>
            <th>EDITAR</th>
            <th>ELIMINAR</th>
          </tr>
        </thead>
        <tbody>
          {data.map(ingrediente => (
            <tr key={ingrediente.id}>
              <td>{ingrediente.nombre}</td>
              <td>{ingrediente.rubro}</td>
              <td>{ingrediente.minStock}</td>
              <td>{ingrediente.stockActual}</td>
              <td>${ingrediente.precio}</td>
              <td>{ingrediente.um}</td>
              <td>
                <Button variant="primary" onClick={() => handleEditModalOpen(ingrediente)}>Editar</Button>
              </td>
              <td>
                <Button variant="danger" onClick={() => handleIngredienteDelete(ingrediente)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <EditIngredienteModal
        show={editModalShow}
        handleClose={handleEditModalClose}
        handleIngredienteEdit={handleIngredienteEdit}
        selectedIngrediente={selectedIngrediente}
      />
      <AddIngredienteModal
        show={addModalShow}
        handleClose={handleAddModalClose}
        handleIngredienteAdd={handleIngredienteAdd}
      />
    </>
  );
};

export default IngredientesTable;