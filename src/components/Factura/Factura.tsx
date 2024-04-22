import React, { useState, useEffect } from "react";
import { IAction, IColumn } from "../../interface/ICamposTablaGenerica";
import GenericTable from "../GenericTable/GenericTable";
import { Col, Container, Row } from "react-bootstrap";
import Spinner from "../Spinner/Spinner";
import GenerarFacturaModal from "./GenerarFacturaModal";
import { IFactura } from "../../interface/IFactura";
import axios from "axios";
import { IPedidoDto } from "../../interface/IPedido";
import { IDetallePedido } from "../../interface/IDetallePedido";

const Factura = () => {
  const [facturas, setFacturas] = useState<IFactura[]>([]);
  const [selectedFactura, setSelectedFactura] = useState<IFactura | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.REACT_APP_API_URL || "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const facturasResponse = await axios.get<IFactura[]>(
          `${API_URL}factura`
        );
        const facturasData = facturasResponse.data.filter(
          (factura: IFactura) => factura.pedido !== null
        );

        facturasData.sort(
          (a: IFactura, b: IFactura) =>
            new Date(b.pedido.fechaPedido).getDate() -
            new Date(a.fechaFactura).getDate()
        );

        setFacturas(facturasData);
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar datos factura:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Spinner />;

  // Define las columnas para la tabla de facturas
  const columns: IColumn<IFactura>[] = [
    {
      title: "Numero Factura",
      field: "id",
      width: 2,
      render: (factura: IFactura) => <span>{factura.id ?? 0}</span>,
    },
    {
      title: "Usuario",
      field: "pedido",
      width: 3,
      render: (factura: IFactura) => (
        <span>
          {factura.pedido.usuario
            ? `${factura.pedido.usuario.apellido} ${factura.pedido.usuario.nombre}`
            : ""}
        </span>
      ),
    },
    {
      title: "Fecha Pedido",
      field: "pedido",
      render: (factura: IFactura) => <span>{factura.pedido.fechaPedido}</span>,
    },
    {
      title: "Fecha Factura",
      field: "fechaFactura",
      render: (factura: IFactura) => <span>{factura.fechaFactura}</span>,
    },
    {
      title: "Total del Pedido",
      field: "pedido",
      render: (factura: IFactura) => (
        <div>{calcularTotalPedido(factura.pedido)}</div>
      ),
      width: 2,
    },
  ];

  // Función para calcular el total del pedido
  const calcularTotalPedido = (pedido: IPedidoDto) => {
    let totalPedido = 0;

    if (pedido && pedido.detallesPedidos) {
      pedido.detallesPedidos.forEach((detalle: IDetallePedido) => {
        totalPedido += detalle.cantidad * detalle.producto.precio;
      });
    }

    return totalPedido;
  };

  // Define las acciones disponibles para cada fila de la tabla
  const actions: IAction = {
    view: true, // Acción de ver detalles
  };

  const onView = (factura: IFactura) => {
    setSelectedFactura(factura);
    setShowModal(true); // Muestra el modal de GenerarFacturaModal
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
            <GenericTable<IFactura>
              data={facturas}
              columns={columns}
              actions={{
                create: false,
                update: false,
                delete: false,
                view: true,
              }}
              onView={onView}
              showDate={true}
            />
          </Col>
        </Row>
      </Container>

      {/* Modal para mostrar detalles de la factura */}
      <GenerarFacturaModal
        factura={selectedFactura}
        closeModal={() => setShowModal(false)}
        show={showModal}
      />
    </div>
  );
};

export default Factura;
