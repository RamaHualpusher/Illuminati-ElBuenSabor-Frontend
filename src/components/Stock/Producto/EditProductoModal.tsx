import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Col, Row } from "react-bootstrap";
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
    // Estados del componente

    const [rubros, setRubros] = useState<IRubroNew[]>([]);
    const [selectedRubro, setSelectedRubro] = useState<IRubroNew | null>(null);
    const [cantidad, setCantidad] = useState(0);
    const [ingredientesA, setIngredientesA] = useState<IIngredientes[]>([]);
    const [cantIngrediente, setCantIngrediente] = useState<number>(0);
    const [ingredienteA, setIngredienteA] = useState<IIngredientes | null>(null);
    const [costo, setCosto] = useState<number>(0);
    const API_URL = process.env.REACT_APP_API_URL || "";

    // Definición de objetos por defecto
    const rubro: IRubroNew = {
        id: 0,
        nombre: "",
        //agregue aca rami
        // rubroPadre: rubroPadre,
        ingredientOwner: false,
    };


    const defectoIngrediente: IIngredientes = {
        id: 0,
        activo: false,
        nombre: "",
        precioCosto: 0,
        rubro: rubro,
        stockActual: 0,
        stockMinimo: 0,
        unidadMedida: ""
    };

    const defectoProducto: IProducto = {
        id: 0,
        nombre: "",
        rubro: rubro,
        tiempoEstimadoCocina: 0,
        denominacion: "",
        imagen: "",
        stockActual: 0,
        stockMinimo: 0,
        preparacion: "",
        precio: 0,
        esBebida: false,
        activo: false,
        productosIngredientes: []
    }

    const defectoProductoIngrediente: IProductoIngrediente = {
        cantidad: 0,
        id: 0,
        ingrediente: defectoIngrediente
    }
    const [ingrediente, setIngrediente] = useState<IProductoIngrediente>(defectoProductoIngrediente);
    const [producto, setProducto] = useState<IProducto>(defectoProducto);


    // Cargar ingredientes y rubros al montar el componente
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

    // Cargar datos del producto seleccionado al montar el componente
    useEffect(() => {
        if (selectedProducto) {
            console.log(selectedProducto);
            console.log(selectedProducto.productosIngredientes);
            setProducto({
                ...selectedProducto,
            })
            let cos = 0;
            producto.productosIngredientes?.map((ingre) => {
                console.log(ingre);
                cos += (ingre.ingrediente.precioCosto * ingre.cantidad);
            })
            setCosto(cos);
        }
    }, [selectedProducto]);

    // Función para seleccionar un ingrediente existente
    const selectIngrediente = (id: number) => {
        if (ingrediente !== defectoProductoIngrediente) {
            producto.productosIngredientes?.map((ingr) => {
                if (ingrediente.ingrediente.id === ingr.ingrediente.id) {
                    console.log("ingrediente previo guardado")
                    ingr = ingrediente;
                    ingr.cantidad = cantidad;
                }
            })
        }
        console.log("ingreso a funcion")
        if (id !== 0) {
            producto.productosIngredientes?.map((ingr) => {
                if (id === ingr.ingrediente.id) {
                    console.log("ingrediente encontrado" + ingr.ingrediente.id)
                    setCantidad(ingr.cantidad);
                    setIngrediente(ingr);
                    return null;
                }
            })
            return null;
        }
        else {
            setIngrediente(defectoProductoIngrediente);
            setCantidad(0);
            return null;
        }
    }

    // Función para seleccionar un ingrediente a agregar
    const selectIngredienteA = (id: number) => {
        console.log("ingreso a funcion")
        if (id !== 0) {
            ingredientesA?.map((ingr) => {
                if (id === ingr.id) {
                    console.log("ingrediente encontrado" + ingr.id);
                    setIngredienteA(ingr);
                    return null;
                }
            })
            return null;
        }
        else {
            setIngredienteA(null)
            return null;
        }
    }

    // Función para agregar un ingrediente a la lista de ingredientes
    const agregarIngrediente = () => {
        if (ingredienteA !== null && cantIngrediente > 0) {
            let contar: number = 0;
            producto.productosIngredientes?.map((ingre) => {
                if (ingre.id !== undefined) {
                    contar = ingre.id;
                }
            })
            let encontrado = false
            producto.productosIngredientes?.map((ingre) => {
                if (ingre.ingrediente.id === ingredienteA.id && ingre.ingrediente.activo !== false) {
                    console.log("coincidencia encontrada " + ingre.ingrediente.id + " cantida previa" + (ingre.cantidad))
                    ingre.cantidad += cantIngrediente;
                    setCosto(costo + (cantIngrediente * ingredienteA.precioCosto));
                    console.log(ingre.cantidad);
                    setCantIngrediente(0);
                    encontrado = true;
                }
            })

            if (encontrado === false && ingredienteA.activo !== false) {
                const ingre: IIngredientes | null = ingredienteA;
                const ingres: IProductoIngrediente[] | null = producto.productosIngredientes ? producto.productosIngredientes : null;
                const agre: IProductoIngrediente = {
                    cantidad: cantIngrediente,
                    id: contar + 1,
                    ingrediente: ingre || defectoIngrediente
                }
                setCosto(costo + (cantIngrediente * ingredienteA.precioCosto));
                ingres?.push(agre);
                setProducto({
                    ...producto,
                    productosIngredientes: ingres ? ingres : producto.productosIngredientes,
                })
                console.log("agregado ingrediente")
                setCantIngrediente(0);
            }
        }
    }

    // Función para manejar cambios en la cantidad de un ingrediente
    const handleCantidad = (cant: number) => {
        if (cant > cantidad) {
            setCosto(costo + ((cant - cantidad) * ingrediente.ingrediente.precioCosto))
        } else {
            setCosto(costo - ((cantidad - cant) * ingrediente.ingrediente.precioCosto))
        }
        setCantidad(cant);
        if (ingrediente !== defectoProductoIngrediente) {
            producto.productosIngredientes?.map((ingr) => {
                if (ingrediente.ingrediente.id === ingr.ingrediente.id) {
                    console.log("ingrediente previo guardado")
                    ingr = ingrediente;
                    ingr.cantidad = cantidad;
                }
            })
        }
    }

    // Función para eliminar un ingrediente seleccionado
    const handleDeletIngrediente = () => {
        if (producto.productosIngredientes) {
            console.log("ingreso a funcion")
            const filtrar = producto.productosIngredientes;
            const filtrado = filtrar?.filter(filtrar => filtrar.ingrediente.id !== ingrediente.ingrediente.id);
            setProducto({
                ...producto,
                productosIngredientes: filtrado,
            })
            setCosto(costo - ingrediente.ingrediente.precioCosto * ingrediente.cantidad);
            setIngrediente(defectoProductoIngrediente);
            setCantidad(0);
        }
    }

    // Manejar el envío del formulario de edición
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (producto.productosIngredientes && producto.productosIngredientes.length > 0) {
            if (selectedProducto) {
                const updatedProducto: IProducto = {
                    ...selectedProducto,
                };

                handleProductoEdit(updatedProducto);
            }
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
                        <Col md={4}>
                            <Form.Group className="mb-3" controlId="formNombre">
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Ingrese nombre"
                                    value={producto.nombre}
                                    onChange={(event) => producto.nombre = event.target.value}
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
                                    value={producto.imagen}
                                    onChange={(event) => producto.imagen = event.target.value}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className="mb-3" controlId="formEstado">
                                <Form.Label>Estado</Form.Label>
                                <Form.Select
                                    value={producto.activo ? 'alta' : 'baja'}
                                    onChange={(event) => producto.activo = event.target.value === 'alta'}
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
                                    value={producto.denominacion}
                                    onChange={(event) => producto.denominacion = event.target.value}
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
                                    value={producto.preparacion}
                                    onChange={(event) => producto.preparacion = event.target.value}
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
                                    value={selectedRubro?.id || ""}
                                    onChange={(event) => {
                                        const rubroId = parseInt(event.target.value);
                                        const rubro = rubros.find((rubro) => rubro.id === rubroId);
                                        //setRubroId(rubroId);
                                        setSelectedRubro(rubro || null);
                                    }}
                                    required
                                >
                                    <option value="">Seleccione un rubro</option>
                                    {rubros.map((rubro) => (
                                        <option key={rubro.id} value={rubro.id}>
                                            {rubro.nombre}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className="mb-3" controlId="formTiempo">
                                <Form.Label>Tiempo (min)</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Ingrese tiempo en minutos"
                                    value={producto.tiempoEstimadoCocina}
                                    onChange={(event) => producto.tiempoEstimadoCocina = parseInt(event.target.value)}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className="mb-3" controlId="formPrecio">
                                <Form.Label>{"Precio (costo: " + costo + ") "}</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Ingrese el precio"
                                    value={producto.precio}
                                    onChange={(event) => producto.precio = parseInt(event.target.value)}
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="formEstado">
                                <Form.Label>Ingredientes</Form.Label>
                                <Form.Select
                                    value={ingrediente?.ingrediente.id}
                                    onChange={(event) => selectIngrediente(parseInt(event.target.value))}
                                    required
                                >
                                    <option value="none">Eliminar Ingrediente</option>
                                    {producto.productosIngredientes?.map((Ingrediente) =>
                                        <option value={Ingrediente.ingrediente.id}>{Ingrediente.ingrediente.nombre + " (" + Ingrediente.ingrediente.unidadMedida + ")"}</option>
                                    )}
                                </Form.Select>
                                <Form.Control
                                    type="number"
                                    placeholder="Ingrese Cantidad"
                                    value={cantidad}
                                    onChange={(event) => handleCantidad(parseInt(event.target.value))}
                                    required
                                >
                                </Form.Control>
                                <Button
                                    variant="danger" onClick={() => handleDeletIngrediente()}>Eliminar Ingrediente</Button>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="formEstado">
                                <Form.Label>Ingredientes</Form.Label>
                                <Form.Select
                                    value={ingredienteA?.id}
                                    onChange={(event) => selectIngredienteA(parseInt(event.target.value))}
                                    required
                                >
                                    <option value="none">Agregar Ingrediente</option>
                                    {ingredientesA.map((Ingrediente) =>
                                        <option value={Ingrediente.id}>{Ingrediente.nombre + " (" + Ingrediente.unidadMedida + ") " + (Ingrediente.activo === false ? "Baja" : "")}</option>
                                    )}
                                </Form.Select>
                                <Form.Control
                                    type="number"
                                    placeholder="Ingrese Cantidad"
                                    value={cantIngrediente}
                                    onChange={(event) => setCantIngrediente(parseInt(event.target.value))}
                                    required
                                >
                                </Form.Control>
                                <Button
                                    variant={ingredienteA?.activo === false ? "secondary" : "success"} onClick={() => agregarIngrediente()}>Agregar Ingrediente</Button>
                            </Form.Group>
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