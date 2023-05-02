import React, { useState, useEffect } from 'react';
import { Table, Button, DropdownButton, Dropdown } from 'react-bootstrap';
import axios from 'axios';
import EditRubroIngredienteModal from './EditRubroIngredienteModal';
import AddRubroIngredienteModal from './AddRubroIngredienteModal';

import 'bootstrap/dist/css/bootstrap.min.css';

export type RubroIngrediente = {
id: number;
nombre: string;
activo: boolean;
};

type RubrosIngredientesTableProps = {
url: string;
};

const RubrosIngredientesTable = ({ url }: RubrosIngredientesTableProps) => {
const [data, setData] = useState<RubroIngrediente[]>([]);
const [editModalShow, setEditModalShow] = useState(false);
const [addModalShow, setAddModalShow] = useState(false);
const [selectedRubroIngrediente, setSelectedRubroIngrediente] = useState<RubroIngrediente | null>(null);
const [selectedRubro, setSelectedRubro] = useState<string | null>(null);
const options = ["Todos", "Lácteos", "Carne", "Verduras"];

useEffect(() => {
axios.get<RubroIngrediente[]>(url)
.then(response => {
setData(response.data);
})
.catch(error => {
console.log(error);
});
}, [url]);

const handleEditModalOpen = (rubroIngrediente: RubroIngrediente) => {
setSelectedRubroIngrediente(rubroIngrediente);
setEditModalShow(true);
}

const handleEditModalClose = () => {
setSelectedRubroIngrediente(null);
setEditModalShow(false);
}

const handleAddModalOpen = () => {
setAddModalShow(true);
}

const handleAddModalClose = () => {
setAddModalShow(false);
}

const handleRubroIngredienteEdit = (rubroIngrediente: RubroIngrediente) => {
  axios.put(`${url}/${rubroIngrediente.id}`, rubroIngrediente)
.then(response => {
const newData = [...data];
const index = newData.findIndex(item => item.id === rubroIngrediente.id);
newData[index] = response.data;
setData(newData);
})
.catch(error => {
console.log(error);
});
}

const handleRubroIngredienteAdd = (rubroIngrediente: RubroIngrediente) => {
axios.post(url, rubroIngrediente)
.then(response => {
setData([...data, response.data]);
})
.catch(error => {
console.log(error);
});
}

const handleRubroIngredienteDelete = (rubroIngrediente: RubroIngrediente) => {
  axios.delete(`${url}/${rubroIngrediente.id}`)
.then(response => {
setData(data.filter(item => item.id !== rubroIngrediente.id));
})
.catch(error => {
console.log(error);
});
}

return (
<>

<div className="d-flex justify-content-start" style={{ marginLeft: "10px" }}>
  <Button variant="success" onClick={handleAddModalOpen}>
    Agregar Rubro Ingrediente
  </Button>
  <DropdownButton id="dropdown-basic-button" title="Dropdown button">
      <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
      <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
      <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
  </DropdownButton>
</div>


<Table striped bordered hover>
<thead>
<tr>
<th>Rubro</th>
<th>Nombre</th>
<th>Acciones</th>
</tr>
</thead>
<tbody>
{data.map(item => (
<tr key={item.id}>
<td>{item.nombre}</td>
<td>{item.activo ? 'Sí' : 'No'}</td>
<td>
<Button variant="primary" onClick={() => handleEditModalOpen(item)}>Editar</Button>{' '}
<Button variant="danger" onClick={() => handleRubroIngredienteDelete(item)}>Eliminar</Button>
</td>
</tr>
))}
</tbody>
</Table>

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
</>
);
};

export default RubrosIngredientesTable;