import React, { FC, useState } from 'react';
import { Container, Row } from 'react-bootstrap';
import EditRubroProductoModal from './EditRubroProductoModal';
import AddRubroProductoModal from './AddRubroProductoModal';
import { IRubroNew } from '../../../../interface/IRubro';
import { IAction, IColumn } from '../../../../interface/ICamposTablaGenerica';
import GenericTable from '../../../GenericTable/GenericTable';
import axios from 'axios';

interface RubroProductosProps {
  categorias: IRubroNew[];
  rubros: IRubroNew[];
  onRubroChange: () => void;
}

const RubroProductos: FC<RubroProductosProps> = ({ categorias, rubros, onRubroChange  }) => {
  const [editModalShow, setEditModalShow] = useState(false);
  const [addModalShow, setAddModalShow] = useState(false);
  const [selectedRubroProducto, setSelectedRubroProducto] = useState<IRubroNew | null>(null);
  const API_URL = process.env.REACT_APP_API_URL || "";

  const actions: IAction = {
    create: true,
    update: true,
  };
  
  if (!rubros || !rubros.length) {
    return <p>Cargando...</p>;
  }

  const handleRubroAdd = async (rubro: IRubroNew) => {
    try {
      console.log("Rubro de producto enviado para POST");
      console.log(rubro);
      const response = await axios.post<IRubroNew[]>(`${API_URL}rubro`,rubro);
      if(response){
        onRubroChange();
      }
    } catch (error) {
      console.log(error);
    }
    setAddModalShow(false);
  };
  const handleRubroEdit = async (rubro: IRubroNew) => {
      try {
        const response = await axios.put(`${API_URL}rubro/${rubro.id}`, rubro);
        const updatedRubro: IRubroNew = response.data;
        if(updatedRubro){
          onRubroChange();
        }
      } catch (error) {
        console.log(error);
      }
      setEditModalShow(false);
    };
  const columns: IColumn<IRubroNew>[] = [
    {
      title: 'Nombre', field: 'nombre',
      render: (rubro: IRubroNew) => <span>{rubro.nombre}</span>,
    },
    {
      title: 'Categoría', field: 'rubroPadre',
      render: (rubro: IRubroNew) => <span>{rubro.rubroPadre?.nombre}</span>,
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
        categorias={categorias}
      />
      <EditRubroProductoModal
        show={editModalShow}
        handleClose={handleEditModalClose}
        handleRubroEdit={handleRubroEdit}
        selectedRubro={selectedRubroProducto}
        categorias={categorias}
      />
    </Container>
  );
};

export default RubroProductos;