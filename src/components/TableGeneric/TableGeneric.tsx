import React from 'react';
import { Table } from 'react-bootstrap';

interface Column {
  label: string;
  width?: string | number;
}

interface Props {
  columns: Column[];
  data: string[][];
  showButton?: boolean;
  buttonAdd: (rowData: string[], e: React.MouseEvent<HTMLButtonElement>) => void;
  buttonView?: (rowData: string[], e: React.MouseEvent<HTMLButtonElement>) => void;
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
  buttonView,
  buttonEdit,
  buttonDelete,
  showButton,
}) => {
  const handleAdd = (rowData: string[], e: React.MouseEvent<HTMLButtonElement>) => {
    buttonAdd(rowData, e);
  };

  const handleView = (rowData: string[], e: React.MouseEvent<HTMLButtonElement>) => {
    if (buttonView) {
      buttonView(rowData, e);
    }
  };

  const handleEdit = (rowData: string[], e: React.MouseEvent<HTMLButtonElement>) => {
    buttonEdit(rowData, e);
  };

  const handleDelete = (rowData: string[], e: React.MouseEvent<HTMLButtonElement>) => {
    buttonDelete(rowData, e);
  };

  return (
    <div>
      <Table striped bordered hover>
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index} style={{ width: column.width }}>
                {column.label}
              </th>
            ))}
            {showButton && <th style={{ width: 100 }}>Agregar</th>}
            {showButton && <th style={{ width: 100 }}>Ver</th>}
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
                  <td>
                    {buttonView ? (
                      <button className="btn btn-primary" onClick={(e) => handleView(row, e)}>
                        Ver
                      </button>
                    ) : (
                      <span>-</span>
                    )}
                  </td>
                  <td>
                    <button className="btn btn-success" onClick={(e) => handleAdd(row, e)}>
                      Agregar
                    </button>
                  </td>                
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

