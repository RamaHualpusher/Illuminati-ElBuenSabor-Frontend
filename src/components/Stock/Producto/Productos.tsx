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
  const [rubros, setRubros] = useState<Rubro[]>([]);
  const [selectedRubro, setSelectedRubro] = useState<number | null>(null);
  const [selectedRubroName, setSelectedRubroName] = useState<string>("");
  const [filteredProductos, setFilteredProductos] = useState<Producto[]>([]);
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
      render: (producto: Producto) => (
        <span className={`${producto.estado ? "text-success" : "text-danger"}`}>
          {producto.estado ? <h2><i className="bi bi-unlock-fill "></i></h2> : <h2><i className="bi bi-lock-fill"></i></h2>}
        </span>
      ),
    },
  ];

  useEffect(() => {
    const filterProductos = () => {
      console.log("selectedRubro", selectedRubro);
      if (selectedRubro) {
        const filtered = productosComplete.filter(
          (producto) => producto.Rubro.idRubro === selectedRubro
        );
        setFilteredProductos(filtered);
      } else {
        setFilteredProductos(productosComplete);
      }
    };

    if (productosComplete.length > 0) {
      filterProductos();
    }
  }, [selectedRubro, productosComplete]);


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


  const handleEditModalOpen = (item: Producto) => {
    const selected = productosComplete.find((producto) => producto.idProducto === item.idProducto);
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

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    const selectedOption = event.currentTarget.options[event.currentTarget.selectedIndex];
    const selectedRubroId = parseInt(value);
    const selectedRubro = rubros.find((rubro) => rubro.idRubro === selectedRubroId);
    setSelectedRubro(selectedRubroId ? selectedRubroId : null);
    setSelectedRubroName(selectedOption.text);
  };

  const noProductosMessage =
    selectedRubro && filteredProductos.length === 0 ? (
      <p>No hay productos disponibles con el rubro seleccionado.</p>
    ) : null;

  return (
    <Container fluid>
      <Row>
        <div>
          <Form.Group controlId="idrubro">
            <select
              className="form-select"
              name="idRubro"
              value={selectedRubro ? selectedRubro : ""}
              onChange={handleSelectChange}
              style={{ width: "250px", margin: "10px" }}
            >
              <option value="">Todos los rubros</option>
              {rubros.map((rubro) => (
                <option key={rubro.idRubro} value={rubro.idRubro}>
                  {rubro.nombre}
                </option>
              ))}
            </select>
          </Form.Group>

          {noProductosMessage}

          <GenericTable
            data={filteredProductos}
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