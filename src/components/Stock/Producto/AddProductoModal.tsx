import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Col, Row } from "react-bootstrap";
import axios from "axios";
import { Producto } from "../../../interface/Producto";
import { Rubro } from "../../../interface/Rubro";
import { AddProductoModalProps } from "../../../interface/Producto";
import { Ingredientes } from "../../../interface/Ingredientes";
import { ProductoIngrediente } from "../../../interface/ProductoIngrediente";

const AddProductoModal: React.FC<AddProductoModalProps> = ({
  show,
  handleClose,
  handleProductoAdd,
}) => {
  // Función para inicializar los atributos de la interfaz Producto
  const initializeProduct = (): Producto => {
    return {
      idProducto: 0,
      nombre: "",
      tiempoEstimadoCocina: 0,
      denominacion: "",
      imagen: "",
      stockMinimo: 0,
      stockActual: 0,
      preparacion: "",
      precio: 0,
      esBebida: false,
      estado: true,
      Rubro: { idRubro: 0, nombre: "" },
      ProductoIngrediente: [],
    };
  };

  const [product, setProduct] = useState<Producto>(initializeProduct);
  const [rubros, setRubros] = useState<Rubro[]>([]);
  const [ingredientesA, setIngredientesA] = useState<Ingredientes[]>([]);
  const [ingredienteA, setIngredienteA] = useState<Ingredientes | null>(null);
  const [cantIngrediente, setCantIngrediente] = useState<number>(0);
  const [ingrediente, setIngrediente] = useState<ProductoIngrediente | null>(null);
  const [costo, setCosto] = useState<number>(0);

  // Cargar rubros y productos al montar el componente
  useEffect(() => {
    axios
      .get<Rubro[]>("/assets/data/rubrosProductosEjemplo.json")
      .then((response) => {
        setRubros(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    fetch("/assets/data/ingredientesEjemplo.json")
      .then((response) => response.json())
      .then((data: Ingredientes[]) => {
        setIngredientesA(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // Función para seleccionar un ingrediente a agregar
  const selectIngredienteA = (nombre: string) => {
    if (nombre !== "none") {
      const selectedIngrediente = ingredientesA.find((ingr) => ingr.nombre === nombre);
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

      updatedProduct.ProductoIngrediente = updatedProduct.ProductoIngrediente || [];

      updatedProduct.ProductoIngrediente = updatedProduct.ProductoIngrediente.map((ingr) => {
        if (ingr.Ingredientes.nombre === ingredienteA.nombre) {
          console.log("coincidencia encontrada " + ingr.Ingredientes.nombre + " cantidad previa " + ingr.cantidad);
          ingr.cantidad += cantIngrediente;
          setCosto(costo + (cantIngrediente * ingredienteA.precioCosto));
          console.log(ingr.cantidad);
          setCantIngrediente(0);
          encontrado = true;
        }
        return ingr;
      });

      if (!encontrado) {
        const newProductIngrediente: ProductoIngrediente = {
          cantidad: cantIngrediente,
          idProductoIngrediente: 0,
          Ingredientes: ingredienteA,
        };

        updatedProduct.ProductoIngrediente.push(newProductIngrediente);

        setCosto(costo + (cantIngrediente * ingredienteA.precioCosto));
        setCantIngrediente(0);
      }

      setProduct(updatedProduct);
    }
  }

  // Función para seleccionar un ingrediente existente
  const selectIngrediente = (nombre: string) => {
    if (nombre !== "none") {
      const selectedIngrediente = product.ProductoIngrediente?.find((ingr) => ingr.Ingredientes.nombre === nombre);
      if (selectedIngrediente) {
        setCosto(costo - (selectedIngrediente.cantidad * selectedIngrediente.Ingredientes.precioCosto));
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
        setCosto(costo + ((cant - cantIngrediente) * ingrediente.Ingredientes.precioCosto));
      } else {
        setCosto(costo - ((cantIngrediente - cant) * ingrediente.Ingredientes.precioCosto));
      }
      setCantIngrediente(cant);

      // Actualizar la cantidad del ingrediente en la lista del producto
      const updatedProduct = { ...product };
      updatedProduct.ProductoIngrediente = updatedProduct.ProductoIngrediente || [];
      updatedProduct.ProductoIngrediente = updatedProduct.ProductoIngrediente.map((ingr) => {
        if (ingr.Ingredientes.nombre === ingrediente.Ingredientes.nombre) {
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
      setCosto(costo - (ingrediente.cantidad * ingrediente.Ingredientes.precioCosto));

      // Filtrar el ingrediente de la lista del producto
      const updatedProduct = { ...product };
      updatedProduct.ProductoIngrediente = updatedProduct.ProductoIngrediente || [];
      updatedProduct.ProductoIngrediente = updatedProduct.ProductoIngrediente.filter((ingr) => ingr.Ingredientes.nombre !== ingrediente.Ingredientes.nombre);
      setProduct(updatedProduct);

      setIngrediente(null);
      setCantIngrediente(0);
    }
  }

  // Manejar el envío del formulario de agregar producto
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (product.ProductoIngrediente && product.ProductoIngrediente.length > 0) {
      handleProductoAdd(product);
      handleCancelar();
    }
  };

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
            <Col md={4}>
              <Form.Group className="mb-3" controlId="formEstado">
                <Form.Label>Estado</Form.Label>
                <Form.Select
                  value={product.estado ? 'alta' : 'baja'}
                  onChange={(event) =>
                    setProduct({ ...product, estado: event.target.value === 'alta' ? true : false })
                  }
                  required
                >
                  <option value="alta">Alta</option>
                  <option value="baja">Baja</option>
                </Form.Select>
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
              <Form.Group className="mb-3" controlId="formRubro">
                <Form.Label>Rubro</Form.Label>
                <Form.Select
                  onChange={(event) => setProduct({ ...product, Rubro: { idRubro: parseInt(event.target.value), nombre: "" } })}
                  required
                >
                  <option value="">Seleccione un rubro</option>
                  {rubros.map((rubro) => (
                    <option key={rubro.idRubro} value={rubro.idRubro} disabled={!rubro.estado}>
                      {rubro.nombre}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
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
            <Col md={4}>
              <Form.Group className="mb-3" controlId="formPrecio">
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
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formModIngrediente">
                <Form.Label>Modificar Ingredientes</Form.Label>
                <Form.Select
                  value={ingrediente?.Ingredientes.nombre || "none"}
                  onChange={(event) => selectIngrediente(event.target.value)}
                  required
                >
                  <option value="none">Eliminar Ingrediente</option>
                  {product.ProductoIngrediente?.map((Ingrediente) => (
                    <option value={Ingrediente.Ingredientes.nombre} key={Ingrediente.idProductoIngrediente}>
                      {Ingrediente.Ingredientes.nombre}
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
                  value={ingredienteA?.nombre || "none"}
                  onChange={(event) => selectIngredienteA(event.target.value)}
                  required
                >
                  <option value="none">Agregar Ingrediente</option>
                  {ingredientesA.map((Ingrediente) => (
                    <option value={Ingrediente.nombre} key={Ingrediente.idIngredientes}>
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
