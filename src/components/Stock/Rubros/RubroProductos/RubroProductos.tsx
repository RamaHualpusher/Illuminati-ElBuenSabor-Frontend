import React, { FC, useState, useEffect } from 'react';
import { Container, Row } from 'react-bootstrap';
import EditRubroProductoModal from './EditRubroProductoModal';
import AddRubroProductoModal from './AddRubroProductoModal';
import { IRubro } from '../../../../interface/IRubro';
import { IAction, IColumn } from '../../../../interface/ICamposTablaGenerica';
import GenericTable from '../../../GenericTable/GenericTable';
import Axios from 'axios';
import { handleRequest } from '../../../FuncionRequest/FuncionRequest';

const RubroProductos: FC = () => {
  const [rubros, setRubros] = useState<IRubro[]>([]);
  const [editModalShow, setEditModalShow] = useState(false);
  const [addModalShow, setAddModalShow] = useState(false);
  const [selectedRubroProducto, setSelectedRubroProducto] = useState<IRubro | null>(null);
  const API_URL = '/assets/data/rubrosProductosEjemplo.json';

  const actions: IAction = {
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

  const handleRubroAdd = async (rubro: IRubro) => {
    try {
      const newRubroProducto = await handleRequest('POST', API_URL, rubro); // Hacer una solicitud POST con la función de manejo de solicitudes
      setRubros(newRubroProducto); // Actualizar el estado con los datos de respuesta
      setAddModalShow(false);
    } catch (error) {
      console.log(error);
    }
  };

  const columns: IColumn<IRubro>[] = [
    // { title: 'ID', field: 'idRubro' },
    {
      title: 'Nombre', field: 'nombre',
      render: (rubro: IRubro) => <span>{rubro.nombre}</span>,
    },
    {
      title: "Estado",
      field: "activo",
      render: (rubro: IRubro) => (
        <span className={`${rubro.activo ? "text-success" : "text-danger"}`}>
          {rubro.activo ? <h2><i className="bi bi-unlock-fill "></i></h2> : <h2><i className="bi bi-lock-fill"></i></h2>}
        </span>
      ),
    },
  ];

  // Función no implementada, puedes eliminarla si no es necesaria
  function updateJsonData(updatedRubros: IRubro[]) {
    throw new Error('Function not implemented.');
  }

  const handleRubroEdit = async (rubro: IRubro) => {
    try {
      const response = await Axios.put(`${API_URL}/${rubro.id}`, rubro); // Hacer una solicitud PUT con Axios
      const updatedRubro: IRubro = response.data; // Actualizar con los datos de respuesta
      const updatedRubros = rubros.map((r) =>
        r.id === updatedRubro.id ? updatedRubro : r
      );
      setRubros(updatedRubros);
      console.log(updatedRubros);
      updateJsonData(updatedRubros); // Actualizar el JSON con los rubros modificados (si es necesario)
    } catch (error) {
      console.log(error);
    }
  };

  const rubroRow = (id?: number): IRubro | undefined => {
    if (id === undefined) {
      return undefined;
    }
    return rubros.find((rubro) => rubro.id === id);
  };

  const handleEditModalOpen = (item: IRubro) => {
    const selected = rubroRow(item.id);
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
