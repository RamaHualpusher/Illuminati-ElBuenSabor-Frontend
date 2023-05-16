import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Button, InputGroup, FormControl  } from 'react-bootstrap';
import EditProductoModal from './EditProductoModal';
import AddProductoModal from './AddProductoModal';
import { Producto } from '../../../interface/interfaces';

interface ProductosTableProps { }

const ProductosTable: React.FC<ProductosTableProps> = () => {
  const [editModalShow, setEditModalShow] = useState(false);
  const [addModalShow, setAddModalShow] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null);
  const [data, setData] = useState<Producto[]>([]);
  const [dataComplete, setdataComplete] = useState<Producto[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    
    const fetchData = async () => {
      try {
        const response = await fetch("/assets/data/productosEjemplo.json");
        const responseData = await response.json();
        setData(responseData);
        setdataComplete(responseData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSearch = () => {
    filter(search);
  };


  const filter = (searchParam: string) => {
    const searchResult = dataComplete.filter((productVal: Producto) => {
      if (
        productVal.id.toString().toLowerCase().includes(searchParam.toLowerCase()) ||
        productVal.nombre.toString().toLowerCase().includes(searchParam.toLowerCase()) ||
        productVal.rubro?.toString().toLowerCase().includes(searchParam.toLowerCase())
      ) {
        return productVal;
      }
      return null;
    });
    setData(searchResult);
  };


  const handleEditModalOpen = (producto: Producto) => {
    setSelectedProducto(producto);
    setEditModalShow(true);
  };

  const handleEditModalClose = () => {
    setSelectedProducto(null);
    setEditModalShow(false);
  };

  const handleAddModalOpen = () => {
    setAddModalShow(true);
  };

  const handleAddModalClose = () => {
    setAddModalShow(false);
  };

  const handleProductoEdit = async (producto: Producto) => {
    try {
      const response = await fetch(`${"/assets/data/productosEjemplo.json"}/${producto.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(producto),
      });
      const updatedProducto = await response.json();

      const newData = [...data];
      const index = newData.findIndex((item) => item.id === producto.id);
      newData[index] = updatedProducto;

      setData(newData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleProductoAdd = async (producto: Producto) => {
    try {
      const response = await fetch("/assets/data/productosEjemplo.json", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(producto),
      });
      const newProducto = await response.json();

      setData([...data, newProducto]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleProductoDelete = async (producto: Producto) => {
    try {
      await fetch(`${"/assets/data/productosEjemplo.json"}/${producto.id}`, {
        method: 'DELETE',
      });

      setData(data.filter((item) => item.id !== producto.id));
    } catch (error) {
      console.log(error);
    }
  };

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
    <Container>
      <Row className="justify-content-start align-items-center mb-3">
        <Col sm={10}>
          <h1>Buscar Ingredientes</h1>
          <InputGroup className="mb-4">
            <FormControl
              placeholder="Buscar"
              aria-label="Buscar"
              aria-describedby="basic-addon2"
              value={search}
              onChange={handleChange}
            />
            <Button variant="outline-secondary" id="button-addon2" onClick={handleSearch}>
              <i className="bi bi-search"></i>
            </Button>
          </InputGroup>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col>
          <Button variant="success" onClick={handleAddModalOpen} className="float-start">
            Agregar Producto
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
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
              {data.map((producto) => (
                <tr key={producto.id}>
                  <td>{producto.nombre}</td>
                  <td>{producto.rubro}</td>
                  <td>{producto.tiempo}</td>
                  <td>${producto.precio}</td>
                  <td>
                    <Button
                      variant="primary"
                      onClick={() => handleEditModalOpen(producto)}
                    >
                      Editar
                    </Button>
                  </td>
                  <td>
                    <Button
                      variant="danger"
                      onClick={() => handleProductoDelete(producto)}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
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
    </Container>
  );
};

export default ProductosTable;