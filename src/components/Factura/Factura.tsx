import React, { useState, useEffect } from "react";
import { Pedido } from "../../interface/Pedido";
import { useNavigate, useParams } from "react-router-dom";
import { Action, Column } from "../../interface/CamposTablaGenerica";
import GenericTable from "../GenericTable/GenericTable";
import { Col, Container, Row } from "react-bootstrap";
import Spinner from "../Spinner/Spinner";

const Factura = () => {
  const [facturas, setFacturas] = useState<Pedido[]>([]);
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);
  const navigate = useNavigate();
  const API_URL = "assets/data/pedidos.json";
  const params = useParams<{ pedido: string }>();

  useEffect(() => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => {
        setFacturas(data);
        const selectedPedido = data.find((pedido: Pedido) => pedido.numeroPedido.toString() === params.pedido); // Buscar el pedido correspondiente
        setSelectedPedido(selectedPedido || null);
      })
      .catch((error) => console.log(error));
  }, [params.pedido]);

  if (!facturas || facturas === null) return <Spinner />;

  // Define las columnas
  const columns: Column<Pedido>[] = [
    {
      title: "Numero Factura",
      field: "numeroPedido",
      render: (pedido: Pedido) => (
        <span>
          {pedido.numeroPedido.toString()}
        </span>
      ),
    },
    {
      title: "Usuario",
      field: "Usuario",
      render: (pedido: Pedido) => (
        <span>{`${pedido.Usuario.apellido.toString()} ${pedido.Usuario.nombre.toString()}`}</span>
      ),
    },
    {
      title: "Fecha",
      field: "fechaPedido",
      render: (pedido: Pedido) => (
        <span>{pedido.fechaPedido.toString()}</span>
      ),
    },
    {
      title: "Total",
      field: "totalPedido",
      render: (pedido: Pedido) => (
        <span>{pedido.totalPedido.toString()}</span>
      ),
    },
  ];

  // Define las acciones
  const actions: Action = {
    view: true,
  };

  // Función para manejar la acción de "ver"
  const onView = (pedido: Pedido) => {
    setSelectedPedido(pedido);
    const encodedPedido = encodeURIComponent(JSON.stringify(pedido));
    window.open(`/factura/${encodedPedido}`, "_blank");
    window.postMessage(pedido, "*");
  };


  // Función para cerrar el modal
  const closeModal = () => {
    setSelectedPedido(null);
  };

  // Función para busqueda personalizada por ID
  const customSearch = (searchText: string): Promise<Pedido[]> => {
    return new Promise((resolve) => {
      const filteredData = facturas.filter((factura) =>
        factura.numeroPedido.toString().includes(searchText)
      );
      resolve(filteredData);
    });
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
            <GenericTable<Pedido>
              data={facturas}
              columns={columns}
              actions={actions}
              onView={onView} // Utilizar la función onView para abrir el modal en una nueva pestaña
              customSearch={customSearch}
            // target="_blank"
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Factura;
