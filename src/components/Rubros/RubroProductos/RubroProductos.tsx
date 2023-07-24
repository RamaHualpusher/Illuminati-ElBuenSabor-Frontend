import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { handleRequest } from '../../FuncionRequest/FuncionRequest';
import EditRubroProductoModal from './EditRubroProductoModal';
import AddRubroProductoModal from './AddRubroProductoModal';
import { Rubro } from '../../../interface/Rubro';
import { Action, Column } from '../../../interface/CamposTablaGenerica';
import GenericTable from '../../GenericTable/GenericTable';
import Axios from 'axios';

const RubroProductos: React.FC = () => {
  const [editModalShow, setEditModalShow] = useState(false);
  const [addModalShow, setAddModalShow] = useState(false);
  const [selectedRubroProducto, setSelectedRubroProducto] = useState<Rubro | null>(null);
  const [rubros, setRubros] = useState<Rubro[]>([]);
  const [rubrosComplete, setRubrosComplete] = useState<Rubro[]>([]);
  const API_URL = 'assets/data/rubrosProductosEjemplo.json';

  const actions: Action = {
    create: true,
    update: true,
  };

  useEffect(() => {
    const buscarRubros = async () => {
      try {
        const response = await Axios.get(API_URL); // Use Axios to make a GET request
        setRubros(response.data); // Access the response data using response.data
        setRubrosComplete(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    buscarRubros();
  }, []);

  const handleRubroAdd = async (rubro: Rubro) => {
    try {
      console.log(rubro);
      const response = await Axios.post(API_URL, rubro); // Use Axios to make a POST request
      setRubros([...rubros, response.data]); // Access the response data using response.data
    } catch (error) {
      console.log(error);
    }
  };

  const columns: Column<Rubro>[] = [
    // { title: 'ID', field: 'idRubro' },
    { title: 'Nombre', field: 'nombre',
    render: (rubro: Rubro) => <span>{rubro.nombre}</span>, },
    {
      title: "Estado",
      field: "activo",
      render: (rubro: Rubro) => <span>{rubro.activo ? "Activo" : "Inactivo"}</span>,
    },
  ]; 

  function updateJsonData(updatedRubros: Rubro[]) {
    throw new Error('Function not implemented.');
  }

  const handleRubroEdit = async (rubro: Rubro) => {
    try {
      const response = await Axios.put(`${API_URL}/${rubro.idRubro}`, rubro); // Use Axios to make a PUT request
      const updatedRubro: Rubro = response.data; // Access the response data using response.data
      const updatedRubros = rubros.map((r) =>
        r.idRubro === updatedRubro.idRubro ? updatedRubro : r
      );
      setRubros(updatedRubros);
      console.log(updatedRubros);
      updateJsonData(updatedRubros); // Actualizar el JSON con los rubros modificados
    } catch (error) {
      console.log(error);
    }
  };

  const handleRubroDelete = async (
    rowData: string[],
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    const rubroId: number = +rowData[0];
    try {
      await handleRequest('DELETE', `${API_URL}/${rubroId}`);
      const updatedRubros = rubros.filter((r) => r.idRubro !== rubroId);
      setRubros(updatedRubros);
    } catch (error) {
      console.log(error);
    }
  };

  const rubroRow = (id: number): Rubro | undefined => {
    return rubrosComplete.find((rubro) => rubro.idRubro === id);
  };

  const handleEditModalOpen = (item: Rubro) => {
    const selected = rubroRow(item.idRubro);
    if (selected) {
      setSelectedRubroProducto(selected);
      setEditModalShow(true);
    }
  };  

  const handleEditModalClose = () => {
    setSelectedRubroProducto(null);
    setEditModalShow(false);
  };

  const handleAddModalOpen = () => {
    setAddModalShow(true);
  };

  const handleAddModalClose = () => {
    setAddModalShow(false);
  };

  return (
    <Container fluid>
      <Row className="justify-content-start align-items-center mb-3">
        <Col>
          <h2>Tabla de Rubros</h2>
        </Col>
      </Row>
      <Row>
        <div>
          <GenericTable
            data={rubros}
            columns={columns}
            actions={actions}
            onAdd={handleAddModalOpen}
            onUpdate={handleEditModalOpen}
            // onDelete={handleRubroDelete}
          />
        </div>
      </Row>
      <AddRubroProductoModal
        show={addModalShow}
        handleClose={() => setAddModalShow(false)} //modifique esto
        handleRubroAdd={handleRubroAdd}
      />
      <EditRubroProductoModal
        show={editModalShow}
        handleClose={() => setEditModalShow(false)} //tambien modifique esto
        handleRubroEdit={handleRubroEdit}
        selectedRubro={selectedRubroProducto}
       
      />
    </Container>
  );
};

export default RubroProductos;