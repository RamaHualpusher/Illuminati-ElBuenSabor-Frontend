import React, { useState, useEffect } from 'react';
import { Button, Container, Col, Row } from 'react-bootstrap';
import EditIngredienteModal from './EditIngredienteModal';
import AddIngredienteModal from './AddIngredienteModal';
import { Ingrediente } from '../../../interface/interfaces';
import { TablaGeneric } from '../../TableGeneric/TableGeneric';
import SearchBar from '../../SearchBar/SearchBar';

interface IngredientesTableProps { }

const IngredientesTable: React.FC<IngredientesTableProps> = () => {
  const [editModalShow, setEditModalShow] = useState(false);
  const [addModalShow, setAddModalShow] = useState(false);
  const [selectedIngrediente, setSelectedIngrediente] = useState<Ingrediente | null>(null);
  const [ingred, setIngred] = useState<Ingrediente[]>([]);
  const [ingredComplete, setIngredComplete] = useState<Ingrediente[]>([]);

  useEffect(() => {

    const fetchData = async () => {
      try {
        const response = await fetch("/assets/data/ingredientesEjemplo.json");
        const responseData = await response.json();
        setIngred(responseData);
        setIngredComplete(responseData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const filter = (searchParam: string) => {
    const searchResult = ingredComplete.filter((productVal: Ingrediente) => {
      if (
        productVal.id.toString().toLowerCase().includes(searchParam.toLowerCase()) ||
        productVal.nombre.toString().toLowerCase().includes(searchParam.toLowerCase()) ||
        productVal.rubro?.toString().toLowerCase().includes(searchParam.toLowerCase())
      ) {
        return productVal;
      }
      return null;
    });
    setIngred(searchResult);
  };

  const handleSearch = (searchParam: string) => {
    filter(searchParam);
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

      const newData = [...ingred];
      const index = newData.findIndex((item) => item.id === producto.id);
      newData[index] = updatedProducto;

      setIngred(newData);
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

      setIngred([...ingred, newProducto]);
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
    { label: "Stock Actual", width: 120 },
    { label: "Precio", width: 80 },
    { label: "UM", width: 50 }
  ];

  const data = ingred.map((ingrediente) => [
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
          <Col sm={10}>
            <h1>Buscar Ingredientes</h1>
            <SearchBar onSearch={handleSearch} />
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