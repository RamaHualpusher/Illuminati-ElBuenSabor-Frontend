import React, { useState, useEffect } from 'react';
import { handleRequest } from '../FuncionRequest/FuncionRequest';
import { Pedido } from '../../interface/Pedido';
import { useNavigate } from 'react-router-dom';
import { Action, Column } from '../../interface/CamposTablaGenerica';
import GenericTableRama from '../GenericTable/GenericTableRama';

interface FacturasTableProps {}

const FacturasTable: React.FC<FacturasTableProps> = () => {
  const [facturas, setFacturas] = useState<Pedido[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseData = await handleRequest('GET', 'assets/data/pedidos.json');
        setFacturas(responseData);
        console.log(responseData);
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message);
        } else {
          console.error(error);
        }
      }
    };
    fetchData();
  }, []);

  // Define las columnas
  const columns: Column<Pedido>[] = [
    { title: 'Numero Factura', field: 'numeroPedido' },
    {
      title: 'Usuario',
      field: 'Usuario',
      render: (pedido: Pedido) =>
        <span>{`${pedido.Usuario.apellido}, ${pedido.Usuario.nombre}`}</span>
    },
    {
      title: 'Productos',
      field: 'DetallePedido',
      render: (pedido: Pedido) => (
        <ul>
          {pedido.DetallePedido.map((detalle) => (
            <li key={detalle.idDetallePedido}>{detalle.Producto.nombre}</li>
          ))}
        </ul>
      )
    },
    { title: 'Total', field: 'totalPedido' }
  ];


  // Define las acciones
  const actions: Action = {
    view: true
  };

  // Función para manejar la acción de "ver"
  const onView = (pedido: Pedido) => {
    navigate('/factura', { state: { pedido } });
  };
  
  return (
    <div className='container-fluid'>
      <div className="justify-content-start align-items-center mb-3">
        <h1>Buscar Facturas</h1>
      </div>

      <GenericTableRama<Pedido>
        data={facturas}
        columns={columns}
        actions={actions}
        onView={onView}
      />

    </div>
  );
};

export default FacturasTable;
