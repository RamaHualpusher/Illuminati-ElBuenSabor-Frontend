import React, { useEffect, useState } from 'react';
import { Button, Container, Row, Col, Modal } from 'react-bootstrap';
import GenericTable from '../GenericTable/GenericTable';
import { IColumn } from '../../interface/ICamposTablaGenerica';
import { exportTableDataToExcel } from '../../util/exportTableDataToExcel';
import axios from 'axios';
import { IDetallePedido } from '../../interface/IDetallePedido';
import { IProducto } from '../../interface/IProducto';
import { IIngredientes } from '../../interface/IIngredientes';
import { IPedidoDto } from '../../interface/IPedido';
import GenerarTicket from '../Ticket/GenerarTicket';
import NoHayPedidos from '../Page404/NoHayPedidos';
import { IFactura } from '../../interface/IFactura';

const Movimientos = () => {
  const [pedidos, setPedidos] = useState<IPedidoDto[]>([]);
  const API_URL = process.env.REACT_APP_API_URL || "";
  const [selectedPedido, setSelectedPedido] = useState<IPedidoDto | null>(null);
  const [showPedidoModal, setShowPedidoModal] = useState<boolean>(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pedidosResponse = await axios.get(`${API_URL}pedido`);
        const pedidosData = pedidosResponse.data;
        console.log(pedidosData)
        // Ordenar los pedidos por fecha de pedido de manera descendente
        pedidosData.sort((a: { fechaPedido: string | number | Date; }, b: { fechaPedido: string | number | Date; }) =>
          new Date(b.fechaPedido).getDate() - new Date(a.fechaPedido).getDate());

        setPedidos(pedidosResponse.data);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    };
    fetchData();
  }, []);

  const openPedidoModal = async (pedido: IPedidoDto) => {
    setSelectedPedido(pedido);
    try {
      setShowPedidoModal(true);
    } catch (error) {
      console.error('Error al generar la factura:', error);
    }
  };

  // Función para cerrar el modal y actualizar el estado showPedidoModal
  const handleClosePedidoModal = () => {
    setShowPedidoModal(false);
  };

  const columns: IColumn<IPedidoDto>[] = [
    { title: "Fecha de Pedido", field: "fechaPedido", width: 2 },
    { title: "Número de Pedido", field: "id", width: 2 },
    {
      title: "Cliente",
      field: "usuario",
      render: (pedido: IPedidoDto) => {
        const usuario = pedido.usuario;
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
      width: 1,
      render: (pedido: IPedidoDto) => {
        return <div>{calcularPrecioCosto(pedido)}</div>;
      },
    },
    {
      title: "Ganancia Neta",
      field: "fechaPedido",
      width: 1,
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

  const calcularTotalPedido = (pedidos: IPedidoDto) => {
    let totalPedido = 0;

    if (!pedidos || !pedidos.detallesPedidos) {
      return totalPedido;
    }

    pedidos.detallesPedidos.forEach((detalle: IDetallePedido) => {
      if (!detalle || !detalle.producto || !detalle.producto.precio || !detalle.cantidad) {
        return;
      }

      totalPedido += detalle.producto.precio * detalle.cantidad;
    });

    return totalPedido;
  };

  const calcularPrecioCosto = (pedido: IPedidoDto) => {
    let costoTotalIngredientes = 0;

    if (pedido && pedido.detallesPedidos) {
      pedido.detallesPedidos.forEach((detalle: IDetallePedido) => {
        const producto: IProducto = detalle.producto;
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
                  view: true,
                }}
                showDate={true}
                onView={openPedidoModal}
              />
            ) : (
              NoHayPedidos
            )}
          </Col>
        </Row>        
          <GenerarTicket
            pedido={selectedPedido}
            closeModal={handleClosePedidoModal} // Pasar la función de manejo de estado adicional
            show={showPedidoModal}            
          />        
        <Button variant="success" onClick={() => exportDataToExcel()}>Exportar a Excel</Button>
      </Container>
    </div>
  );
};

export default Movimientos;

