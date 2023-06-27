import React, { useState, useEffect } from "react";
import { Pedido } from "../../interface/Pedido";
import { useNavigate } from "react-router-dom";
import { Action, Column } from "../../interface/CamposTablaGenerica";
import GenericTableRama from "../GenericTable/GenericTableRama";
import { Col, Container, Row } from "react-bootstrap";
import Spinner from "../Spinner/Spinner";
import GenerarFacturaModal from "./GenerarFacturaModal";

const Factura = () => {
  const [facturas, setFacturas] = useState<Pedido[]>([]);
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);
  const [searchText, setSearchText] = useState(""); // Estado para almacenar el texto de búsqueda
  const [filteredFacturas, setFilteredFacturas] = useState<Pedido[]>(facturas); // Estado para almacenar las facturas filtradas
  
  const API_URL = "assets/data/pedidos.json";

  useEffect(() => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setFacturas(data);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    const filterFacturas = () => {
      const filteredData = facturas.filter((factura) =>
        factura.numeroPedido.toString().includes(searchText) ||
        `${factura.Usuario.apellido}, ${factura.Usuario.nombre}`.toLowerCase().includes(searchText.toLowerCase()) ||
        factura.fechaPedido.toString().includes(searchText) ||
        factura.totalPedido.toString().includes(searchText)
      );
      setFilteredFacturas(filteredData);
    };
  
    filterFacturas();
  }, [searchText, facturas]);
  

  if (!facturas || facturas === null) return <Spinner />;

  // Define las columnas
  const columns: Column<Pedido>[] = [
    {
      title: "Numero Factura",
      field: "numeroPedido",
      render: (pedido: Pedido) => (
        <span>{pedido.numeroPedido.toString()}</span>
      ),
    },
    {
      title: "Usuario",
      field: "Usuario",
      render: (pedido: Pedido) => (
        <span>{`${pedido.Usuario.apellido}, ${pedido.Usuario.nombre}`}</span>
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
  };

  // Función para cerrar el modal
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
            <GenericTableRama<Pedido>
              data={filteredFacturas}
              columns={columns}
              actions={actions}
              onView={onView}
            />
          </Col>
        </Row>
      </Container>

      {selectedPedido && (
        <GenerarFacturaModal pedido={selectedPedido} closeModal={closeModal} />
      )}
    </div>
  );
};

export default Factura;
