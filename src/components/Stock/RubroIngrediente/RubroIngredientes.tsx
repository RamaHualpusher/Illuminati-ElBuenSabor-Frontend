import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import EditRubroIngredienteModal from "./EditRubroIngredienteModal";
import AddRubroIngredienteModal from "./AddRubroIngredienteModal";
import { RubrosIngredientes } from "../../../interface/interfaces";

import "bootstrap/dist/css/bootstrap.min.css";
import { TablaGeneric } from "../../TableGeneric/TableGeneric";



interface RubrosIngredientesTableProps { }

const RubrosIngredientesTable : React.FC<RubrosIngredientesTableProps>= () => {
  const [order, setOrder] = useState<RubrosIngredientes[]>([]);
  const [editModalShow, setEditModalShow] = useState(false);
  const [addModalShow, setAddModalShow] = useState(false);
  const [dataComplete, setdataComplete] = useState<RubrosIngredientes[]>([]);
  const [selectedRubroIngrediente, setSelectedRubroIngrediente] = useState<RubrosIngredientes | null>(null);

    useEffect(() => {
    
      const fetchData = async () => {
        try {
          const response = await fetch("/assets/data/dataTableRubrosIngredientes.json");
          const responseData = await response.json();
          setOrder(responseData);
          setdataComplete(responseData);
        } catch (error) {
          console.log(error);
        }
      };
      fetchData();
    }, []);

  const handleEditModalOpen = (rubroIngrediente: RubrosIngredientes) => {
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


  const handleRubroIngredienteEdit = async (rubroIngrediente: RubrosIngredientes) => {
    try {
      const response = await fetch(`${"/assets/data/dataTableRubrosIngredientes.json"}/${rubroIngrediente.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rubroIngrediente),
      });
      const updatedProducto = await response.json();

      const newData = [...order];
      const index = newData.findIndex((item) => item.id === rubroIngrediente.id);
      newData[index] = updatedProducto;

      setOrder(newData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRubroIngredienteAdd = async (rubroIngrediente: RubrosIngredientes) => {
    try {
      const response = await fetch("/assets/data/dataTableRubrosIngredientes.json", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rubroIngrediente),
      });
      const newProducto = await response.json();

      setOrder([...order, newProducto]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRubroIngredienteDelete = async (rubroIngrediente: RubrosIngredientes) => {
    try {
      await fetch(`${"/assets/data/productosEjemplo.json"}/${rubroIngrediente.id}`, {
        method: 'DELETE',
      });

      setOrder(order.filter((item) => item.id !== rubroIngrediente.id));
    } catch (error) {
      console.log(error);
    }
  };

  const column = [
    { label: "Rubro", width: 100 },
    { label: "Nombre", width: 100 }
  ];

  const data = order.map((item) => [
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
      <div>
        <TablaGeneric columns={column} data={data} showButton={true}/>
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
