import { cashierOrder } from '../../interface/interfaces';
import React, { useState, useEffect } from 'react'
import { Container, Row, Col} from 'react-bootstrap';
import { TablaGeneric } from '../TableGeneric/TableGeneric';
import SearchBar from '../SearchBar/SearchBar';


interface BillProps { }

const Bill: React.FC<BillProps> = () => {
  const [order, setOrder] = useState<cashierOrder[]>([]);
  const [orderComplete, setOrderComplete] = useState<cashierOrder[]>([]);

  const columns = [
    { label: "IdPedido", width: 100 },
    { label: "Forma de Entrega", width: 200 },
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

  const filter = (searchParam: string) => {
    const searchResult = orderComplete.filter((productVal: cashierOrder) => {
      if (
        productVal.IdPedido.toString().toLowerCase().includes(searchParam.toLowerCase()) ||
        productVal.FormaEntrega.toString().toLowerCase().includes(searchParam.toLowerCase()) ||
        productVal.FechaPedido?.toString().toLowerCase().includes(searchParam.toLowerCase()) ||
        productVal.FormaPago.toString().toLowerCase().includes(searchParam.toLowerCase())
      ) {
        return productVal;
      }
      return null;
    });
    setOrder(searchResult);
  };

  const handleSearch = (searchParam: string) => {
    filter(searchParam);
  };

  const defaultAct= (data:any)=>{};

  return (
    <div>
      <Container fluid>
        <Row className='mt-3'>
          <Col sm={10}><h1>Buscar Factura</h1>
            <SearchBar onSearch={handleSearch} />
          </Col>
        </Row>
        <Row className='mt-3'>
          <Col>
            <TablaGeneric columns={columns} data={data} showButton={false} buttonEdit={defaultAct} buttonDelete={defaultAct}/>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Bill;
