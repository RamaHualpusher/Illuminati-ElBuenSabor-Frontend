import React, { useState, useEffect } from 'react';
import { Pedido } from '../../interface/Pedido';
import { useNavigate } from 'react-router-dom';
import { Action, Column } from '../../interface/CamposTablaGenerica';
import GenericTableRama from '../GenericTable/GenericTableRama';
import { Col, Container, Row } from 'react-bootstrap';
import Spinner from '../Spinner/Spinner';

const Factura = () => {
  const [facturas, setFacturas] = useState<Pedido[]>([]);
  const navigate = useNavigate();

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

  if (!facturas || facturas === null) return <Spinner />;

  // Define las columnas
  const columns: Column<Pedido>[] = [
    { title: 'Numero Factura', field: 'numeroPedido' },
    {
      title: 'Usuario',
      field: 'Usuario',
      render: (pedido: Pedido) => (
        <span>{`${pedido.Usuario.apellido}, ${pedido.Usuario.nombre}`}</span>
      )
    },
    {
      title: 'Productos',
      field: 'DetallePedido',
      render: (pedido: Pedido) => (
        <ul>
          {pedido.DetallePedido.map((detalle) => (
            <li key={detalle.idDetallePedido}>{detalle.Producto.nombre}</li>
          ))}
        </ul>
      )
    },
    { title: 'Total', field: 'totalPedido' }
  ];

  // Define las acciones
  const actions: Action = {
    view: true
  };

  // Función para manejar la acción de "ver"
  const onView = (pedido: Pedido) => {
    navigate('/factura', { state: { pedido } });
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
              data={facturas}
              columns={columns}
              actions={actions}
              onView={onView}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Factura;
