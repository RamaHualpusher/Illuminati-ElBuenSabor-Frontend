import React, { useState, useEffect } from "react";
import { IPedido } from "../../interface/IPedido";
import { IAction, IColumn } from "../../interface/ICamposTablaGenerica";
import GenericTable from "../GenericTable/GenericTable";
import { Col, Container, Row } from "react-bootstrap";
import Spinner from "../Spinner/Spinner";
import { IDetallePedido } from "../../interface/IDetallePedido";
import { IProducto } from "../../interface/IProducto";
import axios from "axios";

const Factura = () => {
  const [facturas, setFacturas] = useState<IPedido[] | null>(null);
  const [selectedPedido, setSelectedPedido] = useState<IPedido | null>(null);
  const API_URL = process.env.REACT_APP_API_URL || "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const facturasResponse = await axios.get(`${API_URL}pedido`);
        const facturasData = facturasResponse.data;
        console.log(facturasData)
        // Ordenar los pedidos por fecha de pedido de manera descendente
        facturasData.sort((a: { fechaPedido: string | number | Date; }, b: { fechaPedido: string | number | Date; }) => new Date(b.fechaPedido).getTime() - new Date(a.fechaPedido).getTime());

        setFacturas(facturasResponse.data);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }    
    };
    fetchData();
  }, []);

  if (!facturas || facturas === null) return <Spinner />;

  // Define las columnas para la tabla de facturas
  const columns: IColumn<IPedido>[] = [
    {
      title: "Numero Factura",
      field: "numeroPedido",
      render: (pedido: IPedido) => (
        <span>{pedido.numeroPedido.toString()}</span>
      ),
    },
    {
      title: "Usuario",
      field: "Usuario",
      render: (pedido: IPedido) => (
        <span>{pedido.Usuario ?`${pedido.Usuario?.apellido} ${pedido.Usuario?.nombre}`: ""}</span>
      ),
    },
    {
      title: "Fecha",
      field: "fechaPedido",
      render: (pedido: IPedido) => <span>{pedido.fechaPedido.toString()}</span>,
    },
    {
      title: "Total del Pedido",
      field: "fechaPedido",
      render: (pedido: IPedido) => (
        <div>{calcularTotalPedido(pedido.DetallePedido)}</div>
      ),
      width: 2
    },
  ];

  // Función para calcular el total del pedido
  const calcularTotalPedido = (detallePedido: IDetallePedido[]) => {
    let total = 0;
    if (detallePedido) { 
    detallePedido.forEach((detalle: IDetallePedido) => {
      if (Array.isArray(detalle.Productos)) { // Verificar si Productos es un array
        detalle.Productos.forEach((producto: IProducto) => {
          total += producto.precio || 0;
        });
      }
    });
  }
    return total;
  };


  // Define las acciones disponibles para cada fila de la tabla
  const actions: IAction = {
    view: true, // Acción de ver detalles
  };

  // Función para manejar la acción de "ver detalles"
  const onView = (pedido: IPedido) => {
    setSelectedPedido(pedido);
    const encodedPedido = encodeURIComponent(JSON.stringify(pedido));
    window.open(`/factura/${encodedPedido}`, "_blank"); // Abre una nueva ventana con los detalles del pedido
  };

  // Función para cerrar el modal de detalles
  const closeModal = () => {
    setSelectedPedido(null);
  };

  
  return (
    <div>
      <Container fluid>
        <Row className="mt-3">
          <Col sm={10}>
            <h1>Buscar Facturas</h1>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col>
            {/* Renderiza la tabla de facturas */}
            <GenericTable<IPedido>
              data={facturas}
              columns={columns}
              actions={actions}
              onView={onView}                         
              showDate={true}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Factura;