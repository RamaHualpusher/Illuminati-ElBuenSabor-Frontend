import React, { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import axios from 'axios';
import EditProductoModal from './EditProductoModal';
import AddProductoModal from './AddProductoModal';

import 'bootstrap/dist/css/bootstrap.min.css';
import { TablaGeneric } from '../../TableGeneric/TableGeneric';

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
  const [order, setOrder] = useState<Producto[]>([]);
  const [editModalShow, setEditModalShow] = useState(false);
  const [addModalShow, setAddModalShow] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null);

  useEffect(() => {
    axios.get<Producto[]>(url)
      .then(response => {
        setOrder(response.data);
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
        const newData = [...order];
        const index = newData.findIndex(item => item.id === producto.id);
        newData[index] = response.data;
        setOrder(newData);
      })
      .catch(error => {
        console.log(error);
      });
  }

  const handleProductoAdd = (producto: Producto) => {
    axios.post(url, producto)
      .then(response => {
        setOrder([...order, response.data]);
      })
      .catch(error => {
        console.log(error);
      });
  }

  const handleProductoDelete = (producto: Producto) => {
    axios.delete(`${url}/${producto.id}`)
      .then(response => {
        setOrder(order.filter(item => item.id !== producto.id));
      })
      .catch(error => {
        console.log(error);
      });
  }

  const columns = [
    { label: "Nombre", width: 150 },
    { label: "Rubro", width: 100 },
    { label: "Tiempo (min)", width: 60 },
    { label: "Precio", width: 50 }
  ];

  const data = order.map((item) => [
    item.nombre.toString(),
    item.rubro.toString(),
    item.tiempo.toString(),
    item.precio.toString()
  ]);

  return (
    <div>
      <div className="d-flex justify-content-start align-items-center mb-3">
        <h3>Productos</h3>
      </div>
      <div className="d-flex justify-content-start align-items-center mb-3">
        <Button variant="success" onClick={handleAddModalOpen}>
          Agregar Producto
        </Button>
      </div>

      <div>
        <TablaGeneric columns={columns} data={data} showButton={true} />
      </div>



      {/*      <Table striped bordered hover>
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
          {order.map(producto => (
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
          */}
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