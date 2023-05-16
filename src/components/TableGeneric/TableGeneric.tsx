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
}

export const TablaGeneric: React.FC<Props> = ({ columns, data, showButton }) => {
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
            {showButton && <th style={{width:100}}>Button</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
              {showButton && <td><button className="btn btn-primary" >Boton</button></td>}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};
