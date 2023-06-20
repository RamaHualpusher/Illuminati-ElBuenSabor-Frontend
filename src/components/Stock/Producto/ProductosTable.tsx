import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { handleRequest } from "../../FuncionRequest/FuncionRequest";
import { TablaGeneric } from "../../TableGeneric/TableGeneric";
import Buscador from "../../Buscador/Buscador";
import EditProductoModal from "./EditProductoModal";
import AddProductoModal from "./AddProductoModal";
import { Producto } from "../../../interface/Producto";

interface ProductosTableProps {}

const ProductosTable: React.FC<ProductosTableProps> = () => {
  const [editModalShow, setEditModalShow] = useState(false);
  const [addModalShow, setAddModalShow] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [productosComplete, setProductosComplete] = useState<Producto[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseData = await handleRequest("GET", "assets/data/productosLanding.json");
        setProductos(responseData);
        setProductosComplete(responseData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const filter = (searchParam: string) => {
    const searchResult = productosComplete.filter((productVal: Producto) => {
      if (
        productVal.idProducto.toString().toLowerCase().includes(searchParam.toLowerCase()) ||
        productVal.nombre.toString().toLowerCase().includes(searchParam.toLowerCase()) ||
        productVal.Rubro.nombre?.toString().toLowerCase().includes(searchParam.toLowerCase())
      ) {
        return productVal;
      }
      return null;
    });
    setProductos(searchResult);
  };

  const handleSearch = (searchParam: string) => {
    filter(searchParam);
  };

  const getProducto = (id: number) => {
    let i: number = 0;
    let x: boolean = true;
    while (x) {
      if (productosComplete[i].idProducto === id) {
        return productosComplete[i];
      }
      i = i + 1;
    }
    return productosComplete[0];
  };

  const handleEditModalOpen = (rowData: string[], e: React.MouseEvent<HTMLButtonElement>) => {
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

  const handleProductoEdit = async (producto: Producto) => {
    try {
      const updatedProducto: Producto = await handleRequest(
        "PUT",
        `assets/data/productosLanding.json/${producto.idProducto}`,
        producto
      );

      const newData = [...productos];
      const index = newData.findIndex((item) => item.idProducto === producto.idProducto);
      newData[index] = updatedProducto;

      setProductos(newData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleProductoAdd = async (producto: Producto) => {
    try {
      const newProducto = await handleRequest("POST", "assets/data/productosLanding.json", producto);

      setProductos([...productos, newProducto]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleProductoDelete = async (rowData: string[], e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const id: number = +rowData[0];

    try {
      await handleRequest("DELETE", `assets/data/productosLanding.json/${id}`);

      const updatedData = productos.filter((item) => item.idProducto !== id);

      setProductos(updatedData);
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    { label: "ID", width: 100 },
    { label: "Nombre", width: 200 },
    { label: "Rubro", width: 150 },
    { label: "Precio", width: 150 },
    { label: "Acciones", width: 150 },
  ];

  const data = productos.map((item) => [
    item.idProducto.toString(),
    item.nombre.toString(),
    item.Rubro.nombre?.toString(),
    item.precio.toString(),
    // <>
    //   <Button
    //     variant="primary"
    //     className="mr-2"
    //     onClick={(e) => handleEditModalOpen(item, e)}
    //   >
    //     Editar
    //   </Button>
    //   <Button variant="danger" onClick={(e) => handleProductoDelete(item, e)}>
    //     Eliminar
    //   </Button>
    // </>,
  ]);

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <h2>Tabla de Productos</h2>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col>
          <Buscador onSearch={handleSearch} />
        </Col>
        <Col className="text-end">
          <Button variant="primary" onClick={handleAddModalOpen}>
            Agregar Producto
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <TablaGeneric columns={columns} data={data} showButton={true} buttonAdd={handleAddModalOpen}
                            buttonEdit={handleEditModalOpen} buttonDelete={handleProductoDelete} />
        </Col>
      </Row>
      <AddProductoModal
        show={addModalShow}
        handleClose={handleAddModalClose}
        handleProductoAdd={handleProductoAdd}
      />
      <EditProductoModal
        show={editModalShow}
        handleClose={handleEditModalClose}        
        handleProductoEdit={handleProductoEdit}
        selectedProducto={selectedProducto}
      />
      
    </Container>
  );
};

export default ProductosTable;
