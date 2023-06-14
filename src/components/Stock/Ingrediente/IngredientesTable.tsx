import React, { useState, useEffect } from 'react';
import { Button, Container, Col, Row } from 'react-bootstrap';
import EditIngredienteModal from './EditIngredienteModal';
import AddIngredienteModal from './AddIngredienteModal';
import { Ingredientes } from '../../../interface/Ingredientes';
import { TablaGeneric } from '../../TableGeneric/TableGeneric';
import Buscador from '../../Buscador/Buscador';
import { handleRequest } from '../../FuncionRequest/FuncionRequest';

interface IngredientesTableProps { }

const IngredientesTable: React.FC<IngredientesTableProps> = () => {
  const [editModalShow, setEditModalShow] = useState(false);
  const [addModalShow, setAddModalShow] = useState(false);
  const [selectedIngrediente, setSelectedIngrediente] = useState<Ingredientes | null>(null);
  const [ingred, setIngred] = useState<Ingredientes[]>([]);
  const [ingredComplete, setIngredComplete] = useState<Ingredientes[]>([]);

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
    const searchResult = ingredComplete.filter((productVal: Ingredientes) => {
      if (
        productVal.idIngredientes.toString().toLowerCase().includes(searchParam.toLowerCase()) ||
        productVal.nombre.toString().toLowerCase().includes(searchParam.toLowerCase()) ||
        productVal.Rubro?.toString().toLowerCase().includes(searchParam.toLowerCase())
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

  const ingredienteGeneric= (id:number) =>{
    let i:number=0;
    let x:boolean=true;
    while(x){
      if (i >= ingredComplete.length) {
        // No se encontró el ingrediente, salir del ciclo
        x = false;
      } else if (ingredComplete[i].idIngredientes === +id) {
        // Ingrediente encontrado
        return ingredComplete[i];
      }
      i = i + 1; 
    }
    return ingredComplete[0];
  };

  const handleEditModalOpen = (rowData: string[], e:React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setSelectedIngrediente(ingredienteGeneric(+rowData[0]));
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

  const handleIngredienteEdit = async (producto: Ingredientes) => {
    try {
      const updatedProducto = await handleRequest('PUT', `/assets/data/ingredientesEjemplo.json/${producto.idIngredientes}`, producto);

      const newData = [...ingred];
      const index = newData.findIndex((item) => item.idIngredientes === producto.idIngredientes);
      newData[index] = updatedProducto;

      setIngred(newData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleIngredienteAdd = async (Ingredientes: Ingredientes) => {
    try {
      const newProducto = await handleRequest('POST', '/assets/data/ingredientesEjemplo.json', Ingredientes);

      setIngred([...ingred, newProducto]);
    } catch (error) {
      console.log(error);
    }
  };
  
    const handleIngredienteDelete = (rowData: string[],e:React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      const ingredienteId:number=+rowData[0];
      fetch(`${"/assets/data/ingredientesEjemplo.json"}/${ingredienteId}`, {
        method: 'DELETE',
      })
        .then(response => {
          setIngred(ingred.filter(item => item.idIngredientes !== ingredienteId));
        })
        .catch(error => {
          console.log(error);
        });
    }
  
  const columns = [
    { label: "Id", width: 10 },
    { label: "Nombre", width: 200 },
    { label: "Rubro", width: 100 },
    { label: "Min Stock", width: 100 },
    { label: "Stock Actual", width: 120 },
    { label: "Precio", width: 80 },
    { label: "UM", width: 50 }
  ];

  const data = ingred.map((Ingredientes) => [
    Ingredientes.idIngredientes.toString(),
    Ingredientes.nombre.toString(),
    Ingredientes.Rubro.toString(),
    Ingredientes.stockMinimo.toString(),
    Ingredientes.stockActual.toString(),
    Ingredientes.estado.toString(),// Esto es un boolean y no se que puede ser el string
    Ingredientes.UnidadMedida.toString()
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
              Agregar Ingredientes
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
        handleIngredientesEdit={handleIngredienteEdit}
        selectedIngredientes={selectedIngrediente}
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
