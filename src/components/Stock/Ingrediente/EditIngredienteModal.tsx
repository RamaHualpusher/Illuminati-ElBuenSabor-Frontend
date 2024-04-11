import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Col, Row } from 'react-bootstrap';
import { IIngredientes } from '../../../interface/IIngredientes';
import { IRubroNew } from '../../../interface/IRubro';
import { IEditIngredientesModalProps } from '../../../interface/IIngredientes';
import axios from 'axios';

const EditIngredientesModal: React.FC<IEditIngredientesModalProps> = ({
    show,
    handleClose,
    handleIngredientesEdit,
    selectedIngredientes,
}) => {
    const [ingrediente, setIngrediente] = useState<IIngredientes | null>(null);
    const [rubros, setRubros] = useState<IRubroNew[]>([]);
    const unidades = ["Kg", "g", "Mg", "l", "Ml", "U"];
    const API_URL = process.env.REACT_APP_API_URL || "";

    useEffect(() => {
        const fetchRubros = async () => {
          try {
            const responseData = await axios.get<IRubroNew[]>(API_URL + "rubro");
            const filteredRubros = responseData.data.filter(rubro => rubro.ingredientOwner && rubro.rubroPadre !== null);
            setRubros(filteredRubros);
          } catch (error) {
            console.log(error);
          }
        };
        fetchRubros();
      }, [API_URL]);
      

    useEffect(() => {
        if (selectedIngredientes) {
            setIngrediente({ ...selectedIngredientes });
        }
    }, [selectedIngredientes]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (ingrediente) {
            const updatedIngredientes: IIngredientes = { ...ingrediente };
            handleIngredientesEdit(updatedIngredientes);
        }
        handleClose();
    };

    const handleUM = (unidad: string) => {
        if (ingrediente) {
            setIngrediente(prevState => {
                if (!prevState) return null;

                const selectedUnidad = unidades.find(u => u === unidad);
                const currentUnidad = unidades.find(u => u === prevState.unidadMedida);

                if (selectedUnidad && currentUnidad) {
                    const selectedFactor = unidades.indexOf(selectedUnidad);
                    const currentFactor = unidades.indexOf(currentUnidad);
                    const conversionFactor = 10 ** (selectedFactor - currentFactor);

                    return {
                        ...prevState,
                        unidadMedida: unidad,
                        stockActual: prevState.stockActual * conversionFactor,
                        stockMinimo: prevState.stockMinimo * conversionFactor
                    };
                }
                return prevState;
            });
        }
    };

    const handleChangeNombre = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (ingrediente) {
            setIngrediente({ ...ingrediente, nombre: event.target.value });
        }
    };

    const handleChangeRubro = (event: React.ChangeEvent<HTMLSelectElement>) => {
        if (ingrediente) {
            setIngrediente({
                ...ingrediente,
                rubro: { id: parseInt(event.target.value), nombre: '', ingredientOwner: true }
            });
        }
    };

    const handleChangeStockMinimo = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (ingrediente) {
            const stockMinimo = parseInt(event.target.value);
            setIngrediente(prevState => {
                if (!prevState) return null;
                return {
                    ...prevState,
                    stockMinimo: isNaN(stockMinimo) || stockMinimo < 0 ? 0 : stockMinimo
                };
            });
        }
    };

    const handleChangeStockActual = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (ingrediente) {
            const stockActual = parseInt(event.target.value);
            setIngrediente(prevState => {
                if (!prevState) return null;
                return {
                    ...prevState,
                    stockActual: isNaN(stockActual) || stockActual < 0 ? 0 : stockActual
                };
            });
        }
    };

    const handleChangePrecioCosto = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (ingrediente) {
            const precioCosto = parseInt(event.target.value);
            setIngrediente(prevState => {
                if (!prevState) return null;
                return {
                    ...prevState,
                    precioCosto: isNaN(precioCosto) || precioCosto < 0 ? 0 : precioCosto
                };
            });
        }
    };

    const handleChangeActivo = (event: React.ChangeEvent<HTMLSelectElement>) => {
        if (ingrediente) {
            setIngrediente({
                ...ingrediente,
                activo: event.target.value === 'alta' ? true : false
            });
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Editar Ingredientes</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="formNombre">
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Ingrese nombre"
                                    value={ingrediente?.nombre || ''}
                                    onChange={handleChangeNombre}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="formRubro">
                                <Form.Label>Rubro</Form.Label>
                                <Form.Select
                                    value={ingrediente?.rubro.id || ''}
                                    onChange={handleChangeRubro}
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
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="formMinStock">
                                <Form.Label>Min Stock</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Ingrese stock mínimo"
                                    value={ingrediente?.stockMinimo || 0}
                                    onChange={handleChangeStockMinimo}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="formStockActual">
                                <Form.Label>Stock Actual</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Ingrese stock actual"
                                    value={ingrediente?.stockActual || 0}
                                    onChange={handleChangeStockActual}
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="formPrecioCosto">
                                <Form.Label>PrecioCosto</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Ingrese precio Costo"
                                    value={ingrediente?.precioCosto || 0}
                                    onChange={handleChangePrecioCosto}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3" controlId="formUM">
                                <Form.Label>UM</Form.Label>
                                <Form.Select
                                    value={ingrediente?.unidadMedida || ''}
                                    onChange={(event) => handleUM(event.target.value)}
                                    required
                                >
                                    {unidades.map((unidad) => (
                                        <option key={unidad} value={unidad}>
                                            {unidad}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Form.Group className="mb-3" controlId="formEstado">
                        <Form.Label>Estado</Form.Label>
                        <Form.Select
                            value={ingrediente?.activo ? 'alta' : 'baja'}
                            onChange={handleChangeActivo}
                            required
                        >
                            <option value="alta">Alta</option>
                            <option value="baja">Baja</option>
                        </Form.Select>
                    </Form.Group>
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

export default EditIngredientesModal;