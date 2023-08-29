import React, { FC, useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Ingrediente from '../Ingrediente/Ingrediente';
import Productos from '../Producto/Productos';
import Rubros from '../Rubros/Rubros';
import CompraIngrediente from '../CompraIngrediente/CompraIngrediente';

const Stock: FC = () => {
    const [selectedOption, setSelectedOption] = useState<"productos" | "ingredientes" | "compra" | "rubros">("productos");

    // Cambiar la opción seleccionada (Productos, Ingredientes, Compra, Rubros)
    const handleOptionChange = (option: "productos" | "ingredientes" | "compra" | "rubros") => {
        setSelectedOption(option);
    };

    return (
        <div>
            <Container>
                <h1 className="display-3">Stock</h1>

                {/* Botones para cambiar entre las opciones */}
                <div className="d-grid gap-2 d-md-block text-center">
                    <Row>
                        <Col xs={12} md={6} lg={4} className="mx-auto mb-2">
                            <Button
                                className={`btn btn-primary rounded w-100 ${selectedOption === 'productos' ? 'btn-dark' : 'btn-secondary'}`}
                                onClick={() => handleOptionChange('productos')}
                            >
                                Productos
                            </Button>
                        </Col>
                        <Col xs={12} md={6} lg={4} className="mx-auto mb-2">
                            <Button
                                className={`btn btn-primary rounded w-100 ${selectedOption === 'ingredientes' ? 'btn-dark' : 'btn-secondary'}`}
                                onClick={() => handleOptionChange('ingredientes')}
                            >
                                Ingredientes
                            </Button>
                        </Col>
                        <Col xs={12} md={6} lg={4} className="mx-auto mb-2">
                            <Button
                                className={`btn btn-primary rounded w-100 ${selectedOption === 'compra' ? 'btn-dark' : 'btn-secondary'}`}
                                onClick={() => handleOptionChange('compra')}
                            >
                                Compra Ingredientes
                            </Button>
                        </Col>
                        <Col xs={12} md={6} lg={4} className="mx-auto mb-2">
                            <Button
                                className={`btn btn-primary rounded w-100 ${selectedOption === 'rubros' ? 'btn-dark' : 'btn-secondary'}`}
                                onClick={() => handleOptionChange('rubros')}
                            >
                                Rubros
                            </Button>
                        </Col>
                    </Row>
                </div>

                {/* Mostrar el contenido correspondiente según la opción seleccionada */}
                <div className="mt-4">
                    {selectedOption === 'productos' && <Productos />}
                    {selectedOption === 'ingredientes' && <Ingrediente />}
                    {selectedOption === 'compra' && <CompraIngrediente />}
                    {selectedOption === 'rubros' && <Rubros />}
                </div>
            </Container>
        </div>
    );
};

export default Stock;
