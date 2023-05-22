import { Pedido } from '../../interface/interfaces';
import React, { useState, useEffect } from 'react'
import { Container, Row, Col} from 'react-bootstrap';
import { TablaGeneric } from '../TableGeneric/TableGeneric';
import Buscador from '../Buscador/Buscador';


interface BillProps { }

const Bill: React.FC<BillProps> = () => {
  const [order, setOrder] = useState<Pedido[]>([]);
  const [orderComplete, setOrderComplete] = useState<Pedido[]>([]);

  const columns = [
    { label: "Número Factura", width: 100 },
    { label: "Tipo de Entrega", width: 200 },
    { label: "Fecha del Pedido", width: 150 },
    { label: "Tipo de Pago", width: 150 }
  ];
  const data = order.map((item) => [
    item.numeroPedido.toString(),
    item.TipoEntregaPedido.descripcion.toString(),
    item.fechaPedido?.toString(),
    item.TipoPago.descripcion.toString()
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
    const searchResult = orderComplete.filter((productVal: Pedido) => {
      if (
        productVal.numeroPedido.toString().toLowerCase().includes(searchParam.toLowerCase()) ||
        productVal.TipoEntregaPedido.descripcion.toString().toLowerCase().includes(searchParam.toLowerCase()) ||
        productVal.fechaPedido?.toString().toLowerCase().includes(searchParam.toLowerCase()) ||
        productVal.TipoPago.descripcion.toString().toLowerCase().includes(searchParam.toLowerCase())
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
            <Buscador onSearch={handleSearch} />
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
