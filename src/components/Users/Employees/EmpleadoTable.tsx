import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Table, Dropdown, DropdownButton, InputGroup, FormControl } from 'react-bootstrap';
import axios from 'axios';
import EditEmpleadoModal from './EditEmpleadoModal';
import AddEmpleadoModal from './AddEmpleadoModal';
import { Usuario } from "../../../interface/Usuario";


export type EmpleadoTableProps = {
  url: string;
};

const EmpleadoTable = ({ url }: EmpleadoTableProps) => {
  const [data, setData] = useState<Usuario[]>([]);
  const [editModalShow, setEditModalShow] = useState(false);
  const [addModalShow, setAddModalShow] = useState(false);
  const [selectedEmpleado, setSelectedEmpleado] = useState<Usuario | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<Usuario[]>(url);
        setData(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [url]);

  const handleEditModalOpen = (empleado: Usuario) => {
    setSelectedEmpleado(empleado);
    setEditModalShow(true);
  };

  const handleEditModalClose = () => {
    setSelectedEmpleado(null);
    setEditModalShow(false);
  };

  const handleAddModalOpen = () => {
    setAddModalShow(true);
  };

  const handleAddModalClose = () => {
    setAddModalShow(false);
  };

  const handleEmpleadoEdit = async (empleado: Usuario) => {
    try {
      const response = await axios.put(`${url}/${empleado.idUsuario}`, empleado);
      const newData = [...data];
      const index = newData.findIndex(item => item.idUsuario === empleado.idUsuario);
      newData[index] = response.data;
      setData(newData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEmpleadoAdd = async (empleado: Usuario) => {
    try {
      const response = await axios.post(url, empleado);
      setData([...data, response.data]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEmpleadoDelete = async (empleado: Usuario) => {
    try {
      await axios.delete(`${url}/${empleado.idUsuario}`);
      setData(data.filter(item => item.idUsuario !== empleado.idUsuario));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container>
      <Row className="justify-content-start align-items-center mb-3">
        <Col sm={4}>
          <h3>Lista empleados</h3>
        </Col>
        <Col sm={4}>
          <InputGroup>
            <FormControl type="text" placeholder="Buscar empleado" />
            <Button variant="outline-secondary">
              <i className="bi bi-search"></i>
            </Button>
          </InputGroup>
        </Col>
        <Col sm={4}>
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
        </Col>
      </Row>
      <Table striped bordered responsive>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Rol</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map(empleado => (
            <tr key={empleado.idUsuario}>
              <td>{empleado.nombre}</td>
              <td>{empleado.apellido}</td>
              <td>{empleado.Rol.nombreRol}</td>
              <td>{empleado.email}</td>
              <td>{empleado.telefono}</td>
              <td>
                <Button variant="primary" className="me-2" onClick={() => handleEditModalOpen(empleado)}>
                  Editar
                </Button>
                <Button variant="danger" onClick={() => handleEmpleadoDelete(empleado)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <EditEmpleadoModal
        show={editModalShow}
        handleClose={handleEditModalClose}
        selectedEmpleado={selectedEmpleado}
        handleEmpleadoEdit={handleEmpleadoEdit}
      />
      <AddEmpleadoModal
        show={addModalShow}
        handleClose={handleAddModalClose}
        handleEmpleadoAdd={handleEmpleadoAdd}
      />
    </Container>
  );
};

export default EmpleadoTable;
