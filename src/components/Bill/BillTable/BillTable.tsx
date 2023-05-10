import { cashierOrder } from '../../../types/types';
import { Table } from 'react-bootstrap';

interface BillTableProps {
  orders: cashierOrder[];
}

const BillTable = ({ orders }: BillTableProps) => {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>IdPedido</th>
          <th>FechaPedido</th>
          <th>FormaEntrega</th>
          <th>FormaPago</th>
          <th>Pagado</th>
          <th>Estado</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.IdPedido}>
            <td>{order.IdPedido}</td>
            <td>{order.FechaPedido}</td>
            <td>{order.FormaEntrega}</td>
            <td>{order.FormaPago}</td>
            <td>{order.Pagado}</td>
            <td>{order.Estado}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default BillTable;
