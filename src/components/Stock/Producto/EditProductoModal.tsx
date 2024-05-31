import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Col, Row, Table } from "react-bootstrap";
import { IProducto } from "../../../interface/IProducto";
import { IRubroNew } from "../../../interface/IRubro";
import { IEditProductoModalProps } from "../../../interface/IProducto";
import { IIngredientes } from "../../../interface/IIngredientes";
import { IProductoIngrediente } from "../../../interface/IProductoIngrediente";
import axios from "axios";

const EditProductoModal: React.FC<IEditProductoModalProps> = ({
  show,
  handleClose,
  handleProductoEdit,
  selectedProducto,
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

  // Estados del componente

  const [rubros, setRubros] = useState<IRubroNew[]>([]);
  const [ingredientesA, setIngredientesA] = useState<IIngredientes[]>([]);
  const [ingredienteA, setIngredienteA] = useState<IIngredientes | null>(null);
  const [cantIngrediente, setCantIngrediente] = useState<number>(0);
  const [producto, setProducto] = useState<IProducto>(initializeProduct);
  const [selectedIngredients, setSelectedIngredients] = useState<
    IProductoIngrediente[]
  >([]);
  const [ingredienteToAddInProduct, setIngredienteToAddInProduct] =
    useState<IIngredientes | null>(null);
  const [IngredientesListToAddInProduct, setIngredientesListToAddInProduct] =
    useState<IIngredientes[]>([]);
  const [ingredienteBebida, setIngredienteBebida] = useState<IIngredientes>(
    initializeIngredienteBebida
  );
  const [cantIngredienteToAddInProduct, setCantIngredienteToAddInProduct] =
    useState<number>(0);
  const [rubrosBebidas, setRubrosBebidas] = useState<IRubroNew[]>([]);
  const [costo, setCosto] = useState<number>(0);
  const API_URL = process.env.REACT_APP_API_URL || "";

  useEffect(() => {
    const fetchRubros = async () => {
      try {
        const responseData = await axios.get<IRubroNew[]>(`${API_URL}rubro`);
        const allRubros = responseData.data;

        const filteredRubros = producto.esBebida
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
  }, [producto.esBebida]);

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

  useEffect(() => {
    if (selectedProducto) {
      setProducto({
        ...selectedProducto,
        rubro: selectedProducto.rubro,
      });
      let cos = 0;
      selectedProducto.productosIngredientes?.map((ingre) => {
        cos += ingre.ingrediente.precioCosto * ingre.cantidad;
      });
      setCosto(cos);
      setSelectedIngredients(selectedProducto.productosIngredientes || []);
    }
  }, [selectedProducto]);
  

  const selectIngredienteA = (id: number) => {
    if (id !== 0) {
      const ingrediente = ingredientesA.find((ingr) => ingr.id === id);
      if (ingrediente) {
        setIngredienteA(ingrediente);
      }
    } else {
      setIngredienteA(null);
    }
  };

  const agregarIngrediente = () => {
    if (ingredienteA && cantIngrediente > 0) {
      const existingIngredient = selectedIngredients.find(
        (ingre) => ingre.ingrediente.id === ingredienteA.id
      );
      if (existingIngredient) {
        existingIngredient.cantidad += cantIngrediente;
      } else {
        setSelectedIngredients([
          ...selectedIngredients,
          {
            cantidad: cantIngrediente,
            id: 0, // You may need to adjust this ID based on your backend logic
            ingrediente: ingredienteA,
          },
        ]);
      }
      setCosto(costo + cantIngrediente * ingredienteA.precioCosto);
      setCantIngrediente(0);
    }
  };

  const handleDeleteIngrediente = (ingredient: IProductoIngrediente) => {
    const updatedIngredients = selectedIngredients.filter(
      (ingre) => ingre !== ingredient
    );
    setSelectedIngredients(updatedIngredients);
    setCosto(costo - ingredient.cantidad * ingredient.ingrediente.precioCosto);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (producto && selectedIngredients.length > 0) {
      const updatedProducto: IProducto = {
        ...producto,
        productosIngredientes: selectedIngredients,
      };
      handleProductoEdit(updatedProducto);
      handleClose();
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="xl">
      {/* Estructura del modal */}
      <Modal.Header closeButton>
        <Modal.Title>Editar Producto</Modal.Title>
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
                  value={producto?.nombre || ""}
                  onChange={(event) =>
                    setProducto({ ...producto, nombre: event.target.value })
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
                  value={producto?.imagen || ""}
                  onChange={(event) =>
                    setProducto({ ...producto, imagen: event.target.value })
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
                  value={producto.denominacion}
                  onChange={(event) =>
                    setProducto({
                      ...producto,
                      denominacion: event.target.value,
                    })
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
                  label={producto?.esBebida ? "Sí" : "No"}
                  checked={producto?.esBebida}
                  onChange={() =>
                    setProducto({ ...producto, esBebida: !producto.esBebida })
                  }
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group className="mb-3" controlId="formEstado">
                <Form.Label>Activo</Form.Label>
                <Form.Check
                  type="switch"
                  id="activoSwitch"
                  label={producto?.activo ? "Sí" : "No"}
                  checked={producto?.activo || false}
                  onChange={() =>
                    setProducto({ ...producto, activo: !producto.activo })
                  }
                />
              </Form.Group>
            </Col>
          </Row>
          {!producto.esBebida && (
            <Row>
              <Col md={8}>
                <Form.Group className="mb-3" controlId="formPreparacion">
                  <Form.Label>Receta</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    placeholder="Ingrese una receta"
                    value={producto.preparacion}
                    onChange={(event) =>
                      setProducto({
                        ...producto,
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
                    value={producto.tiempoEstimadoCocina}
                    min={1}
                    onChange={(event) =>
                      setProducto({
                        ...producto,
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
                  value={producto.rubro.id || ""} // Establecer el valor seleccionado en función del ID del rubro del producto
                  onChange={(event) => {
                    const rubroId = parseInt(event.target.value);
                    const selectedRubro = rubros.find(
                      (rubro) => rubro.id === rubroId
                    );
                    if (selectedRubro) {
                      setProducto({ ...producto, rubro: selectedRubro });
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
                    value={producto.precio}
                    min={1}
                    onChange={(event) =>
                      setProducto({
                        ...producto,
                        precio: parseFloat(event.target.value),
                      })
                    }
                    required
                  />
                </div>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formStockMin">
                <Form.Label>Stock Mínimo</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Ingrese stock"
                  value={producto.stockMinimo}
                  min={1}
                  onChange={(event) =>
                    setProducto({
                      ...producto,
                      stockMinimo: parseFloat(event.target.value),
                    })
                  }
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formStockAct">
                <Form.Label>Stock Actual</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Ingrese stock"
                  value={producto.stockActual}
                  min={1}
                  onChange={(event) =>
                    setProducto({
                      ...producto,
                      stockActual: parseFloat(event.target.value),
                    })
                  }
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          {producto.esBebida && (
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
          {!producto.esBebida && (
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
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default EditProductoModal;
