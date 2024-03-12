import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import EditRubroIngredienteModal from './EditRubroIngredienteModal';
import AddRubroIngredienteModal from './AddRubroIngredienteModal';
import { IRubroNew } from '../../../../interface/IRubro';
import { IAction, IColumn } from '../../../../interface/ICamposTablaGenerica';
import GenericTable from "../../../GenericTable/GenericTable";
import axios from 'axios';

const RubroIngrediente: React.FC = () => {
  // Estados del componente
  const [rubros, setRubros] = useState<IRubroNew[]>([]);
  const [editModalShow, setEditModalShow] = useState(false);
  const [addModalShow, setAddModalShow] = useState(false);
  const [selectedRubroIngrediente, setSelectedRubroIngrediente] = useState<IRubroNew | null>(null);
  const API_URL = "/assets/data/rubrosIngredientesEjemplo.json";

  // Acciones de la tabla
  const actions: IAction = {
    create: true,
    update: true
  };

  // Cargar los rubros al montar el componente
  useEffect(() => {
    const fetchRubros = async () => {
      try {
        const response = await axios.get(API_URL);
        setRubros(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchRubros();
  }, []);

  
  if (!rubros || !rubros.length) {
    return <p>Cargando...</p>;
  }
  
  // Función para manejar la adición de un rubro
  const handleRubroAdd = async (rubro: IRubroNew) => {
    try {
      const newRubro = await axios.post(`${API_URL}rubro`, rubro);
      setRubros([...rubros, newRubro.data]);
      setAddModalShow(false);
    } catch (error) {
      console.log(error);
    }
  };

  // Columnas de la tabla
  const columns: IColumn<IRubroNew>[] = [
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

  // Función para manejar la edición de un rubro
  const handleRubroEdit = async (rubro: IRubroNew) => {
    try {
      const updatedRubro = await axios.put(`${API_URL}rubro.id`, rubro);
      const updatedRubros = rubros.map((r) => r)
      setRubros(updatedRubros);
    } catch (error) {
      console.log(error);
    }
    setEditModalShow(false);
  };

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
      />
      <AddRubroIngredienteModal
        show={addModalShow}
        handleClose={handleAddModalClose}
        handleRubroAdd={handleRubroAdd}
      />
    </Container>
  );
};

export default RubroIngrediente;
