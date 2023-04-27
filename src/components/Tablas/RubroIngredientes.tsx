import React, { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
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
<Table striped bordered hover>
<thead>
<tr>
<th>Nombre</th>
<th>Activo</th>
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
<Button variant="success" onClick={handleAddModalOpen}>Agregar Rubro Ingrediente</Button>
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