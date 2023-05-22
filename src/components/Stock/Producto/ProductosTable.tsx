import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import EditProductoModal from './EditProductoModal';
import AddProductoModal from './AddProductoModal';
import { Producto } from '../../../interface/interfaces';
import { TablaGeneric} from '../../TableGeneric/TableGeneric';
import SearchBar from '../../Buscador/Buscador';

interface ProductosTableProps { }

const ProductosTable: React.FC<ProductosTableProps> = () => {
  const [editModalShow, setEditModalShow] = useState(false);
  const [addModalShow, setAddModalShow] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null);
  const [produc, setProduc] = useState<Producto[]>([]);
  const [producComplete, setProducComplete] = useState<Producto[]>([]);

  useEffect(() => {
    

    const fetchData = async () => {
      try {
        const response = await fetch("/assets/data/productosEjemplo.json");
        const responseData = await response.json();
        setProduc(responseData);
        setProducComplete(responseData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const filter = (searchParam: string) => {
    const searchResult = producComplete.filter((productVal: Producto) => {
      if (
        productVal.id.toString().toLowerCase().includes(searchParam.toLowerCase()) ||
        productVal.nombre.toString().toLowerCase().includes(searchParam.toLowerCase()) ||
        productVal.rubro?.toString().toLowerCase().includes(searchParam.toLowerCase())
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


  const handleEditModalOpen = (rowData: string[],e:React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setSelectedProducto({
      id:+rowData[0],
      nombre:rowData[1],
      rubro:rowData[2],
      tiempo:+rowData[3],
      precio:+rowData[4],
      });
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

  const handleProductoEdit = async (producto: Producto) => {
    try {
      const response = await fetch(`${"/assets/data/productosEjemplo.json"}/${producto.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(producto),
      });
      const updatedProducto = await response.json();

      const newData = [...produc];
      const index = newData.findIndex((item) => item.id === producto.id);
      newData[index] = updatedProducto;

      setProduc(newData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleProductoAdd = async (producto: Producto) => {
    try {
      const response = await fetch("/assets/data/productosEjemplo.json", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(producto),
      });
      const newProducto = await response.json();

      setProduc([...produc, newProducto]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleProductoDelete = async (rowData: string[], e:React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const producto:Producto={
      id:+rowData[0],
      nombre:rowData[1],
      rubro:rowData[2],
      tiempo:+rowData[3],
      precio:+rowData[4],
      }
    try {
      await fetch(`${"/assets/data/productosEjemplo.json"}/${producto.id}`, {
        method: 'DELETE',
      });

      setProduc(produc.filter((item) => item.id !== producto.id));
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {label:"Id", width:10},
    { label: "Nombre", width: 150 },
    { label: "Rubro", width: 100 },
    { label: "Tiempo (min)", width: 60 },
    { label: "Precio", width: 50 }
  ];

  const data = produc.map((item) => [
    item.id.toString(),
    item.nombre.toString(),
    item.rubro.toString(),
    item.tiempo.toString(),
    item.precio.toString()
  ]);
  return (
    <Container>
      <Row className="justify-content-start align-items-center mb-3">
        <Col sm={10}>
          <h1>Buscar Productos</h1>
          <SearchBar onSearch={handleSearch} />
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
        <TablaGeneric columns={columns} data={data}  buttonEdit={handleEditModalOpen} buttonDelete={handleProductoDelete} showButton={true}/>
      </Row>
      <EditProductoModal
        show={editModalShow}
        handleClose={handleEditModalClose}
        handleProductoEdit={handleProductoEdit}
        selectedProducto={selectedProducto}
      />
      <AddProductoModal
        show={addModalShow}
        handleClose={handleAddModalClose}
        handleProductoAdd={handleProductoAdd}
      />
    </Container>
  );
};

export default ProductosTable;