import { cashierOrder } from '../../types/types';
import React, { useState } from 'react'
import BillTable from './BillTable/BillTable';
import AdminBar from '../NavBar/AdminBar';
import { Container, Row, Col, Form, InputGroup, Button, FormControl } from 'react-bootstrap';

interface BillProps {}

const Bill: React.FC<BillProps> = () => {
  const productosPrueba: cashierOrder[] = [
    {
      IdPedido: 123456,
      FechaPedido: "12/03/23/ 12:30",
      FormaEntrega: "Delivery",
      FormaPago: "Efectivo",
      Pagado: "No",
      Estado: "A Confirmar"
    }
  ]

  const [order, setOrder] = useState<cashierOrder[]>(productosPrueba);
  const [orderComplete, setOrderComplete] = useState<cashierOrder[]>(productosPrueba);
  const [search, setSearch] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    filter(e.target.value);
  };

  const filter = (serchParam: string) => {
    var serchResult = orderComplete.filter((productVal: cashierOrder) => {
      if (
        productVal.IdPedido.toString()
          .toLowerCase()
          .includes(serchParam.toLowerCase()) ||
        productVal.FechaPedido?.toString()
          .toLowerCase()
          .includes(serchParam.toLowerCase()) ||
        productVal.FormaEntrega.toString()
          .toLowerCase()
          .includes(serchParam.toLowerCase()) ||
        productVal.FormaPago.toString()
          .toLowerCase()
          .includes(serchParam.toLowerCase()) ||
        productVal.Pagado.toString()
          .toLowerCase()
          .includes(serchParam.toLowerCase()) ||
        productVal.Estado.toString()
          .toLowerCase()
          .includes(serchParam.toLowerCase())
      )
        return productVal;
    });
    setOrder(serchResult);
  };

  return (
    <div>
        <AdminBar/>
      <Container fluid>
        <Row className='mt-3'>
          <Col sm={2}>
            <Form.Select className='Select_nivelStock'>
              <option>Todos</option>
              <option>Faltante</option>
              <option>Optimo</option>
              <option>Pedir</option>
            </Form.Select>
          </Col>
          <Col sm={4}>
            <InputGroup className="mb-3">
              <FormControl
                placeholder="Busqueda"
                aria-label="Busqueda"
                aria-describedby="basic-addon2"
                value={search}
                onChange={handleChange}
              />
              <Button variant="outline-secondary" id="button-addon2">
              <i className="bi bi-search"></i>
              </Button>
            </InputGroup>
          </Col>
        </Row>
        <Row className='mt-3'>
          <Col>
            <BillTable orders={order} /> 
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Bill;
