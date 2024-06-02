import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Col, Row, Table } from "react-bootstrap";
import axios from "axios";
import { IProducto } from "../../../interface/IProducto";
import { IRubroNew } from "../../../interface/IRubro";
import { IAddProductoModalProps } from "../../../interface/IProducto";
import { IIngredientes } from "../../../interface/IIngredientes";
import { IProductoIngrediente } from "../../../interface/IProductoIngrediente";

const AddProductoModal: React.FC<IAddProductoModalProps> = ({
  show,
  handleClose,
  handleProductoAdd,
}) => {
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
      rubro: { id: 0, nombre: "", activo: true, ingredientOwner: true },
      productosIngredientes: [],
    };
  };
  const initializeIngredienteBebida = (): IIngredientes => {
    return {
      id: 0,
      nombre: "",
      stockMinimo: 0,
      stockActual: 0,
      precioCosto: 0,
      unidadMedida: "U",
      rubro: { id: 0, nombre: "", activo: true, ingredientOwner: true },
    };
  };

  const [product, setProduct] = useState<IProducto>(initializeProduct);
  const [rubros, setRubros] = useState<IRubroNew[]>([]);
  const [rubrosBebidas, setRubrosBebidas] = useState<IRubroNew[]>([]);
  const [IngredientesListToAddInProduct, setIngredientesListToAddInProduct] =
    useState<IIngredientes[]>([]);
  const [ingredienteToAddInProduct, setIngredienteToAddInProduct] =
    useState<IIngredientes | null>(null);
  const [cantIngredienteToAddInProduct, setCantIngredienteToAddInProduct] =
    useState<number>(0);
  const [ingredienteBebida, setIngredienteBebida] = useState<IIngredientes>(
    initializeIngredienteBebida
  );
  const [costo, setCosto] = useState<number>(0);
  const API_URL = process.env.REACT_APP_API_URL || "";
  const [selectedIngredients, setSelectedIngredients] = useState<
    IProductoIngrediente[]
  >([]); 

  useEffect(() => {
    const fetchRubros = async () => {
      try {
        const responseData = await axios.get<IRubroNew[]>(`${API_URL}rubro`);
        const allRubros = responseData.data;

        const filteredRubros = product.esBebida
          ? allRubros.filter(
              (rubro) => !rubro.ingredientOwner && rubro.rubroPadre !== null
            )
          : allRubros.filter((rubro) => !rubro.ingredientOwner);

        setRubros(filteredRubros);

        const filteredRubrosBebidas = allRubros.filter(
          (rubroBebida) =>
            rubroBebida.ingredientOwner &&
            rubroBebida.rubroPadre !== null &&
            rubroBebida.nombre.includes("Bebida")
        );

        setRubrosBebidas(filteredRubrosBebidas);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchIngredientes = async () => {
      try {
        const response = await fetch(`${API_URL}ingrediente`);
        const data: IIngredientes[] = await response.json();
        setIngredientesListToAddInProduct(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchRubros();
    fetchIngredientes();
  }, [product.esBebida]);

  const selectIngredienteToAddInProduct = (id: number) => {
    if (id !== 0) {
      const selectedIngrediente = IngredientesListToAddInProduct.find(
        (ingr) => ingr.id === id
      );
      setIngredienteToAddInProduct(selectedIngrediente || null);
      setCantIngredienteToAddInProduct(0);
    } else {
      setIngredienteToAddInProduct(null);
    }
  };

  const agregarIngrediente = () => {
    if (ingredienteToAddInProduct && cantIngredienteToAddInProduct > 0) {
      // Verificar si el ingrediente ya está presente en la lista
      const ingredienteExistente = product.productosIngredientes?.find(
        (ingr) => ingr.ingrediente.id === ingredienteToAddInProduct.id
      );

      if (ingredienteExistente) {
        // Ingrediente duplicado, mostrar mensaje o realizar alguna acción
        console.log("Este ingrediente ya está en la lista.");
      } else {
        const newProductIngrediente: IProductoIngrediente = {
          cantidad: cantIngredienteToAddInProduct,
          id: 0,
          ingrediente: ingredienteToAddInProduct,
        };

        setProduct({
          ...product,
          productosIngredientes: [
            ...(product.productosIngredientes || []),
            newProductIngrediente,
          ],
        });

        setCosto(
          costo +
            cantIngredienteToAddInProduct *
              ingredienteToAddInProduct.precioCosto
        );
        setSelectedIngredients([...selectedIngredients, newProductIngrediente]);

        // Limpiar el ingrediente seleccionado del select
        setIngredienteToAddInProduct(null);
        setCantIngredienteToAddInProduct(0);
      }
    } else {
      // La cantidad del ingrediente es 0 o no se seleccionó ningún ingrediente
      console.log("La cantidad del ingrediente debe ser mayor que 0.");
    }
  };

  const handleDeleteIngrediente = (ingrediente: IProductoIngrediente) => {
    setProduct({
      ...product,
      productosIngredientes: product.productosIngredientes?.filter(
        (ingr) => ingr.ingrediente.id !== ingrediente.ingrediente.id
      ),
    });

    setCosto(
      costo - ingrediente.cantidad * ingrediente.ingrediente.precioCosto
    );

    setSelectedIngredients(
      selectedIngredients.filter(
        (ingr) => ingr.ingrediente.id !== ingrediente.ingrediente.id
      )
    );
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (product.esBebida) {
      // Crear el ingrediente de la bebida con el mismo nombre que el producto
      const ingredienteNuevo: IIngredientes = {
        ...ingredienteBebida,
        nombre: product.nombre,
      };

      // Agregar el ingrediente a la lista de productosIngredientes
      const newProductIngrediente: IProductoIngrediente = {
        cantidad: 1,
        id: 0,
        ingrediente: ingredienteNuevo,
      };

      // Crear el producto final con la lista de ingredientes actualizada
      const finalProduct: IProducto = {
        id: product.id,
        nombre: product.nombre,
        tiempoEstimadoCocina: product.tiempoEstimadoCocina,
        denominacion: product.denominacion,
        imagen: product.imagen,
        stockMinimo: product.stockMinimo,
        stockActual: product.stockActual,
        preparacion: product.preparacion,
        precio: product.precio,
        esBebida: product.esBebida,
        activo: product.activo,
        rubro: product.rubro,
        productosIngredientes: [newProductIngrediente],
      };
      console.log(finalProduct);
      // Agregar el producto final
      handleProductoAdd(finalProduct);
    } else {
      // Agregar el producto final
      handleProductoAdd(product);
    }

    // Limpiar el estado y cerrar el modal
    handleCancelar();
  };

  const handleCancelar = () => {
    setProduct(initializeProduct);
    setCantIngredienteToAddInProduct(0);
    setCosto(0);
    setIngredienteToAddInProduct(null);
    setIngredienteToAddInProduct(null);

    // Limpiar la lista de ingredientes seleccionados al cerrar el modal
    setSelectedIngredients([]);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Agregar Producto</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formNombre">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingrese un nombre"
                  value={product.nombre}
                  onChange={(event) =>
                    setProduct({ ...product, nombre: event.target.value })
                  }
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formImagen">
                <Form.Label>Imagen</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingrese URL de la imagen"
                  value={product.imagen}
                  onChange={(event) =>
                    setProduct({ ...product, imagen: event.target.value })
                  }
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={8}>
              <Form.Group className="mb-3" controlId="formDescripcion">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  placeholder="Ingrese una descripción"
                  value={product.denominacion}
                  onChange={(event) =>
                    setProduct({ ...product, denominacion: event.target.value })
                  }
                  required
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group className="mb-3" controlId="formEstado">
                <Form.Label>Es Bebida</Form.Label>
                <Form.Check
                  type="switch"
                  id="esBebidaSwitch"
                  label={product.esBebida ? "Sí" : "No"}
                  checked={product.esBebida}
                  onChange={() =>
                    setProduct({ ...product, esBebida: !product.esBebida })
                  }
                />
              </Form.Group>
            </Col>
          </Row>
          {!product.esBebida && (
            <Row>
              <Col md={8}>
                <Form.Group className="mb-3" controlId="formPreparacion">
                  <Form.Label>Receta</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    placeholder="Ingrese una receta"
                    value={product.preparacion}
                    onChange={(event) =>
                      setProduct({
                        ...product,
                        preparacion: event.target.value,
                      })
                    }
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3" controlId="formTiempo">
                  <Form.Label>Tiempo en cocina</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Ingrese tiempo"
                    value={product.tiempoEstimadoCocina}
                    min={1}
                    onChange={(event) =>
                      setProduct({
                        ...product,
                        tiempoEstimadoCocina: parseInt(event.target.value),
                      })
                    }
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
          )}
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formRubro">
                <Form.Label>Rubro</Form.Label>
                <Form.Select
                  onChange={(event) => {
                    const rubroId = parseInt(event.target.value);
                    const selectedRubro = rubros.find(
                      (rubro) => rubro.id === rubroId
                    );
                    if (selectedRubro) {
                      setProduct({ ...product, rubro: selectedRubro });
                    }
                  }}
                  required
                >
                  <option value="">Seleccione un rubro</option>
                  {rubros.map((rubro) => (
                    <option
                      key={rubro.id}
                      value={rubro.id}
                      disabled={!rubro.activo}
                    >
                      {rubro.nombre}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formPrecio">
                <Form.Label>Precio</Form.Label>
                <div className="input-group">
                  <span className="bg-success input-group-text">
                    <b>$</b>
                  </span>
                  <Form.Control
                    type="number"
                    placeholder="Ingrese precio"
                    value={product.precio}
                    min={1}
                    onChange={(event) =>
                      setProduct({
                        ...product,
                        precio: parseFloat(event.target.value),
                      })
                    }
                    required
                  />
                </div>
              </Form.Group>
            </Col>
          </Row>
          
          {product.esBebida && (
            <>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="formRubro">
                    <Form.Label>Tipo de bebida</Form.Label>
                    <Form.Select
                      onChange={(event) => {
                        const rubroId = parseInt(event.target.value);
                        const selectedRubro = rubrosBebidas.find(
                          (rubro) => rubro.id === rubroId
                        );
                        if (selectedRubro) {
                          setIngredienteBebida({
                            ...ingredienteBebida,
                            rubro: selectedRubro,
                          });
                        }
                      }}
                      required
                    >
                      <option value="">Seleccione el tipo de bebida</option>
                      {rubrosBebidas.map((rubro) => (
                        <option
                          key={rubro.id}
                          value={rubro.id}
                          disabled={!rubro.activo}
                        >
                          {rubro.nombre}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3" controlId="formPrecioCosto">
                    <Form.Label>Precio Costo</Form.Label>
                    <div className="input-group">
                      <span className="bg-success input-group-text">
                        <b>$</b>
                      </span>
                      <Form.Control
                        type="number"
                        placeholder="Ingrese precio"
                        value={ingredienteBebida.precioCosto}
                        min={1}
                        onChange={(event) =>
                          setIngredienteBebida({
                            ...ingredienteBebida,
                            precioCosto: parseFloat(event.target.value),
                          })
                        }
                        required
                      />
                    </div>
                  </Form.Group>
                </Col>
              </Row>
            </>
          )}
          {!product.esBebida && (
            <>
              <Row className=" align-items-center">
                <Col md={3}>
                  <Form.Group
                    className="mb-3"
                    controlId="formIngredienteToAddInProduct"
                  >
                    <Form.Label>Agregar Ingredientes</Form.Label>
                    <Form.Select
                      value={ingredienteToAddInProduct?.id || 0}
                      onChange={(event) =>
                        selectIngredienteToAddInProduct(
                          parseInt(event.target.value)
                        )
                      }
                      required
                      className="mb-2"
                    >
                      <option value={0}>Agregar Ingrediente</option>
                      {IngredientesListToAddInProduct.map((Ingrediente) => (
                        <option value={Ingrediente.id} key={Ingrediente.id}>
                          {Ingrediente.nombre}
                        </option>
                      ))}
                    </Form.Select>
                    {ingredienteToAddInProduct && (
                      <div className="input-group mt-3">
                        <Form.Control
                          type="number"
                          placeholder="Ingrese Cantidad"
                          value={cantIngredienteToAddInProduct}
                          onChange={(event) =>
                            setCantIngredienteToAddInProduct(
                              parseInt(event.target.value)
                            )
                          }
                          required
                          className="mr-2"
                        />
                        <span className="input-group-text">
                          {ingredienteToAddInProduct.unidadMedida}
                        </span>
                      </div>
                    )}
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Button
                    variant="success"
                    onClick={() => agregarIngrediente()}
                  >
                    Agregar Ingrediente
                  </Button>
                </Col>
              </Row>

              <Row>
                <Col md={12}>
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Ingrediente</th>
                        <th>Cantidad</th>
                        <th>Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedIngredients.map((ingrediente, index) => (
                        <tr key={index}>
                          <td>{ingrediente.ingrediente.nombre}</td>
                          <td>
                            {ingrediente.cantidad}{" "}
                            {ingrediente.ingrediente.unidadMedida}
                          </td>
                          <td>
                            <Button
                              variant="danger"
                              onClick={() =>
                                handleDeleteIngrediente(ingrediente)
                              }
                            >
                              Eliminar
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            Agregar
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddProductoModal;
