import React, { useState, useEffect } from 'react';
import { Container, Col, Row } from 'react-bootstrap';
import EditRubroIngredienteModal from './EditRubroIngredienteModal';
import AddRubroIngredienteModal from './AddRubroIngredienteModal';
import { Rubro } from '../../../../interface/Rubro';
import { handleRequest } from '../../../FuncionRequest/FuncionRequest';
import { Action, Column } from '../../../../interface/CamposTablaGenerica';
import GenericTable from "../../../GenericTable/GenericTable";
import Axios from 'axios';

const RubroIngrediente: React.FC = () => {
  const [rubros, setRubros] = useState<Rubro[]>([]);
  const [editModalShow, setEditModalShow] = useState(false);
  const [addModalShow, setAddModalShow] = useState(false);
  const [selectedRubroIngrediente, setSelectedRubroIngrediente] = useState<Rubro | null>(null);
  const [rubrosComplete, setRubrosComplete] = useState<Rubro[]>([]);
  const API_URL = "/assets/data/rubrosIngredientesEjemplo.json";

  const actions: Action = {
    create: true,
    update: true
  };

  useEffect(() => {
    const buscarRubros = async () => {
      try {
        const response = await Axios.get(API_URL);
        setRubros(response.data);
        setRubrosComplete(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    buscarRubros();
  }, []);

  const handleRubroAdd = async (rubro: Rubro) => {
    try {
      const newRubroIngrediente = await handleRequest('POST', API_URL, rubro);
      setRubros(newRubroIngrediente);
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

  const rubroRow = (id: number): Rubro | undefined => {
    return rubrosComplete.find((rubro) => rubro.idRubro === id);
  };

  // const handleRubroDelete = (rowData: string[], e: React.MouseEvent<HTMLButtonElement>) => {
  //   e.preventDefault();
  //   const rubroId: number = +rowData[0];
  //   fetch(`${API_URL}/${rubroId}`, {
  //     method: 'DELETE',
  //   })
  //     .then(response => {
  //       setIngredRubro(ingredRubro.filter(item => item.idRubro !== rubroId));
  //     })
  //     .catch(error => {
  //       console.log(error);
  //     });
  // }

  return (
    <div>
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
    </div>
  );
};

export default RubroIngrediente;
