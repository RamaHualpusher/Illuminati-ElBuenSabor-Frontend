import { Pedido } from '../../interface/Pedido';
import React, { useState, useEffect } from 'react'
import { Container, Row, Col} from 'react-bootstrap';
import { TablaGeneric } from '../TableGeneric/TableGeneric';
import Buscador from '../Buscador/Buscador';

interface BillProps { }

const Bill: React.FC<BillProps> = () => {
  const [pedido, setPedido] = useState<Pedido[]>([]);
  const [pedidoComplete, setPedidoComplete] = useState<Pedido[]>([]);

  const columns = [
    { label: "Fecha del Pedido", width: 150 },
    { label: "Número Factura", width: 100 },
    { label: "Usuario", width: 150 },    
    { label: "Tipo de Entrega", width: 200 },    
    { label: "Tipo de Pago", width: 150 },
    { label: "Tipo de envio", width: 150 },    
    { label: "Monto", width: 150 },
    { label: "PDF", width: 150 }
  ];
  
  const data = pedido.map((item) => [
    item.fechaPedido?.toString(),
    item.numeroPedido.toString(),
    item.Usuario.nombre.toString(),
    item.esDelivery.toString(),
    item.esEfectivo.toString(),
    item.tipoEnvio.toString(),
    // item.monto.toString(),
    // item.pdfLink.toString()
  ]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/assets/data/dataTableFacturas.json');
      const data = await response.json();
      setPedido(data);
      setPedidoComplete(data);
    };
    fetchData();
  }, []);

  const filter = (searchParam: string) => {
    const searchResult = pedidoComplete.filter((pedido: Pedido) => {
      if (
        pedido.numeroPedido.toString().toLowerCase().includes(searchParam.toLowerCase()) ||
        pedido.esDelivery.toString().toLowerCase().includes(searchParam.toLowerCase()) ||
        pedido.fechaPedido?.toString().toLowerCase().includes(searchParam.toLowerCase()) ||
        pedido.esEfectivo.toString().toLowerCase().includes(searchParam.toLowerCase())
      ) {
        return true;
      }
      return false;
    });
    setPedido(searchResult);
  };

  const handleSearch = (searchParam: string) => {
    filter(searchParam);
  };

  const defaultAct = (data: any) => {};

  return (
    <div>
      <Container fluid>
        <Row className='mt-3'>
          <Col sm={10}>
            <h1>Buscar Factura</h1>
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
