import React, { useEffect, useState } from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import GenericTable from '../GenericTable/GenericTable';
import { IColumn } from '../../interface/ICamposTablaGenerica';
import { exportTableDataToExcel } from '../../util/exportTableDataToExcel';
import axios from 'axios';
import { IDetallePedido, IDetallePedidoDto } from '../../interface/IDetallePedido';
import { IProducto, IProductoDto } from '../../interface/IProducto';
import { IIngredientes } from '../../interface/IIngredientes';
import { IPedidoDto } from '../../interface/IPedido';

const Movimientos = () => {

  const [pedidos, setPedidos] = useState<IPedidoDto[]>([]);  
  const API_URL = process.env.REACT_APP_API_URL || "";
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const pedidosResponse = await axios.get(`${API_URL}/pedido`);
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

  const columns: IColumn<IPedidoDto>[] = [
    { title: "Fecha de Pedido", field: "fechaPedido", width: 2 },
    { title: "Número de Pedido", field: "numeroPedido", width: 2 },
    {
      title: "Cliente",
      field: "usuario",
      render: (pedido: IPedidoDto) => {
        const usuario = pedido.usuario;
        console.log("Usuario desde la carga de columnas: "+usuario);
        return (
          <span>
            {usuario ? `${usuario.apellido} ${usuario.nombre}` : 'Usuario no disponible'}
          </span>
        );
      },
      width: 2
    },   
    {
      title: "Total del Pedido",
      field: "esEfectivo",
      render: (pedido: IPedidoDto) => {        
        return <div>{calcularTotalPedido(pedido)}</div>;
      },
      width: 2
    },
     {
       title: "Precio de Costo",
       field: "fechaPedido",
       width: 2,
       render: (pedido: IPedidoDto) => {       
         return <div>{calcularPrecioCosto(pedido)}</div>;
       },
     },
     {
       title: "Ganancia Neta",
       field: "fechaPedido",
       width: 2,
       render: (pedido: IPedidoDto) => {        
         return <div>{calcularGananciaNeta(pedido)}</div>;
       },
     },
  ];
  

  const calcularGananciaNeta = (pedido: IPedidoDto) => {
    let gananciaNeta = 0;
  
    if (pedido && pedido.detallesPedidos) {
      const totalPedido = calcularTotalPedido(pedido);
      const precioCosto = calcularPrecioCosto(pedido);
      gananciaNeta = totalPedido - precioCosto;
    }
  
    
    return gananciaNeta;
  };

  const calcularTotalPedido = (pedido: IPedidoDto) => {
    let totalPedido = 0;

    if (pedido && pedido.detallesPedidos) { // Verificar si pedido y pedido.DetallePedido están definidos
      pedido.detallesPedidos.forEach((detalle: IDetallePedidoDto) => {
        const producto: IProductoDto = detalle.producto;
        totalPedido += producto.precio * detalle.cantidad;
      });
    }

    return totalPedido;
  };

  const calcularPrecioCosto = (pedido: IPedidoDto) => {
    let costoTotalIngredientes = 0;
    
    if (pedido && pedido.detallesPedidos) {
      pedido.detallesPedidos.forEach((detalle: IDetallePedidoDto) => {
        const producto: IProductoDto = detalle.producto;
        if (producto && producto.productosIngredientes && producto.productosIngredientes.length > 0) {
          producto.productosIngredientes.forEach((pi) => {
            const ingrediente: IIngredientes = pi.ingrediente;
            const cantidadProducto = detalle.cantidad; // Obtener la cantidad del producto en el detalle del pedido
            costoTotalIngredientes += pi.cantidad * ingrediente.precioCosto * cantidadProducto; // Multiplicar por la cantidad del producto
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
              <GenericTable<IPedidoDto>
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