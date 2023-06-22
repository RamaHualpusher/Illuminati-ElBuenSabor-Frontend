import React from 'react';
import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';

interface Column {
  label: string;
  width?: string | number;
}

interface Props {
  columns: Column[];
  data: string[][];
  showButton?: boolean;
  link?: string;
  buttonAdd: () => void;
  buttonEdit: (rowData: string[], e: React.MouseEvent<HTMLButtonElement>) => void;
  buttonDelete: (rowData: string[], e: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface buttonAction {
  label: string;
  onClick: (rowData: string[]) => void;
}

export const TablaGeneric: React.FC<Props> = ({
  columns,
  data,
  buttonAdd,
  link,
  buttonEdit,
  buttonDelete,
  showButton,
}) => {
  const handleAdd = () => {
    buttonAdd();
  };

  const handleEdit = (rowData: string[], e: React.MouseEvent<HTMLButtonElement>) => {
    buttonEdit(rowData, e);
  };

  const handleDelete = (rowData: string[], e: React.MouseEvent<HTMLButtonElement>) => {
    buttonDelete(rowData, e);
  };

  return (
    <div>
      <div className='d-flex flex-row'>
        <button className="btn btn-success" onClick={(e) => handleAdd()}>
          Agregar
        </button>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index} style={{ width: column.width }}>
                {column.label}
              </th>
            ))}

            {showButton && link && <th style={{ width: 100 }}>Ver</th>}
            {showButton && <th style={{ width: 100 }}>Editar</th>}
            {showButton && <th style={{ width: 100 }}>Eliminar</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
              {showButton && (
                <>

                  {link && (<td>
                    <Link className="btn btn-primary" to={`/${link}/${row[0]}`}>
                      Ver
                    </Link>
                  </td>)}
                  <td>
                    <button className="btn btn-success" onClick={(e) => handleEdit(row, e)}>
                      Editar
                    </button>
                  </td>
                  <td>
                    <button className="btn btn-danger" onClick={(e) => handleDelete(row, e)}>
                      Eliminar
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

