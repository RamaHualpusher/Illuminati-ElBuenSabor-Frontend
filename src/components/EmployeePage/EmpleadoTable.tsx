import React, { useState, useEffect } from "react";
import { Table, Dropdown, DropdownButton, InputGroup, FormControl, Button } from 'react-bootstrap';
import axios from 'axios';
import EditEmpleadoModal from './EditEmpleadoModal';
import AddEmpleadoModal from './AddEmpleadoModal';
import { Rol,Empleado } from "../../types/types";

export type EmpleadoTableProps = {
  url: string;
};

const EmpleadoTable = ({ url }: EmpleadoTableProps) => {
  const [data, setData] = useState<Empleado[]>([]);
  const [editModalShow, setEditModalShow] = useState(false);
  const [addModalShow, setAddModalShow] = useState(false);
  const [selectedEmpleado, setSelectedEmpleado] = useState<Empleado | null>(null);

  useEffect(() => {
    axios.get<Empleado[]>(url)
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, [url]);

  const handleEditModalOpen = (empleado: Empleado) => {
    setSelectedEmpleado(empleado);
    setEditModalShow(true);
  }

  const handleEditModalClose = () => {
    setSelectedEmpleado(null);
    setEditModalShow(false);
  }

  const handleAddModalOpen = () => {
    setAddModalShow(true);
  }

  const handleAddModalClose = () => {
    setAddModalShow(false);
  }

  const handleEmpleadoEdit = (empleado: Empleado) => {
    axios.put(`${url}/${empleado.id}`, empleado)
      .then(response => {
        const newData = [...data];
        const index = newData.findIndex(item => item.id === empleado.id);
        newData[index] = response.data;
        setData(newData);
      })
      .catch(error => {
        console.log(error);
      });
  }

  const handleEmpleadoAdd = (empleado: Empleado) => {
    axios.post(url, empleado)
      .then(response => {
        setData([...data, response.data]);
      })
      .catch(error => {
        console.log(error);
      });
  }

  const handleEmpleadoDelete = (empleado: Empleado) => {
    axios.delete(`${url}/${empleado.id}`)
      .then(response => {
        setData(data.filter(item => item.id !== empleado.id));
      })
      .catch(error => {
        console.log(error);
      });
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-4">
          <h3>Lista empleados</h3>
        </div>
        <div className="col-md-4">
          <InputGroup>
            <FormControl type="text" placeholder="Buscar empleado" />
            <Button variant="outline-secondary">
              <i className="bi bi-search"></i>
            </Button>
          </InputGroup>
        </div>
        <div className="col-md-4">
          <div className="d-flex align-items-center">
            <DropdownButton id="dropdown-basic-button" title="Filtrar">
              <Dropdown.Item href="#">Filtro 1</Dropdown.Item>
              <Dropdown.Item href="#">Filtro 2</Dropdown.Item>
              <Dropdown.Item href="#">Filtro 3</Dropdown.Item>
            </DropdownButton>
            <Button variant="primary" className="ms-2" onClick={handleAddModalOpen}>
              Añadir empleado
              <i className="bi bi-person-add fs-5"></i>
            </Button>
          </div>
        </div>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>NOMBRE</th>
            <th>APELLIDO</th>
            <th>EMAIL</th>
            <th>ROL</th>
            <th>ESTADO</th>
          </tr>
        </thead>
        <tbody>
          {data.map(empleado => (
            <tr key={empleado.id}>
              <td>{empleado.nombre}</td>
              <td>{empleado.apellido}</td>
              <td>{empleado.email}</td>
              <td>{empleado.rol ? empleado.rol.nombreRol : "-"}</td>
              <td>{empleado.estado.toString()}</td>
              <td>
                <Button variant="primary" onClick={() => handleEditModalOpen(empleado)}>Editar</Button>
              </td>
              <td>
                <Button variant="danger" onClick={() => handleEmpleadoDelete(empleado)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <EditEmpleadoModal
        show={editModalShow}
        handleClose={handleEditModalClose}
        handleEmpleadoEdit={handleEmpleadoEdit}
        selectedEmpleado={selectedEmpleado}
      />
      <AddEmpleadoModal
        show={addModalShow}
        handleClose={handleAddModalClose}
        handleEmpleadoAdd={handleEmpleadoAdd}
      />
    </div>
  );
};

export default EmpleadoTable;
