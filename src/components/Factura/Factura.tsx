import React, { useState, useEffect } from 'react';
import { handleRequest } from '../FuncionRequest/FuncionRequest';
import { Pedido } from '../../interface/Pedido';
import { useNavigate } from 'react-router-dom';
import { Action, Column } from '../TableGeneric/CamposTablaGenerica';
import GenericTableRama from '../TableGeneric/GenericTableRama';

interface Usuario {
  idUsuario: number;
  nombre: string;
  apellido: string;
  email: string;
  clave: string;
  telefono: string;
  Domicilio: Domicilio;
  Rol: Rol;
}

interface Domicilio {
  idDomicilio: number;
  calle: string;
  numero: number;
  localidad: string;
}

interface Rol {
  idRol: number;
  nombreRol: string;
}

interface DetallePedido {
  idDetallePedido: number;
  cantidad: number;
  Pedido: object; // Deberías reemplazar 'object' por el tipo correcto
  Producto: object; // Deberías reemplazar 'object' por el tipo correcto
}
interface PedidoFactura {
  idPedido: number;
  numeroPedido: number;
  fechaPedido: string;
  horaEstimadaFin: string;
  esDelivery: boolean;
  estadoPedido: string;
  esEfectivo: boolean;
  Usuario: Usuario;
  DetallePedido: DetallePedido[];
  totalPedido: number;
}

interface FacturasTableProps {}

const FacturasTable: React.FC<FacturasTableProps> = () => {
  const [facturas, setFacturas] = useState<PedidoFactura[]>([]);
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
    const columns: Column<PedidoFactura>[] = [
      { title: 'Numero Factura', field: 'numeroPedido' },
      { title: 'Total', field: 'totalPedido' }
    ];
  

  // Define las acciones
  const actions: Action = {
    view: true
  };

  // Función para manejar la acción de "ver"
  const onView = (pedido: PedidoFactura) => {
    navigate('/factura', { state: { pedido } });
  };


  return (
    <div className='container-fluid'>
      <div className="justify-content-start align-items-center mb-3">
          <h1>Buscar Facturas</h1>
      </div>
      
      <GenericTableRama<PedidoFactura>
          data={facturas}
          columns={columns}
          actions={actions}
          onView={onView}
        />
      
    </div>
  );
};

export default FacturasTable;
