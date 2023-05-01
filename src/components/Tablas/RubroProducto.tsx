import React, { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import axios from 'axios';
import EditProductoModal from './EditProductoModal';
import AddProductoModal from './AddProductoModal';

import 'bootstrap/dist/css/bootstrap.min.css';

export type Producto = {
  id: number;
  nombre: string;
  activo: boolean;
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
    <>
      <div className="d-flex justify-content-start" style={{marginLeft: '10px'}}>
        <Button variant="success" onClick={handleAddModalOpen}>Agregar Producto</Button>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nombre</th>
            
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id}>
              <td>{item.nombre}</td>
              <td>{item.activo ? 'Sí' : 'No'}</td>
              <td>
                <Button variant="primary" onClick={() => handleEditModalOpen(item)}>Editar</Button>{' '}
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
      </>
      
      );
      };
      
      export default ProductosTable;
