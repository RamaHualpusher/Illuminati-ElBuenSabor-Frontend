import React, { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import axios from 'axios';
import EditProductoModal from './EditProductoModal';
import AddProductoModal from './AddProductoModal';

import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../../NavBar/AdminBar';

export type Producto = {
  id: number;
  nombre: string;
  rubro: string;
};

type RubrosProductosTableProps = {
  url: string;
};

const RubrosProductosTable = ({ url }: RubrosProductosTableProps) => {
  const [data, setData] = useState<Producto[]>([]);
  const [editModalShow, setEditModalShow] = useState(false);
  const [addModalShow, setAddModalShow] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null);

  useEffect(() => {
    axios.get<Producto[]>(url)
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, [url]);

  const handleEditModalOpen = (producto: Producto) => {
    setSelectedProducto(producto);
    setEditModalShow(true);
  }

  const handleEditModalClose = () => {
    setSelectedProducto(null);
    setEditModalShow(false);
  }

  const handleAddModalOpen = () => {
    setAddModalShow(true);
  }

  const handleAddModalClose = () => {
    setAddModalShow(false);
  }

  const handleProductoEdit = (producto: Producto) => {
    axios.put(`${url}/${producto.id}`, producto)
      .then(response => {
        const newData = [...data];
        const index = newData.findIndex(item => item.id === producto.id);
        newData[index] = response.data;
        setData(newData);
      })
      .catch(error => {
        console.log(error);
      });
  }

  const handleProductoAdd = (producto: Producto) => {
    axios.post(url, producto)
      .then(response => {
        setData([...data, response.data]);
      })
      .catch(error => {
        console.log(error);
      });
  }

  const handleProductoDelete = (producto: Producto) => {
    axios.delete(`${url}/${producto.id}`)
      .then(response => {
        setData(data.filter(item => item.id !== producto.id));
      })
      .catch(error => {
        console.log(error);
      });
  }

  return (
    <div>
      <Navbar />
      <div className="d-flex justify-content-start m-3">
        <Button variant="success" onClick={handleAddModalOpen}>Agregar Producto</Button>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Rubro</th>
            <th>Nombre</th>
            <th>Editar</th>
            <th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id}>
              <td>{item.rubro}</td>
              <td>{item.nombre}</td>
              <td>
                <Button variant="primary" onClick={() => handleEditModalOpen(item)}>Editar</Button>
              </td>
              <td>
                <Button variant="danger" onClick={() => handleProductoDelete(item)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      
      <EditProductoModal
        show={editModalShow}
        handleClose={handleEditModalClose}
        handleProductoEdit={handleProductoEdit}
        selectedProducto={selectedProducto}
      />
      <AddProductoModal
        show={addModalShow}
        handleClose={handleAddModalClose}
        handleProductoAdd={handleProductoAdd}
      />
    </div>
  );
};

export default RubrosProductosTable;
