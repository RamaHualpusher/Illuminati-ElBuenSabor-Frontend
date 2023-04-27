import React, { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import axios from 'axios';

import 'bootstrap/dist/css/bootstrap.min.css';

type Ingrediente = {
  id: number;
  nombre: string;
  activo: boolean;
};

type IngredientesTableProps = {
  url: string;
};

const IngredientesTable = ({ url }: IngredientesTableProps) => {
  const [data, setData] = useState<Ingrediente[]>([]);

  useEffect(() => {
    axios.get<Ingrediente[]>(url)
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, [url]);

  return (
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
              <Button variant="primary">Editar</Button>{' '}
              <Button variant="danger">Eliminar</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default IngredientesTable;
