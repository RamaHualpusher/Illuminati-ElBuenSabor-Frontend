import React, { useEffect, useState } from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import GenericTable from '../GenericTable/GenericTable';
import { IColumn } from '../../interface/ICamposTablaGenerica';
import { IPedido } from "../../interface/IPedido";
import { exportTableDataToExcel } from '../../util/exportTableDataToExcel';
import axios from 'axios';
import { IDetallePedido } from '../../interface/IDetallePedido';
import { IProducto } from '../../interface/IProducto';
import { IIngredientes } from '../../interface/IIngredientes';

const Movimientos = () => {

  const [pedidos, setPedidos] = useState<IPedido[]>([]);  
  const API_URL = process.env.REACT_APP_API_URL || "";
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const pedidosResponse = await axios.get(`${API_URL}pedido`);
        const pedidosData = pedidosResponse.data;
        console.log(pedidosData)
        // Ordenar los pedidos por fecha de pedido de manera descendente
        pedidosData.sort((a: { fechaPedido: string | number | Date; }, b: { fechaPedido: string | number | Date; }) => 
          new Date(b.fechaPedido).getTime() - new Date(a.fechaPedido).getTime());

        setPedidos(pedidosResponse.data);        
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }    
    };
    fetchData();
  }, []);

  const columns: IColumn<IPedido>[] = [
    { title: "Fecha de Pedido", field: "fechaPedido", width: 2 },
    { title: "Número de Pedido", field: "numeroPedido", width: 2 },
    {
      title: "Cliente",
      field: "Usuario",
      render: (pedido: IPedido) => {
        const usuario= pedido.Usuario;       
        return (
          <span>            
            {usuario ? `${usuario?.apellido} ${usuario?.nombre}` : 'Usuario no disponible'}
          </span>
        );
      },
      width: 2
    },    
    {
      title: "Total del Pedido",
      field: "esEfectivo",
      render: (pedido: IPedido) => {        
        return <div>{calcularTotalPedido(pedido)}</div>;
      },
      width: 2
    },
    {
      title: "Precio de Costo",
      field: "fechaPedido",
      width: 2,
      render: (pedido: IPedido) => {       
        return <div>{calcularPrecioCosto(pedido)}</div>;
      },
    },
    {
      title: "Ganancia Neta",
      field: "fechaPedido",
      width: 2,
      render: (pedido: IPedido) => {        
        return <div>{calcularTotalPedido(pedido) - calcularGananciaNeta(pedido)}</div>;
      },
    },
  ];
  

  const calcularGananciaNeta = (pedido: IPedido) => {
    let costoTotalMovimiento = 0;

    if (pedido && pedido.DetallePedido) { // Verificar si pedido y pedido.DetallePedido están definidos
      pedido.DetallePedido.forEach((detalle: IDetallePedido) => {
        const producto: IProducto = detalle.Productos;
        if (producto.productoIngrediente && producto.productoIngrediente.length > 0) {
          producto.productoIngrediente.forEach((pi) => {
            const ingrediente: IIngredientes = pi.ingredientes;
            costoTotalMovimiento += pi.cantidad * ingrediente.precioCosto;
          });
        }
      });
    }

    const totalPedido = calcularTotalPedido(pedido);
    const gananciaNeta = totalPedido - costoTotalMovimiento;
    return gananciaNeta;
  };

  const calcularTotalPedido = (pedido: IPedido) => {
    let totalPedido = 0;

    if (pedido && pedido.DetallePedido) { // Verificar si pedido y pedido.DetallePedido están definidos
      pedido.DetallePedido.forEach((detalle: IDetallePedido) => {
        const producto: IProducto = detalle.Productos;
        totalPedido += producto.precio * detalle.cantidad;
      });
    }

    return totalPedido;
  };

  const calcularPrecioCosto = (pedido: IPedido) => {
    let costoTotalIngredientes = 0;
  
    if (pedido && pedido.DetallePedido) {
      pedido.DetallePedido.forEach((detalle: IDetallePedido) => {
        const producto: IProducto = detalle.Productos;
        if (producto.productoIngrediente && producto.productoIngrediente.length > 0) {
          producto.productoIngrediente.forEach((pi) => {
            const ingrediente: IIngredientes = pi.ingredientes;
            costoTotalIngredientes += pi.cantidad * ingrediente.precioCosto;
          });
        }
      });
    }
  
    return costoTotalIngredientes;
  };

  const exportDataToExcel = () => {
    const dataToExport = pedidos;
    const filename = "movimientos_excel";
    exportTableDataToExcel(dataToExport, filename);
  };

  return (
    <div>
      <Container fluid>
        <Row className="mt-3">
          <Col className="d-flex justify-content-center">
            {pedidos && pedidos.length > 0 ? (
              <GenericTable<IPedido>
                data={pedidos}
                columns={columns}
                actions={{
                  create: false,
                  update: false,
                  delete: false,
                  view: false,
                }}
                showDate={true}
              />
            ) : (
              <p>No hay datos de pedidos disponibles.</p>
            )}
          </Col>
        </Row>
        <Button variant="success" onClick={() => exportDataToExcel()}>Exportar a Excel</Button>
      </Container>
    </div>
  );
};

export default Movimientos;