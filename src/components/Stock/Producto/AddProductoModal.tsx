import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Col, Row } from "react-bootstrap";
import axios from "axios";
import { IProducto } from "../../../interface/IProducto";
import { IRubro } from "../../../interface/IRubro";
import { IAddProductoModalProps } from "../../../interface/IProducto";
import { IIngredientes } from "../../../interface/IIngredientes";
import { IProductoIngrediente } from "../../../interface/IProductoIngrediente";
import GenericTable from "../../GenericTable/GenericTable";

const AddProductoModal: React.FC<IAddProductoModalProps> = ({
  show,
  handleClose,
  handleProductoAdd,
}) => {
  // Función para inicializar los atributos de la interfaz Producto
  const initializeProduct = (): IProducto => {
    return {
      id: 0,
      nombre: "",
      tiempoEstimadoCocina: 0,
      denominacion: "",
      imagen: "",
      stockMinimo: 0,
      stockActual: 0,
      preparacion: "",
      precio: 0,
      esBebida: false,
      activo: true,
      rubro: { id: 0, nombre: "", activo: true },
      productoIngrediente: [],
    };
  };

  const [product, setProduct] = useState<IProducto>(initializeProduct);
  const [rubros, setRubros] = useState<IRubro[]>([]);
  const [ingredientesA, setIngredientesA] = useState<IIngredientes[]>([]);
  const [ingredienteA, setIngredienteA] = useState<IIngredientes | null>(null);
  const [cantIngrediente, setCantIngrediente] = useState<number>(0);
  const [ingrediente, setIngrediente] = useState<IProductoIngrediente | null>(null);
  const [costo, setCosto] = useState<number>(0);
  const API_URL = process.env.REACT_APP_API_URL || "";
  const [selectedIngredients, setSelectedIngredients] = useState<IProductoIngrediente[]>([]);

  // Cargar rubros y productos al montar el componente
  useEffect(() => {
    axios
      .get<IRubro[]>(API_URL + "rubro")
      .then((response) => {
        setRubros(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    fetch(API_URL + "ingrediente")
      .then((response) => response.json())
      .then((data: IIngredientes[]) => {
        setIngredientesA(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // Función para seleccionar un ingrediente a agregar
  const selectIngredienteA = (id: number) => {
    if (id !== 0) {
      const selectedIngrediente = ingredientesA.find((ingr) => ingr.id === id);
      setIngredienteA(selectedIngrediente || null);
    } else {
      setIngredienteA(null);
    }
  }

  // Agregar un ingrediente a la lista de ingredientes del producto
  const agregarIngrediente = () => {
    if (ingredienteA && cantIngrediente > 0) {
      let encontrado = false;
      const updatedProduct = { ...product };

      updatedProduct.productoIngrediente = updatedProduct.productoIngrediente || [];

      updatedProduct.productoIngrediente = updatedProduct.productoIngrediente.map((ingr) => {
        if (ingr.ingredientes.id === ingredienteA.id) {
          ingr.cantidad += cantIngrediente;
          encontrado = true;
        }
        return ingr;
      });

      if (!encontrado) {
        const newProductIngrediente: IProductoIngrediente = {
          cantidad: cantIngrediente,
          id: 0,
          ingredientes: ingredienteA,
        };

        updatedProduct.productoIngrediente.push(newProductIngrediente);
      }

      setProduct(updatedProduct);
      setCosto((prevCosto) => prevCosto + cantIngrediente * ingredienteA.precioCosto);
      setCantIngrediente(0);
      setSelectedIngredients(updatedProduct.productoIngrediente || []);
    }
  };

  // Función para seleccionar un ingrediente existente
  const selectIngrediente = (id: number) => {
    if (id !== 0) {
      const selectedIngrediente = product.productoIngrediente?.find((ingr) => ingr.ingredientes.id === id);
      if (selectedIngrediente) {
        setCosto(costo - (selectedIngrediente.cantidad * selectedIngrediente.ingredientes.precioCosto));
        setIngrediente(selectedIngrediente);
        setCantIngrediente(selectedIngrediente.cantidad);
      }
    } else {
      setIngrediente(null);
      setCantIngrediente(0);
    }
  }

  // Manejar cambio en la cantidad de un ingrediente
  const handleCantidad = (cant: number) => {
    if (ingrediente) {
      if (cant > cantIngrediente) {
        setCosto(costo + ((cant - cantIngrediente) * ingrediente.ingredientes.precioCosto));
      } else {
        setCosto(costo - ((cantIngrediente - cant) * ingrediente.ingredientes.precioCosto));
      }
      setCantIngrediente(cant);

      // Actualizar la cantidad del ingrediente en la lista del producto
      const updatedProduct = { ...product };
      updatedProduct.productoIngrediente = updatedProduct.productoIngrediente || [];
      updatedProduct.productoIngrediente = updatedProduct.productoIngrediente.map((ingr) => {
        if (ingr.ingredientes.id === ingrediente.ingredientes.id) {
          ingr.cantidad = cant;
        }
        return ingr;
      });

      setProduct(updatedProduct);
    }
  }

  // Eliminar un ingrediente seleccionado
  const handleDeleteIngrediente = () => {
    if (ingrediente) {
      setCosto(costo - (ingrediente.cantidad * ingrediente.ingredientes.precioCosto));

      // Filtrar el ingrediente de la lista del producto
      const updatedProduct = { ...product };
      updatedProduct.productoIngrediente = updatedProduct.productoIngrediente || [];
      updatedProduct.productoIngrediente = updatedProduct.productoIngrediente.filter((ingr) => ingr.ingredientes.nombre !== ingrediente.ingredientes.nombre);
      setProduct(updatedProduct);

      setIngrediente(null);
      setCantIngrediente(0);
    }
  }

  // Manejar el envío del formulario de agregar producto
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (product.productoIngrediente && product.productoIngrediente.length > 0) {
      console.log(product);
      handleProductoAdd(product);
      handleCancelar();
    }
  };

  // Actualizamos selectedIngredients cada vez que cambia product.productoIngrediente
  useEffect(() => {
    setSelectedIngredients(product.productoIngrediente || []);
  }, [product.productoIngrediente]);

  const handleCancelar = () => {
    setProduct(initializeProduct);
    setCantIngrediente(0);
    setCosto(0);
    setIngrediente(null);
    setIngredienteA(null);
    handleClose();
  }

  return (
    <Modal show={show} onHide={handleClose} dialogClassName="modal-lg">
      {/* Estructura del modal */}
      <Modal.Header closeButton>
        <Modal.Title>Agregar Producto</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3" controlId="formNombre">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingrese un nombre"
                  value={product.nombre}
                  onChange={(event) => setProduct({ ...product, nombre: event.target.value })}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3" controlId="formImagen">
                <Form.Label>Imagen</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingrese URL de la imagen"
                  value={product.imagen}
                  onChange={(event) => setProduct({ ...product, imagen: event.target.value })}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group className="mb-3" controlId="formEstado">
                <Form.Label>Estado</Form.Label>
                <Form.Select
                  value={product.activo ? 'alta' : 'baja'}
                  onChange={(event) =>
                    setProduct({ ...product, activo: event.target.value === 'alta' ? true : false })
                  }
                  required
                >
                  <option value="alta">Alta</option>
                  <option value="baja">Baja</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group className="mb-3" controlId="formEstado">
                <Form.Label>Es Bebida</Form.Label>
                <Form.Check
                  type="switch"
                  id="esBebidaSwitch"
                  label={product.esBebida ? 'Sí' : 'No'}
                  checked={product.esBebida}
                  onChange={() => setProduct({ ...product, esBebida: !product.esBebida })}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formDenominacion">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  placeholder="Ingrese una descripción"
                  value={product.denominacion}
                  onChange={(event) => setProduct({ ...product, denominacion: event.target.value })}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formPreparacion">
                <Form.Label>Receta</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  placeholder="Ingrese una receta"
                  value={product.preparacion}
                  onChange={(event) => setProduct({ ...product, preparacion: event.target.value })}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3 mt-4" controlId="formRubro">
                <Form.Label>Rubro</Form.Label>
                <Form.Select
                  onChange={(event) => {
                    const rubroId = parseInt(event.target.value);
                    const selectedRubro = rubros.find((rubro) => rubro.id === rubroId);
                    if (selectedRubro) {
                      setProduct({ ...product, rubro: selectedRubro });
                    }
                  }}
                  required
                >
                  <option value="">Seleccione un rubro</option>
                  {rubros.map((rubro) => (
                    <option key={rubro.id} value={rubro.id} disabled={!rubro.activo}>
                      {rubro.nombre}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group className="mb-3" controlId="formTiempo">
                <Form.Label>Tiempo en cocina</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Ingrese tiempo"
                  value={product.tiempoEstimadoCocina}
                  onChange={(event) => setProduct({ ...product, tiempoEstimadoCocina: parseInt(event.target.value) })}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group className="mb-3 mt-4" controlId="formPrecio">
                <Form.Label>Precio</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Ingrese precio"
                  value={product.precio}
                  onChange={(event) => setProduct({ ...product, precio: parseFloat(event.target.value) })}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group className="mb-3 mt-4" controlId="formStockMin">
                <Form.Label>Stock Mínimo</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Ingrese stock"
                  value={product.stockMinimo}
                  onChange={(event) => setProduct({ ...product, stockMinimo: parseFloat(event.target.value) })}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group className="mb-3 mt-4" controlId="formStockAct">
                <Form.Label>Stock Actual</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Ingrese stock"
                  value={product.stockActual}
                  onChange={(event) => setProduct({ ...product, stockActual: parseFloat(event.target.value) })}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formModIngrediente">
                <Form.Label>Modificar Ingredientes</Form.Label>
                <Form.Select
                  value={ingrediente?.ingredientes.id || 0}
                  onChange={(event) => selectIngrediente(parseInt(event.target.value))}
                  required
                >
                  <option value="none">Eliminar Ingrediente</option>
                  {product.productoIngrediente?.map((IIngrediente) => (
                    <option value={IIngrediente.ingredientes.id} key={IIngrediente.id}>
                      {IIngrediente.ingredientes.nombre}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control
                  type="number"
                  placeholder="Ingrese Cantidad"
                  value={cantIngrediente}
                  onChange={(event) => handleCantidad(parseInt(event.target.value))}
                  required
                />
                <Button
                  variant="danger"
                  onClick={() => handleDeleteIngrediente()}
                >
                  Eliminar Ingrediente
                </Button>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formModIngrediente">
                <Form.Label>Agregar Ingredientes</Form.Label>
                <Form.Select
                  value={ingredienteA?.id || 0}
                  onChange={(event) => selectIngredienteA(parseInt(event.target.value))}
                  required
                >
                  <option value="none">Agregar Ingrediente</option>
                  {ingredientesA.map((Ingrediente) => (
                    <option value={Ingrediente.id} key={Ingrediente.id}>
                      {Ingrediente.nombre}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control
                  type="number"
                  placeholder="Ingrese Cantidad"
                  value={cantIngrediente}
                  onChange={(event) => setCantIngrediente(parseInt(event.target.value))}
                  required
                />
                <Button
                  variant="success"
                  onClick={() => agregarIngrediente()}
                >
                  Agregar Ingrediente
                </Button>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <h3>Ingredientes Seleccionados</h3>
              <GenericTable<IProductoIngrediente>
                data={selectedIngredients}
                columns={[
                  {
                    title: 'Ingrediente',
                    field: 'ingredientes',
                    render: (ingrediente) => <span>{ingrediente.ingredientes.nombre}</span>,
                  },
                  { title: 'Cantidad', field: 'cantidad' },
                  // Puedes agregar más columnas según sea necesario
                ]}
                actions={{ delete: false, update: false, view: false, create: false }}
              />
            </Col>
          </Row>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelar}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            Agregar
          </Button>
        </Modal.Footer>
      </Form>
    </Modal >
  );
};

export default AddProductoModal;