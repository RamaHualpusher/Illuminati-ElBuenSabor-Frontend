import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Col, Row,InputGroup, FormControl } from 'react-bootstrap';
import EditIngredienteModal from './EditIngredienteModal';
import AddIngredienteModal from './AddIngredienteModal';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Ingrediente } from '../../../interface/interfaces';

interface IngredientesTableProps { }

const IngredientesTable: React.FC<IngredientesTableProps> = () => {
  const [editModalShow, setEditModalShow] = useState(false);
  const [addModalShow, setAddModalShow] = useState(false);
  const [selectedIngrediente, setSelectedIngrediente] = useState<Ingrediente | null>(null);

  const [data, setData] = useState<Ingrediente[]>([]);
  const [dataComplete, setDataComplete] = useState<Ingrediente[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/assets/data/ingredientesEjemplo.json")
      .then(response => response.json())
      .then(data => {
        setData(data);
        setDataComplete(data)
      })
      .catch(error => {
        console.log(error);
      });
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
    setData(serchResult);
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

      <Row>
        <Col>
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
              {data.map((ingrediente) => (
                <tr key={ingrediente.id}>
                  <td>{ingrediente.nombre}</td>
                  <td>{ingrediente.rubro}</td>
                  <td>{ingrediente.minStock}</td>
                  <td>{ingrediente.stockActual}</td>
                  <td>${ingrediente.precio}</td>
                  <td>{ingrediente.um}</td>
                  <td>
                    <Button variant="primary" onClick={() => handleEditModalOpen(ingrediente)}>
                      Editar
                    </Button>
                  </td>
                  <td>
                    <Button variant="danger" onClick={() => handleIngredienteDelete(ingrediente)}>
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>

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
    </Container>
  );
};

export default IngredientesTable;