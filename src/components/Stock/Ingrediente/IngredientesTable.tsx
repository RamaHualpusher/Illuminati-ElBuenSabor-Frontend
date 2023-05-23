import React, { useState, useEffect } from 'react';
import { Button, Container, Col, Row } from 'react-bootstrap';
import EditIngredienteModal from './EditIngredienteModal';
import AddIngredienteModal from './AddIngredienteModal';
import { Ingrediente } from '../../../interface/interfaces';
import { TablaGeneric } from '../../TableGeneric/TableGeneric';
import Buscador from '../../Buscador/Buscador';
import { handleRequest } from '../../FuncionRequest/FuncionRequest';

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
        const responseData = await handleRequest('GET', '/assets/data/ingredientesEjemplo.json');
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

  const handleEditModalOpen = (rowData: string[], e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const ingrediente: Ingrediente = {
      id: +rowData[0],
      nombre: rowData[1],
      rubro: rowData[2],
      minStock: +rowData[3],
      stockActual: +rowData[4],
      precio: +rowData[5],
      um: rowData[6],
    };
    setSelectedIngrediente(ingrediente);
    setEditModalShow(true);
  };

  const handleEditModalClose = () => {
    setSelectedIngrediente(null);
    setEditModalShow(false);
  };

  const handleAddModalOpen = () => {
    setAddModalShow(true);
  };

  const handleAddModalClose = () => {
    setAddModalShow(false);
  };

  const handleIngredienteEdit = async (producto: Ingrediente) => {
    try {
      const updatedProducto = await handleRequest('PUT', `/assets/data/ingredientesEjemplo.json/${producto.id}`, producto);

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
      const newProducto = await handleRequest('POST', '/assets/data/ingredientesEjemplo.json', ingrediente);

      setIngred([...ingred, newProducto]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleIngredienteDelete = (rowData: string[], e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const ingrediente: Ingrediente = {
      id: +rowData[0],
      nombre: rowData[1],
      rubro: rowData[2],
      minStock: +rowData[3],
      stockActual: +rowData[4],
      precio: +rowData[5],
      um: rowData[6],
    };
    handleRequest('DELETE', `/assets/data/ingredientesEjemplo.json/${ingrediente.id}`)
      .then(() => {
        setIngred(ingred.filter(item => item.id !== ingrediente.id));
      })
      .catch(error => {
        console.log(error);
      });
  };

  const columns = [
    { label: "Id", width: 10 },
    { label: "Nombre", width: 200 },
    { label: "Rubro", width: 100 },
    { label: "Min Stock", width: 100 },
    { label: "Stock Actual", width: 120 },
    { label: "Precio", width: 80 },
    { label: "UM", width: 50 }
  ];

  const data = ingred.map((ingrediente) => [
    ingrediente.id.toString(),
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
            <Buscador onSearch={handleSearch} />
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
        <TablaGeneric columns={columns} data={data} showButton={true} buttonEdit={handleEditModalOpen} buttonDelete={handleIngredienteDelete} />
      </div>
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
