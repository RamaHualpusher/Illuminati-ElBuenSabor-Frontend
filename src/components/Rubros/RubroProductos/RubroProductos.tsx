import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { handleRequest } from '../../FuncionRequest/FuncionRequest';
import EditRubroProductoModal from './EditRubroProductoModal';
import AddRubroProductoModal from './AddRubroProductoModal';
import { Rubro } from '../../../interface/Rubro';
import { Action, Column } from '../../../interface/CamposTablaGenerica';
import GenericTable from '../../GenericTable/GenericTable';

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

  const columns: Column<Rubro>[] = [
    // { title: 'ID', field: 'idRubro' },
    { title: 'Nombre', field: 'nombre' },
  ];

  useEffect(() => {
    const fetchRubros = async () => {
      try {
        const responseData = await handleRequest('GET', API_URL);
        setRubros(responseData);
        setRubrosComplete(responseData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchRubros();
  }, []);

  const handleRubroAdd = async (rubro: Rubro) => {
    try {
      const newRubro = await handleRequest('POST', API_URL, rubro);
      setRubros([...rubros, newRubro]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRubroEdit = async (rubro: Rubro) => {
    try {
      const updatedRubro: Rubro = await handleRequest(
        'PUT',
        `${API_URL}/${rubro.idRubro}`,
        rubro
      );

      const updatedRubros = rubros.map((r) =>
        r.idRubro === updatedRubro.idRubro ? updatedRubro : r
      );
      setRubros(updatedRubros);
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
        handleClose={handleAddModalClose}
        handleRubroAdd={handleRubroAdd}
      />
      <EditRubroProductoModal
        show={editModalShow}
        handleClose={handleEditModalClose}
        handleRubroEdit={handleRubroEdit}
        selectedRubro={selectedRubroProducto}
      />
    </Container>
  );
};

export default RubroProductos;
