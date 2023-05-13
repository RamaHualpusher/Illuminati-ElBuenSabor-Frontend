import { cashierOrder } from '../../interface/interfaces';
import React, { useState, useEffect } from 'react'
import { Container, Row, Col, InputGroup, Button, FormControl } from 'react-bootstrap';
import { TablaGeneric } from '../TableGeneric/TableGeneric';


interface BillProps { }

const Bill: React.FC<BillProps> = () => {
  const [order, setOrder] = useState<cashierOrder[]>([]);
  const [orderComplete, setOrderComplete] = useState<cashierOrder[]>([]);
  const [search, setSearch] = useState("");
  const columns = [
    { label: "IdPedido", width: 100 },
    { label: "FormaEntrega", width: 150 },
    { label: "FechaPedido", width: 150 },
    { label: "FormaPago", width: 150 }
  ];
  const data = order.map((item) => [
    item.IdPedido.toString(),
    item.FormaEntrega.toString(),
    item.FechaPedido?.toString(),
    item.FormaPago.toString()
  ]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/assets/data/dataTableFacturas.json');
      const data = await response.json();
      setOrder(data);
      setOrderComplete(data);
    };
    fetchData();
  }, []);

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
        productVal.FormaEntrega.toString()
          .toLowerCase()
          .includes(serchParam.toLowerCase()) ||
        productVal.FechaPedido?.toString()
          .toLowerCase()
          .includes(serchParam.toLowerCase()) ||
        productVal.FormaPago.toString()
          .toLowerCase()
          .includes(serchParam.toLowerCase())
      )
        return productVal;
    });
    setOrder(serchResult);
  };

  return (
    <div>

      <Container fluid>
        <Row className='mt-3'>
          <Col sm={10}><h1>Buscar Factura</h1>
            <InputGroup className="mb-4">
              <FormControl
                placeholder="Buscar"
                aria-label="Buscar"
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
            <TablaGeneric columns={columns} data={data} showButton={true} />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Bill;
