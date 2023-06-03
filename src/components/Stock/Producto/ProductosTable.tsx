import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import EditProductoModal from './EditProductoModal';
import AddProductoModal from './AddProductoModal';
import { ProductoManufacturado } from '../../../interface/ProductoManufacturado';
import { TablaGeneric } from '../../TableGeneric/TableGeneric';
import Buscador from '../../Buscador/Buscador';
import { handleRequest } from '../../FuncionRequest/FuncionRequest';

interface ProductosTableProps { }

const ProductosTable: React.FC<ProductosTableProps> = () => {
  const [editModalShow, setEditModalShow] = useState(false);
  const [addModalShow, setAddModalShow] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState<ProductoManufacturado | null>(null);
  const [produc, setProduc] = useState<ProductoManufacturado[]>([]);
  const [producComplete, setProducComplete] = useState<ProductoManufacturado[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseData = await handleRequest('GET', 'assets/data/productosLanding.json');
        setProduc(responseData);
        setProducComplete(responseData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const filter = (searchParam: string) => {
    const searchResult = producComplete.filter((productVal: ProductoManufacturado) => {
      if (
        productVal.idProductoManufacturado.toString().toLowerCase().includes(searchParam.toLowerCase()) ||
        productVal.nombre.toString().toLowerCase().includes(searchParam.toLowerCase()) ||
        productVal.Rubro.nombre?.toString().toLowerCase().includes(searchParam.toLowerCase())
      ) {
        return productVal;
      }
      return null;
    });
    setProduc(searchResult);
  };

  const handleSearch = (searchParam: string) => {
    filter(searchParam);
  };

  const getProducto =(id:number)=>{
    let i:number=0;
    let x:boolean=true;
    while(x){
      if(producComplete[i].idProductoManufacturado===id){
        return producComplete[i];
      }
      i=i+1;
    }
    return producComplete[0];
  }
  

  const handleEditModalOpen = (rowData: string[],e:React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setSelectedProducto(getProducto(+rowData[0]));
    setEditModalShow(true);
  };

  const handleEditModalClose = () => {
    setSelectedProducto(null);
    setEditModalShow(false);
  };

  const handleAddModalOpen = () => {
    setAddModalShow(true);
  };

  const handleAddModalClose = () => {
    setAddModalShow(false);
  };

  const handleProductoEdit = async (producto: ProductoManufacturado) => {
    try {
      const updatedProducto = await handleRequest('PUT', `assets/data/productosLanding.json/${producto.idProductoManufacturado}`, producto);

      const newData = [...produc];
      const index = newData.findIndex((item) => item.idProductoManufacturado === producto.idProductoManufacturado);
      newData[index] = updatedProducto;

      setProduc(newData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleProductoAdd = async (producto: ProductoManufacturado) => {
    try {
      const newProducto = await handleRequest('POST', 'assets/data/productosLanding.json', producto);

      setProduc([...produc, newProducto]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleProductoDelete = async (rowData: string[], e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const productoId:number=+rowData[0]
    try {
      await fetch(`${"assets/data/productosLanding.json"}/${productoId}`, {
        method: 'DELETE',
      });

      setProduc(produc.filter((item) => item.idProductoManufacturado !== productoId));
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    { label: "Id", width: 10 },
    { label: "Nombre", width: 150 },
    { label: "Rubro", width: 100 },
    { label: "Tiempo (min)", width: 60 },
    //{ label: "Precio", width: 50 }
  ];

  const data = produc.map((item) => [
    item.idProductoManufacturado.toString(),
    item.nombre.toString(),
    item.Rubro.nombre.toString(),
    item.tiempoEstimadoCocina.toString(),
    // item.precio.toString() //aca hay que poner el precio
  ]);

  return (
    <Container>
      <Row className="justify-content-start align-items-center mb-3">
        <Col sm={10}>
          <h1>Buscar Productos</h1>
          <Buscador onSearch={handleSearch} />
        </Col>
      </Row>

      <Row className="mb-3">
        <Col>
          <Button variant="success" onClick={handleAddModalOpen} className="float-start">
            Agregar Producto
          </Button>
        </Col>
      </Row>
      <Row>
        <TablaGeneric columns={columns} data={data} showButton={true} buttonEdit={handleEditModalOpen} buttonDelete={handleProductoDelete} />
      </Row>
      <EditProductoModal
        show={editModalShow}
        handleClose={handleEditModalClose}
        handleProductoEdit={handleProductoEdit}
        selectedProducto={selectedProducto}
      /> 
      {/* <AddProductoModal
        show={addModalShow}
        handleClose={handleAddModalClose}
        handleProductoAdd={handleProductoAdd}
      /> */}
    </Container>
  );
};

export default ProductosTable;
