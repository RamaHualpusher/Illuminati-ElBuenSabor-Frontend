import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Col, Row, InputGroup, FormControl } from 'react-bootstrap';
import EditIngredienteModal from './EditIngredienteModal';
import AddIngredienteModal from './AddIngredienteModal';
import { Ingrediente } from '../../../interface/interfaces';
import { TablaGeneric } from '../../TableGeneric/TableGeneric';

interface IngredientesTableProps {}

const IngredientesTable : React.FC<IngredientesTableProps> = () => {
  //const [order, setOrder] = useState<Ingrediente[]>([]);
  const [editModalShow, setEditModalShow] = useState(false);
  const [addModalShow, setAddModalShow] = useState(false);
  const [selectedIngrediente, setSelectedIngrediente] = useState<Ingrediente | null>(null);

  const [order, setOrder] = useState<Ingrediente[]>([]);
  const [dataComplete, setDataComplete] = useState<Ingrediente[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    
    const fetchData = async () => {
      try {
        const response = await fetch("/assets/data/ingredientesEjemplo.json");
        const responseData = await response.json();
        setOrder(responseData);
        setDataComplete(responseData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    filter(e.target.value);
  };

  const filter = (serchParam: string) => {
    var serchResult = dataComplete.filter((productVal: Ingrediente) => {
      if (
        productVal.id.toString()
          .toLowerCase()
          .includes(serchParam.toLowerCase()) ||
        productVal.nombre.toString()
          .toLowerCase()
          .includes(serchParam.toLowerCase()) ||
        productVal.rubro?.toString()
          .toLowerCase()
          .includes(serchParam.toLowerCase()) ||
        productVal.um.toString()
          .toLowerCase()
          .includes(serchParam.toLowerCase())
      )
        return productVal;
    });
    setOrder(serchResult);
  };

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

  const handleIngredienteEdit = async (producto: Ingrediente) => {
    try {
      const response = await fetch(`${"/assets/data/ingredientesEjemplo.json"}/${producto.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(producto),
      });
      const updatedProducto = await response.json();

      const newData = [...order];
      const index = newData.findIndex((item) => item.id === producto.id);
      newData[index] = updatedProducto;

      setOrder(newData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleIngredienteAdd = async (ingrediente: Ingrediente) => {
    try {
      const response = await fetch("/assets/data/ingredientesEjemplo.json", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ingrediente),
      });
      const newProducto = await response.json();

      setOrder([...order, newProducto]);
    } catch (error) {
      console.log(error);
    }
  };
  /*
    const handleIngredienteDelete = (ingrediente: Ingrediente) => {
      fetch(`${"/assets/data/ingredientesEjemplo.json"}/${ingrediente.id}`, {
        method: 'DELETE',
      })
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
    { label: "Precio", width: 80 },
    { label: "UM", width: 50 }
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
    <div>
      <Container fluid>
        <Row className="justify-content-start align-items-center mb-3">
          <Col sm={10}><h1>Buscar Ingredientes</h1>
            <InputGroup className="mb-4">
              <FormControl
                placeholder="Buscar"
                aria-label="Buscar"
                aria-describedby="basic-addon2"
                value={search}
                onChange={handleChange}
              />
              <Button variant="outline-secondary" id="button-addon2">
                <i className="bi bi-search"></i>
              </Button>
            </InputGroup>
          </Col>
        </Row>
        <Row className="justify-content-start align-items-center mb-3">
          <Col>
            <Button variant="success" onClick={handleAddModalOpen} className="float-start">
              Agregar Ingrediente
            </Button>
          </Col>
        </Row>
      </Container>




      <div>
        <TablaGeneric columns={columns} data={data} showButton={true} />
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
*/}
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
    </div>
  );
};
export default IngredientesTable;