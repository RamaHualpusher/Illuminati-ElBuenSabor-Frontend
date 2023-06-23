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

  const columns = [
    { label: "ID", width: 100 },
    { label: "Nombre", width: 200 },
    { label: "Rubro", width: 150 },
    { label: "Precio", width: 150 },    
  ];
  
  const data = productos.map((item) => [
    item.idProducto?.toString() || "",
    item.nombre?.toString() || "",
    item.Rubro?.nombre?.toString() || "",
    item.precio?.toString() || ""
  ]);

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

  const handleProductoAdd = async (producto: Producto) => {
    try {
      const newProducto = await handleRequest("POST", "assets/data/productosLanding.json", producto);

      setProductos([...productos, newProducto]);
    } catch (error) {
      console.log(error);
    }
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

  const productoRow = (id:number)=>{
    let i:number=0;
    let x:boolean=true;
    while(x){
        if(productosComplete[i].idProducto===id){
            let productoRe:Producto=productosComplete[i];
            return productoRe;
            x=false;
        }
        i=i+1;
    }
    let productoRe:Producto=productosComplete[0];
    return productoRe;
}

  const handleEditModalOpen = (rowData: string[], e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setSelectedProducto(productoRow(+rowData[0]));
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


  return (
  <Container fluid>
    <Row className="justify-content-start align-items-center mb-3">
      <Col>
        <h2>Tabla de Productos</h2>
      </Col>
    </Row>
    <Row className="mb-3">
      <Col>
        <Buscador onSearch={handleSearch} />
      </Col>
    </Row>
    <Row>
      <div>
        <TablaGeneric
          columns={columns}
          data={data}
          showButton={true}
          buttonAdd={handleAddModalOpen}
          buttonEdit={handleEditModalOpen}
          buttonDelete={handleProductoDelete}
        />
      </div>
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
);};

export default ProductosTable;
