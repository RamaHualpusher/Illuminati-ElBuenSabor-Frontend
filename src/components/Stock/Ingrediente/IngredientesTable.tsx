import React, { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import axios from 'axios';
import EditIngredienteModal from './EditIngredienteModal';
import AddIngredienteModal from './AddIngredienteModal';
import 'bootstrap/dist/css/bootstrap.min.css';
import { TablaGeneric } from '../../TableGeneric/TableGeneric';

export type Ingrediente = {
  id: number;
  nombre: string;
  rubro: string;
  minStock: number;
  stockActual: number;
  precio: number;
  um: string;
};

type IngredientesTableProps = {
  url: string;
};

const IngredientesTable = ({ url }: IngredientesTableProps) => {
  const [order, setOrder] = useState<Ingrediente[]>([]);
  const [editModalShow, setEditModalShow] = useState(false);
  const [addModalShow, setAddModalShow] = useState(false);
  const [selectedIngrediente, setSelectedIngrediente] = useState<Ingrediente | null>(null);

  useEffect(() => {
    axios.get<Ingrediente[]>(url)
      .then(response => {
        setOrder(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, [url]);

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
    axios.put(`${url}/${ingrediente.id}`, ingrediente)
      .then(response => {
        const newData = [...order];
        const index = newData.findIndex(item => item.id === ingrediente.id);
        newData[index] = response.data;
        setOrder(newData);
      })
      .catch(error => {
        console.log(error);
      });
  }

  const handleIngredienteAdd = (ingrediente: Ingrediente) => {
    axios.post(url, ingrediente)
      .then(response => {
        setOrder([...order, response.data]);
      })
      .catch(error => {
        console.log(error);
      });
  }
/*
  const handleIngredienteDelete = (ingrediente: Ingrediente) => {
    axios.delete(`${url}/${ingrediente.id}`)
      .then(response => {
        setOrder(data.filter(item => item.id !== ingrediente.id));
      })
      .catch(error => {
        console.log(error);
      });
  }
*/
const columns = [
  { label: "Nombre", width: 200 },
  { label: "Rubro", width: 100 },
  { label: "Min Stock", width: 100 },
  { label: "Stock Actual", width: 100 },
  { label: "Precio" , width:80},
  { label: "UM" , width:50}
];

  const data = order.map((ingrediente) => [
    ingrediente.nombre.toString(),
    ingrediente.rubro.toString(),
    ingrediente.minStock.toString(),
    ingrediente.stockActual.toString(),
    ingrediente.precio.toString(),
    ingrediente.um.toString()
  ]);

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


  <div>
    <TablaGeneric columns={columns} data={data}showButton={true}/>
  </div>
    {/*
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
      />*/}
  <AddIngredienteModal
    show={addModalShow}
    handleClose={handleAddModalClose}
    handleIngredienteAdd={handleIngredienteAdd}
      />
</>
);
};

export default IngredientesTable;