import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { handleRequest } from "../../FuncionRequest/FuncionRequest";
import EditProductoModal from "./EditProductoModal";
import AddProductoModal from "./AddProductoModal";
import { Producto } from "../../../interface/Producto";
import { Action, Column } from "../../../interface/CamposTablaGenerica";
import GenericTable from "../../GenericTable/GenericTable";
import { Rubro } from "../../../interface/Rubro";

const Productos: React.FC = () => {
  const [editModalShow, setEditModalShow] = useState(false);
  const [addModalShow, setAddModalShow] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [productosComplete, setProductosComplete] = useState<Producto[]>([]);
  const [rubros, setRubros] = useState<Rubro[]>([]); // Agregamos el estado para los rubros
  const [selectedRubro, setSelectedRubro] = useState<number | null>(null); // Estado para el rubro seleccionado
  const API_URL = "assets/data/productosLanding.json";
  const API_URL_Rubro = "assets/data/rubrosProductosEjemplo.json";

  const actions: Action = {
    create: true,
    update: true,
  };

  const columns: Column<Producto>[] = [
    { title: "ID", field: "idProducto" },
    { title: "Nombre", field: "nombre" },
    {
      title: "Rubro",
      field: "Rubro",
      render: (producto: Producto) => <span>{`${producto.Rubro.nombre}`}</span>,
    },
    { title: "Tiempo en Cocina", field: "tiempoEstimadoCocina" },
    { title: "Precio", field: "precio" },
    {
      title: "Estado",
      field: "estado",
      render: (producto: Producto) => <span>{producto.estado ? "Alta" : "Baja"}</span>,
    },
  ];

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const responseData = await handleRequest("GET", API_URL);
        setProductos(responseData);
        setProductosComplete(responseData);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchRubros = async () => {
      try {
        const responseData = await handleRequest("GET", API_URL_Rubro);
        setRubros(responseData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProductos();
    fetchRubros();
  }, []);

  const handleProductoAdd = async (producto: Producto) => {
    try {
      const newProducto = await handleRequest("POST", API_URL, producto);
      setProductos([...productos, newProducto]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleProductoEdit = async (producto: Producto) => {
    try {
      const updatedProducto: Producto = await handleRequest(
        "PUT",
        `${API_URL}/${producto.idProducto}`,
        producto
      );

      const updatedProductos = productos.map((p) =>
        p.idProducto === updatedProducto.idProducto ? updatedProducto : p
      );
      setProductos(updatedProductos);
    } catch (error) {
      console.log(error);
    }
  };

  const handleProductoDelete = async (
    rowData: string[],
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    const productoId: number = +rowData[0];
    try {
      await handleRequest("DELETE", `${API_URL}/${productoId}`);
      const updatedProductos = productos.filter((p) => p.idProducto !== productoId);
      setProductos(updatedProductos);
    } catch (error) {
      console.log(error);
    }
  };

  const productoRow = (id: number): Producto | undefined => {
    return productosComplete.find((producto) => producto.idProducto === id);
  };

  const handleEditModalOpen = (item: Producto) => {
    const selected = productoRow(item.idProducto);
    if (selected) {
      setSelectedProducto(selected);
      setEditModalShow(true);
    }
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

   const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    console.log(value)
    setSelectedRubro(prevRubro => prevRubro !== null ? parseInt(value) : null);
  };

  // Filtrar los productos según el rubro seleccionado
  const filteredProductos = selectedRubro
    ? productos.filter((producto) => producto.Rubro.idRubro === selectedRubro)
    : productos;

  return (
    <Container fluid>
      <Row className="justify-content-start align-items-center mb-3">
        <Col>
          <h2>Tabla de Productos</h2>
        </Col>
      </Row>
      <Row>
        <div>
          <Form.Group controlId="idrubro">
            <Form.Label>Rubro</Form.Label>
            <Form.Control
              as="select"
              name="idRubro"
              value={selectedRubro ? selectedRubro.toString() : ""}
              onChange={handleChange}
              style={{ width: "250px", margin: "10px" }}
            >
              <option value="">Todos los rubros</option>
              {rubros.map((rubro) => (
                <option key={rubro.idRubro} value={rubro.idRubro}>
                  {rubro.nombre}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <GenericTable
            data={filteredProductos}
            columns={columns}
            actions={actions}
            onAdd={handleAddModalOpen}
            onUpdate={handleEditModalOpen}
          // onDelete={handleProductoDelete}
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
