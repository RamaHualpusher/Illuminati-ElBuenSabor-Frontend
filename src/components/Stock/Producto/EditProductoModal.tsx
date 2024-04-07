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
    // Estados del componente

    const [rubros, setRubros] = useState<IRubroNew[]>([]);
    const [ingredientesA, setIngredientesA] = useState<IIngredientes[]>([]);
    const [ingredienteA, setIngredienteA] = useState<IIngredientes | null>(null);
    const [cantIngrediente, setCantIngrediente] = useState<number>(0);
    const [producto, setProducto] = useState<IProducto>(initializeProduct);
    const [selectedIngredients, setSelectedIngredients] = useState<IProductoIngrediente[]>([]);
    const [costo, setCosto] = useState<number>(0);
    const API_URL = process.env.REACT_APP_API_URL || "";

    useEffect(() => {
        const fetchData = async () => {
            let URL = API_URL + "ingrediente";
            try {
                const response = await axios.get(URL);
                setIngredientesA(response.data);
            } catch (error) {
                console.error('Error al cargar datos de ingredientes:', error);
            }
        }
        fetchData();

        const fetchRubros = async () => {
            let URL = API_URL + "rubro";
            try {
                const response = await axios.get(URL);
                setRubros(response.data);
            } catch (error) {
                console.error("Error al cargar rubros " + error);
            }
        }
        fetchRubros();
    }, []);

    useEffect(() => {
        if (selectedProducto) {
            setProducto({
                ...selectedProducto,
                rubro: selectedProducto.rubro 
            });
            let cos = 0;
            selectedProducto.productosIngredientes?.map((ingre) => {
                cos += (ingre.ingrediente.precioCosto * ingre.cantidad);
            })
            setCosto(cos);
            setSelectedIngredients(selectedProducto.productosIngredientes || []);
        }
    }, [selectedProducto, rubros]);

    const selectIngredienteA = (id: number) => {
        if (id !== 0) {
            const ingrediente = ingredientesA.find(ingr => ingr.id === id);
            if (ingrediente) {
                setIngredienteA(ingrediente);
            }
        } else {
            setIngredienteA(null);
        }
    }

    const agregarIngrediente = () => {
        if (ingredienteA && cantIngrediente > 0) {
            const existingIngredient = selectedIngredients.find(ingre => ingre.ingrediente.id === ingredienteA.id);
            if (existingIngredient) {
                existingIngredient.cantidad += cantIngrediente;
            } else {
                setSelectedIngredients([
                    ...selectedIngredients,
                    {
                        cantidad: cantIngrediente,
                        id: 0, // You may need to adjust this ID based on your backend logic
                        ingrediente: ingredienteA,
                    }
                ]);
            }
            setCosto(costo + (cantIngrediente * ingredienteA.precioCosto));
            setCantIngrediente(0);
        }
    }

    const handleDeleteIngrediente = (ingredient: IProductoIngrediente) => {
        const updatedIngredients = selectedIngredients.filter(ingre => ingre !== ingredient);
        setSelectedIngredients(updatedIngredients);
        setCosto(costo - (ingredient.cantidad * ingredient.ingrediente.precioCosto));
    }

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
        <Modal show={show} onHide={handleClose} dialogClassName="modal-lg">
            {/* Estructura del modal */}
            <Modal.Header closeButton>
                <Modal.Title>Editar Producto</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Row>
                        <Col md={10}>
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
                        <Col md={2}>
                            <Form.Group className="mb-3" controlId="formEstado">
                                <Form.Label>Activo</Form.Label>
                                <Form.Check
                                    type="switch"
                                    id="activoSwitch"
                                    label={producto?.activo ? 'Sí' : 'No'}
                                    checked={producto?.activo || false}
                                    onChange={() => setProducto({ ...producto, activo: !producto.activo })}
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
                            value={producto?.imagen || ""}
                            onChange={(event) =>
                                setProducto({ ...producto, imagen: event.target.value })
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
                                    label={producto?.esBebida ? 'Sí' : 'No'}
                                    checked={producto?.esBebida || false}
                                    onChange={() => setProducto({ ...producto, esBebida: !producto.esBebida })}
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
                            value={producto.denominacion}
                            onChange={(event) =>
                                setProducto({ ...producto, denominacion: event.target.value })
                            }
                            required
                            />
                        </Form.Group>
                        </Col>
                    </Row>
                    {!producto.esBebida && (    
                    <Row>
                        <Col md={12}>
                        <Form.Group className="mb-3" controlId="formPreparacion">
                            <Form.Label>Receta</Form.Label>
                            <Form.Control
                            as="textarea"
                            rows={2}
                            placeholder="Ingrese una receta"
                            value={producto.preparacion}
                            onChange={(event) =>
                                setProducto({ ...producto, preparacion: event.target.value })
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
                                value={producto.rubro.id || ''} // Establecer el valor seleccionado en función del ID del rubro del producto
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
                            <Form.Control
                            type="number"
                            placeholder="Ingrese precio"
                            value={producto.precio}
                            onChange={(event) =>
                                setProducto({
                                ...producto,
                                precio: parseFloat(event.target.value),
                                })
                            }
                            required
                            />
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
                                    value={producto.tiempoEstimadoCocina}
                                    onChange={(event) => setProducto({ ...producto, tiempoEstimadoCocina: parseInt(event.target.value) })}
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
                                    value={producto.stockMinimo}
                                    onChange={(event) => setProducto({ ...producto, stockMinimo: parseFloat(event.target.value) })}
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
                                    value={producto.stockActual}
                                    onChange={(event) => setProducto({ ...producto, stockActual: parseFloat(event.target.value) })}
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
                                    value={cantIngrediente}
                                    onChange={(event) =>
                                    setCantIngrediente(parseInt(event.target.value))
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
                        Guardar Cambios
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};


export default EditProductoModal;