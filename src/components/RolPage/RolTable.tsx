import React, { useState, useEffect } from "react";
import { Table, Dropdown, DropdownButton, InputGroup, FormControl, Button } from 'react-bootstrap';
import axios from 'axios';
import EditRolModal from './EditRolModal';
import AddRolModal from './AddRolModal';

export type Rol = {
  idRol: number;
  nombreRol: string;
};

export type RolTableProps = {
  url: string;
};

const RolTable = ({ url }: RolTableProps) => {
  const [data, setData] = useState<Rol[]>([]);
  const [editModalShow, setEditModalShow] = useState(false);
  const [addModalShow, setAddModalShow] = useState(false);
  const [selectedRol, setSelectedRol] = useState<Rol | null>(null);

  useEffect(() => {
    axios.get<Rol[]>(url)
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, [url]);

  const handleEditModalOpen = (rol: Rol) => {
    setSelectedRol(rol);
    setEditModalShow(true);
  }

  const handleEditModalClose = () => {
    setSelectedRol(null);
    setEditModalShow(false);
  }

  const handleAddModalOpen = () => {
    setAddModalShow(true);
  }

  const handleAddModalClose = () => {
    setAddModalShow(false);
  }

  const handleRolEdit = (rol: Rol) => {
    axios.put(`${url}/${rol.idRol}`, rol)
      .then(response => {
        const newData = [...data];
        const index = newData.findIndex(item => item.idRol === rol.idRol);
        newData[index] = response.data;
        setData(newData);
      })
      .catch(error => {
        console.log(error);
      });
  }

  const handleRolAdd = (rol: Rol) => {
    axios.post(url, rol)
      .then(response => {
        setData([...data, response.data]);
      })
      .catch(error => {
        console.log(error);
      });
  }

  const handleRolDelete = (rol: Rol) => {
    axios.delete(`${url}/${rol.idRol}`)
      .then(response => {
        setData(data.filter(item => item.idRol !== rol.idRol));
      })
      .catch(error => {
        console.log(error);
      });
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-4">
          <h3>Lista de roles</h3>
        </div>
        <div className="col-md-4">
          <InputGroup>
            <FormControl type="text" placeholder="Buscar rol" />
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
              Añadir rol
              <i className="bi bi-person-add fs-5"></i>
            </Button>
          </div>
        </div>
      </div>
      <Table striped bordered hover>
<thead>
<tr>
<th>ID</th>
<th>Nombre</th>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
{data.map(rol => (
<tr key={rol.idRol}>
<td>{rol.idRol}</td>
<td>{rol.nombreRol}</td>
<td>
<Button variant="primary" onClick={() => handleEditModalOpen(rol)}>Editar</Button>
</td>
<td>
<Button variant="danger" onClick={() => handleRolDelete(rol)}>Eliminar</Button>
</td>
</tr>
))}
</tbody>
</Table>
<EditRolModal
    show={editModalShow}
    handleClose={handleEditModalClose}
    handleRolEdit={handleRolEdit}
    selectedRol={selectedRol}
  />
  <AddRolModal
    show={addModalShow}
    handleClose={handleAddModalClose}
    handleRolAdd={handleRolAdd}
  />
</div>
);
};

export default RolTable;
