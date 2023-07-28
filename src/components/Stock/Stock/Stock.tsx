import React, { FC, useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Ingrediente from '../Ingrediente/Ingrediente';
import Productos from '../Producto/Productos';
import Rubros from '../Rubros/Rubros';

const Stock: FC = () => {
    const [selectedOption, setSelectedOption] = useState<"productos" | "ingredientes" | "rubros">("productos");

    const handleOptionChange = (option: "productos" | "ingredientes" | "rubros") => {
        setSelectedOption(option);
    };

    return (
        <div>
            <Container>
                <h1 className="display-3">Stock</h1>
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
                                className={`btn btn-primary rounded w-100 ${selectedOption === 'rubros' ? 'btn-dark' : 'btn-secondary'}`}
                                onClick={() => handleOptionChange('rubros')}
                            >
                                Rubros
                            </Button>
                        </Col>
                    </Row>
                </div>

                <div className="mt-4">
                    {selectedOption === 'productos' && <Productos />}
                    {selectedOption === 'ingredientes' && <Ingrediente />}
                     {selectedOption === 'rubros' && <Rubros />} 
                </div>

            </Container>
        </div>
    );
};

export default Stock;
