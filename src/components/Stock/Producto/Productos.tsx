import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { handleRequest } from "../../FuncionRequest/FuncionRequest";
import EditProductoModal from "./EditProductoModal";
import AddProductoModal from "./AddProductoModal";
import { Producto } from "../../../interface/Producto";
import { Action, Column } from '../../../interface/CamposTablaGenerica';
import GenericTable from "../../GenericTable/GenericTable";

const Productos: React.FC = () => {
  const [editModalShow, setEditModalShow] = useState(false);
  const [addModalShow, setAddModalShow] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [productosComplete, setProductosComplete] = useState<Producto[]>([]);
  const API_URL = "assets/data/productosLanding.json";

  const actions: Action = {
    create: true,
    update: true
  };

  const columns: Column<Producto>[] = [
    { title: 'ID', field: 'idProducto' },
    { title: 'Nombre', field: 'nombre' },
    {
      title: 'Rubro', field: 'Rubro', render: (producto: Producto) =>
        <span>{`${producto.Rubro.nombre}`}</span>
    },
    { title: 'Tiempo en Cocina', field: 'tiempoEstimadoCocina' },
    { title: 'Precio', field: 'precio' },
  ];

  useEffect(() => {
    const fetch = async () => {
      try {
        const responseData = await handleRequest("GET", API_URL);
        setProductos(responseData);
        setProductosComplete(responseData);
      } catch (error) {
        console.log(error);
      }
    };
    fetch();
  }, []);

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

  const productoRow = (id: number) => {
    let i: number = 0;
    let x: boolean = true;
    while (x) {
      if (productosComplete[i].idProducto === id) {
        let productoRe: Producto = productosComplete[i];
        return productoRe; 
        x = false;
      }
      i = i + 1;
    }
    let productoRe: Producto = productosComplete[0];
    return productoRe;
  }


  const handleEditModalOpen = (item: Producto) => {
    setSelectedProducto(productoRow(item.idProducto));
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
      <Row>
        <div>
          <GenericTable
            data={productos}
            columns={columns}
            actions={actions}
            onAdd={handleAddModalOpen}
            onUpdate={handleEditModalOpen}
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
  );
};

export default Productos;
