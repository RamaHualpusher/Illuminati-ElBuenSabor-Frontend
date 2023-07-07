import React, { useState, useEffect } from 'react';
import { Container, Col, Row } from 'react-bootstrap';
import EditRubroIngredienteModal from './EditRubroIngredienteModal';
import AddRubroIngredienteModal from './AddRubroIngredienteModal';
import { Rubro } from '../../../interface/Rubro';
import { handleRequest } from '../../FuncionRequest/FuncionRequest';
import { Action, Column } from '../../../interface/CamposTablaGenerica';
import GenericTable from "../../GenericTable/GenericTable";

const RubroIngrediente: React.FC = () => {
  const [editModalShow, setEditModalShow] = useState(false);
  const [addModalShow, setAddModalShow] = useState(false);
  const [selectedRubroIngrediente, setSelectedRubroIngrediente] = useState<Rubro | null>(null);
  const [ingredRubro, setIngredRubro] = useState<Rubro[]>([]);
  const [ingredRubroComplete, setIngredRubroComplete] = useState<Rubro[]>([]);
  const API_URL = "/assets/data/rubrosIngredientesEjemplo.json";

  const actions: Action = {
    create: true,
    update: true
  };

  const columns: Column<Rubro>[] = [
    // { title: 'ID', field: 'idRubro' },
    { title: 'Nombre', field: 'nombre' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseData = await handleRequest('GET', API_URL);
        setIngredRubro(responseData);
        setIngredRubroComplete(responseData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const handleEditModalOpen = (item: Rubro) => {
    setSelectedRubroIngrediente(item);
    setEditModalShow(true);
  };

  const handleEditModalClose = () => {
    setSelectedRubroIngrediente(null);
    setEditModalShow(false);
  };

  const handleAddModalOpen = () => {
    setAddModalShow(true);
  };

  const handleAddModalClose = () => {
    setAddModalShow(false);
  };

  const handleRubroEdit = async (rubro: Rubro) => {
    try {
      const updatedRubro = await handleRequest('PUT', `${API_URL}/${rubro.idRubro}`, rubro);

      const newData = [...ingredRubro];
      const index = newData.findIndex((item) => item.idRubro === rubro.idRubro);
      newData[index] = updatedRubro;

      setIngredRubro(newData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRubroAdd = async (rubro: Rubro) => {
    try {
      const newRubro = await handleRequest('POST', API_URL, rubro);

      setIngredRubro([...ingredRubro, newRubro]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRubroDelete = (rowData: string[], e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const rubroId: number = +rowData[0];
    fetch(`${API_URL}/${rubroId}`, {
      method: 'DELETE',
    })
      .then(response => {
        setIngredRubro(ingredRubro.filter(item => item.idRubro !== rubroId));
      })
      .catch(error => {
        console.log(error);
      });
  }

  return (
    <div>
      <Container fluid>
        <Row className="justify-content-start align-items-center mb-3">
          <Col sm={10}>
            <h1>Buscar Ingredientes</h1>
          </Col>
        </Row>
        <div>
          <GenericTable
            data={ingredRubro}
            columns={columns}
            actions={actions}
            onAdd={handleAddModalOpen}
            onUpdate={handleEditModalOpen}
          />
        </div>
        <EditRubroIngredienteModal
          show={editModalShow}
          handleClose={handleEditModalClose}
          handleRubroEdit={handleRubroEdit}
          selectedRubro={selectedRubroIngrediente}
        />
        <AddRubroIngredienteModal
          show={addModalShow}
          handleClose={handleAddModalClose}
          handleRubroAdd={handleRubroAdd}
        />
      </Container>
    </div>
  );
};

export default RubroIngrediente;
