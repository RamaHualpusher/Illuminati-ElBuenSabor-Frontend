import React, { FC, useState, useEffect } from 'react';
import { Container, Row } from 'react-bootstrap';
import EditRubroProductoModal from './EditRubroProductoModal';
import AddRubroProductoModal from './AddRubroProductoModal';
import { Rubro } from '../../../../interface/Rubro';
import { Action, Column } from '../../../../interface/CamposTablaGenerica';
import GenericTable from '../../../GenericTable/GenericTable';
import Axios from 'axios';
import { handleRequest } from '../../../FuncionRequest/FuncionRequest';

const RubroProductos: FC = () => {
  const [rubros, setRubros] = useState<Rubro[]>([]);
  const [editModalShow, setEditModalShow] = useState(false);
  const [addModalShow, setAddModalShow] = useState(false);
  const [selectedRubroProducto, setSelectedRubroProducto] = useState<Rubro | null>(null);
  const API_URL = '/assets/data/rubrosProductosEjemplo.json';

  const actions: Action = {
    create: true,
    update: true,
  };

  useEffect(() => {
    const buscarRubros = async () => {
      try {
        const response = await Axios.get(API_URL); // Hacer una solicitud GET con Axios
        setRubros(response.data); // Actualizar el estado con los datos de respuesta
      } catch (error) {
        console.log(error);
      }
    };
    buscarRubros();
  }, []);

  const handleRubroAdd = async (rubro: Rubro) => {
    try {
      const newRubroProducto = await handleRequest('POST', API_URL, rubro); // Hacer una solicitud POST con la función de manejo de solicitudes
      setRubros(newRubroProducto); // Actualizar el estado con los datos de respuesta
      setAddModalShow(false);
    } catch (error) {
      console.log(error);
    }
  };

  const columns: Column<Rubro>[] = [
    // { title: 'ID', field: 'idRubro' },
    {
      title: 'Nombre', field: 'nombre',
      render: (rubro: Rubro) => <span>{rubro.nombre}</span>,
    },
    {
      title: "Estado",
      field: "estado",
      render: (rubro: Rubro) => (
        <span className={`${rubro.estado ? "text-success" : "text-danger"}`}>
          {rubro.estado ? <h2><i className="bi bi-unlock-fill "></i></h2> : <h2><i className="bi bi-lock-fill"></i></h2>}
        </span>
      ),
    },
  ];

  // Función no implementada, puedes eliminarla si no es necesaria
  function updateJsonData(updatedRubros: Rubro[]) {
    throw new Error('Function not implemented.');
  }

  const handleRubroEdit = async (rubro: Rubro) => {
    try {
      const response = await Axios.put(`${API_URL}/${rubro.idRubro}`, rubro); // Hacer una solicitud PUT con Axios
      const updatedRubro: Rubro = response.data; // Actualizar con los datos de respuesta
      const updatedRubros = rubros.map((r) =>
        r.idRubro === updatedRubro.idRubro ? updatedRubro : r
      );
      setRubros(updatedRubros);
      console.log(updatedRubros);
      updateJsonData(updatedRubros); // Actualizar el JSON con los rubros modificados (si es necesario)
    } catch (error) {
      console.log(error);
    }
  };

  const rubroRow = (id: number): Rubro | undefined => {
    return rubros.find((rubro) => rubro.idRubro === id);
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
      <Row>
        <div>
          <GenericTable
            data={rubros}
            columns={columns}
            actions={actions}
            onAdd={handleAddModalOpen}
            onUpdate={handleEditModalOpen}
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
