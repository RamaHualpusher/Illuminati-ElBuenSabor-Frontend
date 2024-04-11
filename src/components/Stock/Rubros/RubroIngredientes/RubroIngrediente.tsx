import React, { FC, useState } from 'react';
import { Container } from 'react-bootstrap';
import EditRubroIngredienteModal from './EditRubroIngredienteModal';
import AddRubroIngredienteModal from './AddRubroIngredienteModal';
import { IRubroNew } from '../../../../interface/IRubro';
import { IAction, IColumn } from '../../../../interface/ICamposTablaGenerica';
import GenericTable from "../../../GenericTable/GenericTable";
import axios from 'axios';

interface RubroIngredienteProps {
  categorias: IRubroNew[];
  rubros: IRubroNew[];
  onRubroChange: () => void;
}

const RubroIngrediente: FC<RubroIngredienteProps> = ({ categorias, rubros, onRubroChange  }) => {
  // Estados del componente
  const [editModalShow, setEditModalShow] = useState(false);
  const [addModalShow, setAddModalShow] = useState(false);
  const [selectedRubroIngrediente, setSelectedRubroIngrediente] = useState<IRubroNew | null>(null);
  const API_URL = process.env.REACT_APP_API_URL || "";

  // Acciones de la tabla
  const actions: IAction = {
    create: true,
    update: true
  };

  
  if (!rubros || !rubros.length) {
    return <p>Cargando...</p>;
  }
  
  // Función para manejar la adición de un rubro
  const handleRubroAdd = async (rubro: IRubroNew) => {
    console.log("Rubro ingrediente enviado a POST")
    console.log(rubro);
    try {
      const newRubro = await axios.post(`${API_URL}rubro`, rubro);
      if(newRubro){
        onRubroChange();
      }
    } catch (error) {
      console.log(error);
    }
    setAddModalShow(false);
  };

  // Función para manejar la edición de un rubro
  const handleRubroEdit = async (rubro: IRubroNew) => {
    console.log("Rubro ingrediente enviado a PUT")
    console.log(rubro);
    try {
      const updatedRubro = await axios.put(`${API_URL}rubro/${rubro.id}`, rubro);
      if(updatedRubro){
        onRubroChange();
      }
    } catch (error) {
      console.log(error);
    }
    setEditModalShow(false);
  };

  // Columnas de la tabla
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

  // Función para abrir el modal de edición
  const handleEditModalOpen = (item: IRubroNew) => {
    setSelectedRubroIngrediente(item);
    setEditModalShow(true);
  };

  // Función para cerrar el modal de edición
  const handleEditModalClose = () => {
    setSelectedRubroIngrediente(null);
    setEditModalShow(false);
  };

  // Función para abrir el modal de adición
  const handleAddModalOpen = () => {
    setAddModalShow(true);
  };

  // Función para cerrar el modal de adición
  const handleAddModalClose = () => {
    setAddModalShow(false);
  };

  return (
    <Container fluid>
      <div>
        <GenericTable
          data={rubros}
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
        categorias={categorias}
      />
      <AddRubroIngredienteModal
        show={addModalShow}
        handleClose={handleAddModalClose}
        handleRubroAdd={handleRubroAdd}
        categorias={categorias}
      />
    </Container>
  );
};

export default RubroIngrediente;