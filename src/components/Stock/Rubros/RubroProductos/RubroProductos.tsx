import React, { FC, useState, useEffect } from 'react';
import { Container, Row } from 'react-bootstrap';
import EditRubroProductoModal from './EditRubroProductoModal';
import AddRubroProductoModal from './AddRubroProductoModal';
import { IRubroNew } from '../../../../interface/IRubro';
import { IAction, IColumn } from '../../../../interface/ICamposTablaGenerica';
import GenericTable from '../../../GenericTable/GenericTable';
import Axios from 'axios';
import { handleRequest } from '../../../FuncionRequest/FuncionRequest';

const RubroProductos: FC = () => {
  const [rubros, setRubros] = useState<IRubroNew[]>([]);
  const [editModalShow, setEditModalShow] = useState(false);
  const [addModalShow, setAddModalShow] = useState(false);
  const [selectedRubroProducto, setSelectedRubroProducto] = useState<IRubroNew | null>(null);
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
  
  if (!rubros || !rubros.length) {
    return <p>Cargando...</p>;
  }

  const handleRubroAdd = async (rubro: IRubroNew) => {
    try {
      const newRubroProducto = await handleRequest('POST', API_URL, rubro);
      setRubros(newRubroProducto);
      setAddModalShow(false);
    } catch (error) {
      console.log(error);
    }
  };

  const columns: IColumn<IRubroNew>[] = [
    // { title: 'ID', field: 'idRubro' },
    {
      title: 'Nombre', field: 'nombre',
      render: (rubro: IRubroNew) => <span>{rubro.nombre}</span>,
    },
    {
      title: "Estado",
      field: "activo",
      render: (rubro: IRubroNew) => (
        <span className={`${rubro.activo ? "text-success" : "text-danger"}`}>
          {rubro.activo ? <h2><i className="bi bi-unlock-fill "></i></h2> : <h2><i className="bi bi-lock-fill"></i></h2>}
        </span>
      ),
    },
  ];

  // Función no implementada, puedes eliminarla si no es necesaria
  function updateJsonData(updatedRubros: IRubroNew[]) {
    throw new Error('Function not implemented.');
  }

  const handleRubroEdit = async (rubro: IRubroNew) => {
    try {
      const response = await Axios.put(`${API_URL}/${rubro.id}`, rubro);
      const updatedRubro: IRubroNew = response.data;
      const updatedRubros = rubros.map((r) =>
        r.id === updatedRubro.id ? updatedRubro : r
      );
      setRubros(updatedRubros);
    } catch (error) {
      console.log(error);
    }
  };

  const rubroRow = (id?: number): IRubroNew | undefined => {
    if (id === undefined) {
      return undefined;
    }
    return rubros.find((rubro) => rubro.id === id);
  };

  const handleEditModalOpen = (item: IRubroNew) => {
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
