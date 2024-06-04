import React, { useState, useEffect } from "react";
import { Container, Row, Form } from "react-bootstrap";
import EditProductoModal from "./EditProductoModal";
import AddProductoModal from "./AddProductoModal";
import GenericTable from "../../GenericTable/GenericTable";
import axios from "axios";
import { IProducto } from "../../../interface/IProducto";
import { IColumn } from "../../../interface/ICamposTablaGenerica";
import { IRubroNew } from "../../../interface/IRubro";

const Productos: React.FC = () => {
  const [editModalShow, setEditModalShow] = useState(false);
  const [addModalShow, setAddModalShow] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState<IProducto | null>(null);
  const [productos, setProductos] = useState<IProducto[]>([]);
  const [productosComplete, setProductosComplete] = useState<IProducto[]>([]);
  const [rubros, setRubros] = useState<IRubroNew[]>([]);
  const [selectedRubro, setSelectedRubro] = useState<number | null>(null);
  const [selectedRubroName, setSelectedRubroName] = useState<string>("");
  const [filteredProductos, setFilteredProductos] = useState<IProducto[]>([]);
  const API_URL = process.env.REACT_APP_API_URL || "";

  // Cargar productos y rubros al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productosResponse, rubrosResponse] = await Promise.all([
          axios.get<IProducto[]>(API_URL + "producto"),
          axios.get<IRubroNew[]>(API_URL + "rubro"),
        ]);
        setProductos(productosResponse.data);
        setProductosComplete(productosResponse.data);
        setFilteredProductos(productosResponse.data);
        const filteredRubros = rubrosResponse.data.filter(rubro => !rubro.ingredientOwner);
        setRubros(filteredRubros);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  // Filtrar productos según el rubro seleccionado
  useEffect(() => {
    const filterProductos = () => {
      if (selectedRubro) {
        const filtered = productosComplete.filter(
          (producto) => producto.rubro.id === selectedRubro
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

  

  // Agregar un producto
  const handleProductoAdd = async (producto: IProducto) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}producto`, producto);
      const newProducto = response.data;
      setProductos([...productos, newProducto]);
      setProductosComplete([...productos, newProducto]);
      setFilteredProductos([...productos, newProducto]);
    } catch (error) {
      console.log(error);
    }
  };

  // Editar un producto
  const handleProductoEdit = async (producto: IProducto) => {
    console.log("Producto enviado a PUT: ", producto);
    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}producto/${producto.id}`, producto);
      const updatedProducto = response.data;
      const updatedProductos = productos.map((item) =>
        item.id === updatedProducto.id ? updatedProducto : item
      );
      setProductos(updatedProductos);
      setProductosComplete(updatedProductos);
      setFilteredProductos(updatedProductos);
    } catch (error) {
      console.log(error);
    }
  };

  // Función para cargar productos y rubros
  const fetchProductos = async () => {
    try {
      const [productosResponse, rubrosResponse] = await Promise.all([
        axios.get<IProducto[]>(API_URL + "producto"),
        axios.get<IRubroNew[]>(API_URL + "rubro"),
      ]);
      setProductos(productosResponse.data);
      setProductosComplete(productosResponse.data);
      setFilteredProductos(productosResponse.data);
      const filteredRubros = rubrosResponse.data.filter(rubro => !rubro.ingredientOwner);
      setRubros(filteredRubros);
    } catch (error) {
      console.log(error);
    }
  };

  // Manejar la eliminación del producto
  const handleProductoDelete = async (productoId: number) => {
    try {
      await axios.delete(`${API_URL}producto/${productoId}`);
      fetchProductos(); // Volver a cargar los productos desde el backend
      setEditModalShow(false); // Cerrar el modal de edición si está abierto
    } catch (error) {
      console.log(error);
    }
  };


  // Manejar la confirmación de eliminación del producto
  const handleDeleteConfirmation = (producto: IProducto) => {
    const productoId: number = producto.id || 0; // Obtener el ID del producto seleccionado
    if (window.confirm("¿Estás seguro de eliminar este producto "+producto.nombre+"?")) {
      handleProductoDelete(productoId);
    }
  };


  // Manejar cambio de selección de rubro
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    const selectedRubroId = parseInt(value);
    setSelectedRubro(selectedRubroId || null);
    setSelectedRubroName(event.currentTarget.options[event.currentTarget.selectedIndex].text);
  };

  // Calcular costo del producto
  const calcularCostoProducto = (producto: IProducto): number => {
    let costoTotal = 0;
    producto.productosIngredientes?.forEach((ingrediente) => {
      costoTotal += ingrediente.ingrediente.precioCosto * ingrediente.cantidad;
    });
    return costoTotal;
  };

  const columns: IColumn<IProducto>[] = [
    { title: "ID", field: "id" },
    { title: "Nombre", field: "nombre" },
    {
      title: "Rubro",
      field: "rubro",
      render: (producto: IProducto) => <span>{producto.rubro.nombre}</span>,
    },
    { title: "Tiempo en Cocina", field: "tiempoEstimadoCocina" },
    { title: "Precio", field: "precio" },
    {
      title: "Costo",
      field: "precio",
      render: (producto: IProducto) => <span>{calcularCostoProducto(producto)}</span>,
    },
    {
      title: "Estado",
      field: "activo",
      width: 1,
      render: (producto: IProducto) => (
        <span className={`text-${producto.activo ? "success" : "danger"}`}>
          {producto.activo ? <i className="bi bi-unlock-fill"></i> : <i className="bi bi-lock-fill"></i>}
        </span>
      ),
    },
  ];

  return (
    <Container fluid>
      <Row>
          <Form.Group controlId="id">
            <select
              className="form-select"
              name="id"
              value={selectedRubro || ""}
              onChange={handleSelectChange}
              style={{ width: "250px", margin: "10px" }}
            >
              <option value="">Todos los rubros</option>
              {rubros.map((rubro) => (
                <option key={rubro.id} value={rubro.id}>
                  {rubro.nombre}
                </option>
              ))}
            </select>
          </Form.Group>
          <GenericTable
            data={filteredProductos}
            columns={columns}
            actions={{ create: true, update: true, delete: true }}
            onAdd={() => setAddModalShow(true)}
            onUpdate={(producto) => {
              setSelectedProducto(producto);
              setEditModalShow(true);
            }}
            onDelete={(producto) => handleDeleteConfirmation(producto)}
            placeHolder="Buscar por Nombre"
          />
      </Row>
      <AddProductoModal
        show={addModalShow}
        handleClose={() => setAddModalShow(false)}
        handleProductoAdd={handleProductoAdd}
      />
      <EditProductoModal
        show={editModalShow}
        handleClose={() => setEditModalShow(false)}
        handleProductoEdit={handleProductoEdit}
        selectedProducto={selectedProducto}
      />
    </Container>
  );
};

export default Productos;
