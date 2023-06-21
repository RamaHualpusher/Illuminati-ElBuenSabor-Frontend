import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { TablaGeneric, buttonAction } from '../TableGeneric/TableGeneric';
import Buscador from '../Buscador/Buscador';
import { handleRequest } from '../FuncionRequest/FuncionRequest';
import EditFacturaModal from './EditFacturaModal';
import GenerarFacturaModal from './GenerarFacturaModal';
import { Pedido } from '../../interface/Pedido';
import { redirect } from 'react-router-dom';

interface FacturasTableProps {}

const FacturasTable: React.FC<FacturasTableProps> = () => {
  const [editModalShow, setEditModalShow] = useState(false);
  const [addModalShow, setAddModalShow] = useState(false);
  const [generarModalShow, setGenerarModalShow] = useState(false);
  const [selectedFactura, setSelectedFactura] = useState<Pedido | null>(null);
  const [facturas, setFacturas] = useState<Pedido[]>([]);
  const [facturasComplete, setFacturasComplete] = useState<Pedido[]>([]);

  const columns = [
    { label: 'Numero Factura', width: 10 },
    { label: 'Cliente', width: 150 },    
    { label: 'Detalle', width: 150 },
    { label: 'Total', width: 100 },
  ];

  const data = facturas.map((item) => [
    item.numeroPedido?.toString() || "",
    item.Usuario?.nombre?.toString() || "",
    item.Usuario?.apellido?.toString() || "",
    ... (item.DetallePedido ? item.DetallePedido.map((detalle) => detalle.Producto.nombre) : []),
    item.totalPedido?.toString() || ""
  ]);  

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

  const handleFacturaAdd = async (factura: Pedido) => {
    try {
      const newFactura = await handleRequest('POST', 'assets/data/pedidos.json', factura);

      setFacturas([...facturas, newFactura]);
    } catch (error) {
      console.log(error);
    }
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

  const facturaRow = (id:number)=>{
    let i:number=0;
    let x:boolean=true;
    while(x){
        if(facturasComplete[i].idPedido===id){
            let facturaRe:Pedido={
                idPedido:facturasComplete[i].idPedido,
                numeroPedido:facturasComplete[i].numeroPedido,
                fechaPedido:facturasComplete[i].fechaPedido,
                horaEstimadaFin:facturasComplete[i].horaEstimadaFin,
                esDelivery:facturasComplete[i].esDelivery,
                estadoPedido:facturasComplete[i].estadoPedido,
                esEfectivo:facturasComplete[i].esEfectivo,
                Usuario:facturasComplete[i].Usuario,
                DetallePedido:facturasComplete[i].DetallePedido,
                // este no deberia ir ya que se obtiene con el back
                totalPedido:facturasComplete[i].totalPedido,
            };
            return facturaRe;
            x=false;
        }
        i=i+1;
    }
    let facturaRe:Pedido={
      idPedido:facturasComplete[i].idPedido,
                numeroPedido:facturasComplete[i].numeroPedido,
                fechaPedido:facturasComplete[i].fechaPedido,
                horaEstimadaFin:facturasComplete[i].horaEstimadaFin,
                esDelivery:facturasComplete[i].esDelivery,
                estadoPedido:facturasComplete[i].estadoPedido,
                esEfectivo:facturasComplete[i].esEfectivo,
                Usuario:facturasComplete[i].Usuario,
                DetallePedido:facturasComplete[i].DetallePedido,
                // este no deberia ir ya que se obtiene con el back
                totalPedido:facturasComplete[i].totalPedido,
    };
    return facturaRe;
}
  const handleEditModalOpen = (rowData: string[], e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setSelectedFactura(facturaRow(+rowData[0]));
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

  const handleGenerarFactura = (rowData: string[], e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setSelectedFactura(facturaRow(+rowData[0]));
    setGenerarModalShow(true);
    redirect(`/factura/${rowData[0]}`)
  };

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
          link='factura'
          buttonAdd={handleAddModalOpen }
          buttonEdit={handleEditModalOpen}
          buttonDelete={handleFacturaDelete}
        />
      </Row>
      {/* <GenerarFacturaModal
        show={addModalShow}
        handleClose={handleAddModalClose}
        handleFacturaAdd={handleFacturaAdd}
      />  */}
      <EditFacturaModal
        show={editModalShow}
        handleClose={handleEditModalClose}
        handleFacturaEdit={handleFacturaEdit}
        selectedFactura={selectedFactura}
      />
      
    </Container>
  );
};

export default FacturasTable;
