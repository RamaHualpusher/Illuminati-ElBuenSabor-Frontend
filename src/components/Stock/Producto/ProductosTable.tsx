import React, { useState, useEffect } from 'react';
import { Table, Button} from 'react-bootstrap';
import axios from 'axios';
import Navbar from '../../NavBar/Navbar';
import EditProductoModal from './EditProductoModal';
import AddProductoModal from './AddProductoModal';

import 'bootstrap/dist/css/bootstrap.min.css';

export type Producto = {
  id: number;
  nombre: string;
  rubro: string;
  tiempo: number;
  precio: number;
};

type ProductosTableProps = {
  url: string;
};

const ProductosTable = ({ url }: ProductosTableProps) => {
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
        <div className="d-flex justify-content-start align-items-center mb-3">
        <h3>Productos</h3>
      </div>
      <div className="d-flex justify-content-start align-items-center mb-3">
        <Button variant="success" onClick={handleAddModalOpen}>
          Agregar Producto
        </Button>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>NOMBRE</th>
            <th>RUBRO</th>
            <th>TIEMPO (min)</th>
            <th>PRECIO</th>
            <th>EDITAR</th>
            <th>ELIMINAR</th>
          </tr>
        </thead>
        <tbody>
          {data.map(producto => (
            <tr key={producto.id}>
              <td>{producto.nombre}</td>
              <td>{producto.rubro}</td>
              <td>{producto.tiempo}</td>
              <td>${producto.precio}</td>
              <td>
                <Button variant="primary" onClick={() => handleEditModalOpen(producto)}>Editar</Button>
              </td>
              <td>
            <Button variant="danger" onClick={() => handleProductoDelete(producto)}>Eliminar</Button>
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

export default ProductosTable;