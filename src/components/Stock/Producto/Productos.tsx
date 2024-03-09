import React, { useState, useEffect } from "react";
import { Container, Row, Form } from "react-bootstrap";
import { handleRequest } from "../../FuncionRequest/FuncionRequest";
import EditProductoModal from "./EditProductoModal";
import AddProductoModal from "./AddProductoModal";
import { IProducto } from "../../../interface/IProducto";
import { IAction, IColumn } from "../../../interface/ICamposTablaGenerica";
import GenericTable from "../../GenericTable/GenericTable";
import { IRubro } from "../../../interface/IRubro";
import axios from "axios";
const Productos: React.FC = () => {
  // Estados del componente
  const [editModalShow, setEditModalShow] = useState(false);
  const [addModalShow, setAddModalShow] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState<IProducto | null>(null);
  const [productos, setProductos] = useState<IProducto[]>([]);
  const [productosComplete, setProductosComplete] = useState<IProducto[]>([]);
  const [rubros, setRubros] = useState<IRubro[]>([]);
  const [selectedRubro, setSelectedRubro] = useState<number | null>(null);
  const [selectedRubroName, setSelectedRubroName] = useState<string>("");
  const [filteredProductos, setFilteredProductos] = useState<IProducto[]>([]);
  const API_URL = process.env.REACT_APP_API_URL || "";

  // Configuración de acciones y columnas para la tabla
  const actions: IAction = {
    create: true,
    update: true,
  };

  const columns: IColumn<IProducto>[] = [
    // Definición de las columnas
    {
      title: "ID", field: "id"

    },
    { title: "Nombre", field: "nombre" },
    {
      title: "Imagen", field: "imagen", width: 2,
      render: (rowData) => <img src={rowData.imagen} alt="Producto" style={{ width: "150px", height: "100px" }} />
    },
    {
      title: "Rubro",
      field: "rubro",
      render: (producto: IProducto) => <span>{`${producto.rubro.nombre}`}</span>,
    },
    { title: "Tiempo en Cocina", field: "tiempoEstimadoCocina" },
    { title: "Precio", field: "precio" },
    {
      title: "Estado",
      field: "activo",
      render: (producto: IProducto) => (
        <span className={`${producto.activo ? "text-success" : "text-danger"}`}>
          {producto.activo ? <h2><i className="bi bi-unlock-fill "></i></h2> : <h2><i className="bi bi-lock-fill"></i></h2>}
        </span>
      ),
    },
  ];

  // Filtrar productos según el rubro seleccionado
  useEffect(() => {
    const filterProductos = () => {
      console.log("selectedRubro", selectedRubro);
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

  // Cargar productos y rubros al montar el componente
  useEffect(() => {
    const fetchProductos = async () => {
      console.log(API_URL);
      try {
        const responseData = await axios.get(API_URL+"producto");
        setProductos(responseData.data);
        setFilteredProductos(responseData.data);
        setProductosComplete(responseData.data);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchRubros = async () => {
      try {
        const responseData = await axios.get(API_URL+"rubro");
        setRubros(responseData.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProductos();
    fetchRubros();
  }, []);

  if (!productos || !rubros || productos.length === 0 || rubros.length === 0) {
    return <p>Cargando... </p>;
  }

  // Agregar un producto
  const handleProductoAdd = async (producto: IProducto) => {
    try {
      if (producto) {
        const updatedProducto = {
          ...producto,
        };
        const responseProducto = await axios.post(`${API_URL}producto`, updatedProducto);
        if (responseProducto.data) {
          setProductos([...productos, responseProducto.data]);
          setFilteredProductos([...productos, responseProducto.data]);
          setProductosComplete([...productos, responseProducto.data]);
          console.log("Producto agregado exitosamente" + productos);
        } else {
          console.log("no se pudo agregar el producto");
        }
      } else {
        console.log("no se pudo agregar producto");
      }

    } catch (error) {
      console.log(error);
    }
  };

  // Editar un producto
  const handleProductoEdit = async (producto: IProducto) => {
    try {
        const updatedProducto={
          ...producto,
        }


      const responseProducto=await axios.put(`${API_URL}+producto`,updatedProducto);
      if(responseProducto.data){
        const newData=productos.map((item)=>
          item.id===producto.id ? responseProducto.data : item
        )
        setProductos(newData);
        setProductos(newData)
      }

    } catch (error) {
      console.log(error);
    }
  };

  // Eliminar un producto
  const handleProductoDelete = async (
    rowData: string[],
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    const productoId: number = +rowData[0];
    try {
      await handleRequest("DELETE", `${API_URL + "producto"}/${productoId}`);
      const updatedProductos = productos.filter((p) => p.id !== productoId);
      setProductos(updatedProductos);
    } catch (error) {
      console.log(error);
    }
  };

  // Abrir modal de edición
  const handleEditModalOpen = (item: IProducto) => {
    const selected = productosComplete.find((producto) => producto.id === item.id);
    if (selected) {
      setSelectedProducto(selected);
      setEditModalShow(true);
    }
  };

  // Cerrar modal de edición
  const handleEditModalClose = () => {
    setSelectedProducto(null);
    setEditModalShow(false);
  };

  // Abrir modal de agregar
  const handleAddModalOpen = () => {
    setAddModalShow(true);
  };

  // Cerrar modal de agregar
  const handleAddModalClose = () => {
    setAddModalShow(false);
  };

  // Manejar cambio de selección de rubro
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    const selectedOption = event.currentTarget.options[event.currentTarget.selectedIndex];
    const selectedRubroId = parseInt(value);
    const selectedRubro = rubros.find((rubro) => rubro.id === selectedRubroId);
    setSelectedRubro(selectedRubroId ? selectedRubroId : null);
    setSelectedRubroName(selectedOption.text);
  };

  // Mensaje de no productos disponibles
  const noProductosMessage =
    selectedRubro && filteredProductos.length === 0 ? (
      <p>No hay productos disponibles con el rubro seleccionado.</p>
    ) : null;

  return (
    <Container fluid>
      <Row>
        {/* Estructura del componente */}
        <div>
          <Form.Group controlId="id">
            <select
              className="form-select"
              name="id"
              value={selectedRubro ? selectedRubro : ""}
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
          {noProductosMessage}
          {Array.isArray(filteredProductos) && filteredProductos.length > 0 ? (
            <GenericTable
              data={filteredProductos}
              columns={columns}
              actions={actions}
              onAdd={handleAddModalOpen}
              onUpdate={handleEditModalOpen}
            />
          ) : (
            <p>No hay productos disponibles.</p>
          )}
        </div>
      </Row>
      {/* Modales de edición y agregado */}
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