import React, { useState, useEffect } from "react";
import { Pedido } from "../../interface/Pedido";
import { useNavigate, useParams } from "react-router-dom";
import { Action, Column } from "../../interface/CamposTablaGenerica";
import GenericTable from "../GenericTable/GenericTable";
import { Col, Container, Row } from "react-bootstrap";
import Spinner from "../Spinner/Spinner";

const Factura = () => {
  const [facturas, setFacturas] = useState<Pedido[] | null>(null);
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);
  const navigate = useNavigate();
  const API_URL = "assets/data/pedidos.json";
  const params = useParams<{ pedido: string }>();

  useEffect(() => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => {
        setFacturas(data);
        const selectedPedido = data.find(
          (pedido: Pedido) => pedido.numeroPedido.toString() === params.pedido
        ); // Buscar el pedido correspondiente
        setSelectedPedido(selectedPedido || null);
      })
      .catch((error) => {
        console.log(error);
        setFacturas([]); // Si ocurre un error, establece el estado en un array vacío en lugar de null
      });
  }, [params.pedido]);

  if (!facturas || facturas === null) return <Spinner />;

  // Define las columnas para la tabla de facturas
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
        <span>{`${pedido.Usuario.apellido} ${pedido.Usuario.nombre}`}</span>
      ),
    },
    {
      title: "Fecha",
      field: "fechaPedido",
      render: (pedido: Pedido) => <span>{pedido.fechaPedido.toString()}</span>,
    },
    {
      title: "Total",
      field: "totalPedido",
      render: (pedido: Pedido) => <span>{pedido.totalPedido.toString()}</span>,
    },
  ];

  // Define las acciones disponibles para cada fila de la tabla
  const actions: Action = {
    view: true, // Acción de ver detalles
  };

  // Función para manejar la acción de "ver detalles"
  const onView = (pedido: Pedido) => {
    setSelectedPedido(pedido);
    const encodedPedido = encodeURIComponent(JSON.stringify(pedido));
    window.open(`/factura/${encodedPedido}`, "_blank"); // Abre una nueva ventana con los detalles del pedido
  };

  // Función para cerrar el modal de detalles
  const closeModal = () => {
    setSelectedPedido(null);
  };

  // Función para búsqueda personalizada por número de factura
  const customSearch = (searchText: string): Promise<Pedido[]> => {
    return new Promise((resolve) => {
      const filteredData = facturas?.filter((factura) =>
        factura.numeroPedido.toString().includes(searchText)
      );
      resolve(filteredData);
    });
  };

  // Función para la búsqueda personalizada por número de factura
  const customDate=(firstDate:Date|null, secondDate:Date|null):Promise<Pedido[]>=>{
    return new Promise((resolve)=>{
      
      const filtrar=facturas;
      let filtrados:Pedido[]=[];
      filtrar.map((factura)=>{
        const fecha=new Date(factura.fechaPedido);
        console.log(fecha);
        if((firstDate===null || fecha>=firstDate) && (secondDate===null || fecha<= secondDate)){
          filtrados.push(factura);
        }
      })
      resolve(filtrados);
    })
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
            <GenericTable<Pedido>
              data={facturas}
              columns={columns}
              actions={actions}
              onView={onView}
              customSearch={customSearch}
              customDate={customDate}
              showDate={true}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Factura;