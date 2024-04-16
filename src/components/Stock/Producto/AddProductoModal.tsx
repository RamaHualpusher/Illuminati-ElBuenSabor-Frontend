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

  const [product, setProduct] = useState<IProducto>(initializeProduct);
  const [rubros, setRubros] = useState<IRubroNew[]>([]);
  const [ingredientesA, setIngredientesA] = useState<IIngredientes[]>([]);
  const [ingredienteA, setIngredienteA] = useState<IIngredientes | null>(null);
  const [cantIngredienteA, setCantIngredienteA] = useState<number>(0);
  const [costo, setCosto] = useState<number>(0);
  const API_URL = process.env.REACT_APP_API_URL || "";
  const [selectedIngredients, setSelectedIngredients] = useState<
    IProductoIngrediente[]
  >([]);

  useEffect(() => {
    const fetchRubros = async () => {
      try {
        const responseData = await axios.get<IRubroNew[]>(`${API_URL}rubro`);
        const filteredRubros = responseData.data.filter(rubro => !rubro.ingredientOwner && rubro.rubroPadre !== null); // Filtrar rubros que no sean ingredientes y tengan un padre
        setRubros(filteredRubros);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchIngredientes = async () => {
      try {
        const response = await fetch(`${API_URL}ingrediente`);
        const data: IIngredientes[] = await response.json();
        setIngredientesA(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchRubros();
    fetchIngredientes();
  }, []);

  const selectIngredienteA = (id: number) => {
    if (id !== 0) {
      const selectedIngrediente = ingredientesA.find((ingr) => ingr.id === id);
      setIngredienteA(selectedIngrediente || null);
      setCantIngredienteA(0);
    } else {
      setIngredienteA(null);
    }
  };

  const agregarIngrediente = () => {
    if (ingredienteA && cantIngredienteA > 0) {
      // Verificar si el ingrediente ya está presente en la lista
      const ingredienteExistente = product.productosIngredientes?.find(
        (ingr) => ingr.ingrediente.id === ingredienteA.id
      );

      if (ingredienteExistente) {
        // Ingrediente duplicado, mostrar mensaje o realizar alguna acción
        console.log("Este ingrediente ya está en la lista.");
      } else {
        const newProductIngrediente: IProductoIngrediente = {
          cantidad: cantIngredienteA,
          id: 0,
          ingrediente: ingredienteA,
        };

        setProduct({
          ...product,
          productosIngredientes: [
            ...(product.productosIngredientes || []),
            newProductIngrediente,
          ],
        });

        setCosto(costo + cantIngredienteA * ingredienteA.precioCosto);
        setSelectedIngredients([...selectedIngredients, newProductIngrediente]);

        // Limpiar el ingrediente seleccionado del select
        setIngredienteA(null);
        setCantIngredienteA(0);
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

    // Asignar null a la receta si es bebida
    const finalProduct: IProducto = {
      ...product,
      preparacion: product.esBebida ? "" : product.preparacion,
    };

    // Agregar el producto
    handleProductoAdd(finalProduct);
    handleCancelar();
  };
  const handleCancelar = () => {
    setProduct(initializeProduct);
    setCantIngredienteA(0);
    setCosto(0);
    setIngredienteA(null);
    setIngredienteA(null);

    // Limpiar la lista de ingredientes seleccionados al cerrar el modal
    setSelectedIngredients([]);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} dialogClassName="modal-lg">
      <Modal.Header closeButton>
        <Modal.Title>Agregar Producto</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Row>
            <Col md={12}>
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
          </Row>
          <Row>
            <Col md={10}>
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
            <Col md={12}>
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
          </Row>
          {!product.esBebida && (    
          <Row>
            <Col md={12}>
              <Form.Group className="mb-3" controlId="formPreparacion">
                <Form.Label>Receta</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  placeholder="Ingrese una receta"
                  value={product.preparacion}
                  onChange={(event) =>
                    setProduct({ ...product, preparacion: event.target.value })
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
                <span className="bg-success input-group-text"><b>$</b></span>
                  <Form.Control
                    type="number"
                    placeholder="Ingrese precio"
                    value={product.precio}
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
          <Row>
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
                <Form.Group className="mb-3" controlId="formStockMin">
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
            <Col md={4}>
                <Form.Group className="mb-3" controlId="formStockAct">
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
            <Col md={12}>
              <Form.Group className="mb-3" controlId="formIngredienteA">
                <Form.Label>Agregar Ingredientes</Form.Label>
                <Form.Select
                  value={ingredienteA?.id || 0}
                  onChange={(event) =>
                    selectIngredienteA(parseInt(event.target.value))
                  }
                  required
                >
                  <option value={0}>Agregar Ingrediente</option>
                  {ingredientesA.map((Ingrediente) => (
                    <option value={Ingrediente.id} key={Ingrediente.id}>
                      {Ingrediente.nombre}
                    </option>
                  ))}
                </Form.Select>
                {ingredienteA && (
                  <div className="input-group mt-3">
                    <Form.Control
                      type="number"
                      placeholder="Ingrese Cantidad"
                      value={cantIngredienteA}
                      onChange={(event) =>
                        setCantIngredienteA(parseInt(event.target.value))
                      }
                      required
                      className="mr-2"
                    />
                    <span className="input-group-text">{ingredienteA.unidadMedida}</span>
                  </div>
                )}
                <Button variant="success" onClick={() => agregarIngrediente()}>
                  Agregar Ingrediente
                </Button>
              </Form.Group>
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
                          onClick={() => handleDeleteIngrediente(ingrediente)}
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
