import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { TablaGeneric, buttonAction } from '../TableGeneric/TableGeneric';
import Buscador from '../Buscador/Buscador';
import { handleRequest } from '../FuncionRequest/FuncionRequest';
import EditFacturaModal from './EditFacturaModal';
import AddFacturaModal from './AddFacturaModal';
import { Pedido } from '../../interface/Pedido';

interface FacturasTableProps {}

const FacturasTable: React.FC<FacturasTableProps> = () => {
  const [editModalShow, setEditModalShow] = useState(false);
  const [addModalShow, setAddModalShow] = useState(false);
  const [selectedFactura, setSelectedFactura] = useState<Pedido | null>(null);
  const [facturas, setFacturas] = useState<Pedido[]>([]);
  const [facturasComplete, setFacturasComplete] = useState<Pedido[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseData = await handleRequest('GET', 'assets/data/pedidos.json');
        setFacturas(responseData);
        setFacturasComplete(responseData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const filter = (searchParam: string) => {
    const searchResult = facturasComplete.filter((factura: Pedido) => {
      if (
        factura.numeroPedido.toString().toLowerCase().includes(searchParam.toLowerCase()) ||
        factura.Usuario.apellido.toString().toLowerCase().includes(searchParam.toLowerCase()) ||
        factura.Usuario.nombre.toString().toLowerCase().includes(searchParam.toLowerCase()) ||
        factura.fechaPedido.toString().toLowerCase().includes(searchParam.toLowerCase())
      ) {
        return factura;
      }
      return null;
    });
    setFacturas(searchResult);
  };

  const handleSearch = (searchParam: string) => {
    filter(searchParam);
  };

  const getFactura = (id: number) => {
    let i: number = 0;
    let x: boolean = true;
    while (x) {
      if (facturasComplete[i].idPedido === id) {
        return facturasComplete[i];
      }
      i = i + 1;
    }
    return facturasComplete[0];
  };

  const handleEditModalOpen = (rowData: string[], e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setSelectedFactura(getFactura(+rowData[0]));
    setEditModalShow(true);
  };

  const handleEditModalClose = () => {
    setSelectedFactura(null);
    setEditModalShow(false);
  };

  const handleAddModalOpen = () => {
    setAddModalShow(true);
  };

  const handleAddModalClose = () => {
    setAddModalShow(false);
  };

  const handleFacturaEdit = async (factura: Pedido) => {
    try {
      const updatedFactura: Pedido = await handleRequest('PUT', `assets/data/pedidos.json/${factura.idPedido}`, factura);

      const newData = [...facturas];
      const index = newData.findIndex((item) => item.idPedido === factura.idPedido);
      newData[index] = updatedFactura;

      setFacturas(newData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFacturaAdd = async (factura: Pedido) => {
    try {
      const newFactura = await handleRequest('POST', 'assets/data/pedidos.json', factura);

      setFacturas([...facturas, newFactura]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFacturaDelete = async (rowData: string[], e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const facturaId: number = +rowData[0];
    try {
      await fetch(`assets/data/facturasLanding.json/${facturaId}`, {
        method: 'DELETE',
      });

      setFacturas(facturas.filter((item) => item.idPedido !== facturaId));
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    { label: 'Numero Factura', width: 10 },
    { label: 'Cliente', width: 150 },    
    { label: 'Detalle', width: 150 },
    { label: 'Total', width: 100 },
  ];

  const data = facturas.map((item) => [item.numeroPedido.toString(), item.Usuario.nombre.toString(), item.Usuario.apellido.toString(), item.totalPedido.toString()]);

  const buttonAddAction: buttonAction = {
    label: 'Generar',
    onClick: handleAddModalOpen,
  };

  return (
    <Container>
      <Row className="justify-content-start align-items-center mb-3">
        <Col sm={10}>
          <h1>Buscar Facturas</h1>
          <Buscador onSearch={handleSearch} />
        </Col>
      </Row>

      {/* <Row className="mb-3">
        <Col>
          <Button variant="success" onClick={handleAddModalOpen} className="float-start">
            Agregar Factura
          </Button>
        </Col>
      </Row> */}
      <Row>
        <TablaGeneric
          columns={columns}
          data={data}
          showButton={true}
          buttonAdd={handleAddModalOpen}
          buttonEdit={handleEditModalOpen}
          buttonDelete={handleFacturaDelete}
        />
      </Row>
      <EditFacturaModal
        show={editModalShow}
        handleClose={handleEditModalClose}
        handleFacturaEdit={handleFacturaEdit}
        selectedFactura={selectedFactura}
      />
      {/* <AddFacturaModal
        show={addModalShow}
        handleClose={handleAddModalClose}
        handleFacturaAdd={handleFacturaAdd}
      /> */}
    </Container>
  );
};

export default FacturasTable;
