import React, { useState, useEffect } from "react";
import { IPedidoDto } from "../../interface/IPedido";
import { IAction, IColumn } from "../../interface/ICamposTablaGenerica";
import GenericTable from "../GenericTable/GenericTable";
import { Col, Container, Row } from "react-bootstrap";
import Spinner from "../Spinner/Spinner";
import { IDetallePedidoDto } from "../../interface/IDetallePedido";
import { IProductoDto } from "../../interface/IProducto";
import axios from "axios";
import GenerarFacturaModal from "./GenerarFacturaModal";

const Factura = () => {
  const [facturas, setFacturas] = useState<IPedidoDto[]>();
  const [selectedPedido, setSelectedPedido] = useState<IPedidoDto>();
  const API_URL = process.env.REACT_APP_API_URL || "";
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const facturasResponse = await axios.get(`${API_URL}pedido`);
        const facturasData = facturasResponse.data;
        console.log(facturasData);
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
  const columns: IColumn<IPedidoDto>[] = [
    {
      title: "Numero Factura",
      field: "numeroPedido",
      render: (facturas: IPedidoDto) => (
        <span>{facturas.numeroPedido.toString()}</span>
      ),
    },
    {
      title: "Usuario",
      field: "usuario",
      render: (facturas: IPedidoDto) => (
        <span>{facturas.usuario ? `${facturas.usuario?.apellido} ${facturas.usuario?.nombre}` : ""}</span>
      ),
    },
    {
      title: "Fecha",
      field: "fechaPedido",
      render: (facturas: IPedidoDto) => <span>{facturas.fechaPedido.toString()}</span>,
    },
    {
      title: "Total del Pedido",
      field: "fechaPedido",
      render: (facturas: IPedidoDto) => (
        <div>{calcularTotalPedido(facturas)}</div>
      ),
      width: 2
    },
  ];

  // Función para calcular el total del pedido
  const calcularTotalPedido = (facturas: IPedidoDto) => {
    let totalPedido = 0;

    if (facturas && facturas.detallesPedidos) {
      facturas?.detallesPedidos.forEach((detalle: IDetallePedidoDto) => {
        const producto: IProductoDto = detalle.producto;
        totalPedido += producto?.precio * detalle?.cantidad;
      });
    }

    return totalPedido;
  };

  // Define las acciones disponibles para cada fila de la tabla
  const actions: IAction = {
    view: true, // Acción de ver detalles
  };

  const onView = (factura: IPedidoDto) => {
    if (factura) {
      setSelectedPedido(factura);
      console.log(factura)
      setShowModal(false); // Muestra el modal de GenerarFacturaModal
      // Abre una nueva ventana con la ruta adecuada
      window.open(`/factura/${factura.numeroPedido}`, "_blank");
    }
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
            <GenericTable<IPedidoDto>
              data={facturas}
              columns={columns}
              actions={actions}
              onView={onView}
              showDate={true}
            />
          </Col>
        </Row>
      </Container>
      {showModal &&(
      <GenerarFacturaModal
        closeModal={() => setShowModal(false)}
        factura={selectedPedido}  // Pasa la factura seleccionada como prop
        />)}
    </div>
  );
};

export default Factura;