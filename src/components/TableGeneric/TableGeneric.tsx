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
  buttonEdit: (rowData:string[])=> void;
  buttonDelete:(rowData:string[])=>void;
}

export interface buttonAction {
  label:string;
  onClick:(rowData:string[]) =>void;
}

export const TablaGeneric: React.FC<Props> = ({ columns, data, buttonEdit, buttonDelete, showButton, }) => {

  const handleEdit=(rowData:string[])=>{
    buttonEdit(rowData);
  };
  const handleDelete=(rowData:string[])=>{
    buttonDelete(rowData);
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
            {showButton && <th style={{width:100}}>Editar</th>}
            {showButton && <th style={{width:100}}>Eliminar</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
              {showButton  && <td><button className="btn btn-primary" onClick={()=>handleEdit(row)}>Editar</button></td>}
              {showButton  && <td><button className="btn btn-primary" onClick={()=>handleDelete(row)}>Eliminar</button></td>}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};
