import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import axios from "axios";
import EditRubroIngredienteModal from "./EditRubroIngredienteModal";
import AddRubroIngredienteModal from "./AddRubroIngredienteModal";

import "bootstrap/dist/css/bootstrap.min.css";

export type RubroIngrediente = {
  id: number;
  nombre: string;
  rubro: string;
};

type RubrosIngredientesTableProps = {
  url: string;
};

const RubrosIngredientesTable = ({ url }: RubrosIngredientesTableProps) => {
  const [order, setOrder] = useState<RubroIngrediente[]>([]);
  const [editModalShow, setEditModalShow] = useState(false);
  const [addModalShow, setAddModalShow] = useState(false);
  const [selectedRubroIngrediente, setSelectedRubroIngrediente] =
    useState<RubroIngrediente | null>(null);

  useEffect(() => {
    axios
      .get<RubroIngrediente[]>(url)
      .then((response) => {
        setOrder(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [url]);

  const handleEditModalOpen = (rubroIngrediente: RubroIngrediente) => {
    setSelectedRubroIngrediente(rubroIngrediente);
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

  const handleRubroIngredienteEdit = (rubroIngrediente: RubroIngrediente) => {
    axios
      .put(`${url}/${rubroIngrediente.id}`, rubroIngrediente)
      .then((response) => {
        const newData = [...order];
        const index = newData.findIndex(
          (item) => item.id === rubroIngrediente.id
        );
        newData[index] = response.data;
        setOrder(newData);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleRubroIngredienteAdd = (rubroIngrediente: RubroIngrediente) => {
    axios
      .post(url, rubroIngrediente)
      .then((response) => {
        setOrder([...order, response.data]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleRubroIngredienteDelete = (rubroIngrediente: RubroIngrediente) => {
    axios
      .delete(`${url}/${rubroIngrediente.id}`)
      .then((response) => {
        setOrder(order.filter((item) => item.id !== rubroIngrediente.id));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const column =[
    {label: "Rubro", width:100},
    {label: "Nombre", width:100}
  ];

  const data = order.map((item) =>[
    item.rubro.toString(),
    item.nombre.toString()
  ])

  return (
    <div>
      <div
        className="d-flex justify-content-start m-3">
        <Button variant="success" onClick={handleAddModalOpen}>
          Agregar Rubro Ingrediente
        </Button>
        {/* <DropdownButton options={options} /> */}
      </div>
{/*
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Rubro</th>
            <th>Nombre</th>
            <th>Editar</th>
            <th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {order.map((item) => (
            <tr key={item.id}>
              <td>{item.rubro}</td>
              <td>{item.nombre}</td>
              <td>
                <Button
                  variant="primary"
                  onClick={() => handleEditModalOpen(item)}
                >
                  Editar
                </Button>
              </td>
              <td>
                <Button
                  variant="danger"
                  onClick={() => handleRubroIngredienteDelete(item)}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
*/}
      <EditRubroIngredienteModal
        show={editModalShow}
        handleClose={handleEditModalClose}
        handleRubroIngredienteEdit={handleRubroIngredienteEdit}
        selectedRubroIngrediente={selectedRubroIngrediente}
      />
      <AddRubroIngredienteModal
        show={addModalShow}
        handleClose={handleAddModalClose}
        handleRubroIngredienteAdd={handleRubroIngredienteAdd}
      />
    </div>
  );
};

export default RubrosIngredientesTable;
