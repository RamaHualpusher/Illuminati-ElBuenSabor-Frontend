import React, { FC, useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import RankingClientes from './RankingClientes/RankingClientes';
import RankingAlimento from './RankingProductos/RankingAlimento';
import RankingVentas from './RankingVentas/RankingVentas';

const Rankings: FC = () => {
    const [selectedOption, setSelectedOption] = useState<"clientes" | "alimentos" | "ventas">("clientes");

    const handleOptionChange = (option: "clientes" | "alimentos" | "ventas") => {
        setSelectedOption(option);
    };

    return (
        <div>
            <Container>
                <h1 className="display-3">Rankings</h1>
                <div className="d-grid gap-2 d-md-block text-center">
                    <Row>
                        <Col xs={12} md={6} lg={4} className="mx-auto mb-2">
                            <Button
                                className={`btn btn-primary rounded w-100 ${selectedOption === 'clientes' ? 'btn-dark' : 'btn-secondary'}`}
                                onClick={() => handleOptionChange('clientes')}
                            >
                                Clientes
                            </Button>
                        </Col>
                        <Col xs={12} md={6} lg={4} className="mx-auto mb-2">
                            <Button
                                className={`btn btn-primary rounded w-100 ${selectedOption === 'alimentos' ? 'btn-dark' : 'btn-secondary'}`}
                                onClick={() => handleOptionChange('alimentos')}
                            >
                                Alimentos
                            </Button>
                        </Col>
                        {/* <Col xs={12} md={6} lg={4} className="mx-auto mb-2">
                            <Button
                                className={`btn btn-primary rounded w-100 ${selectedOption === 'ventas' ? 'btn-dark' : 'btn-secondary'}`}
                                onClick={() => handleOptionChange('ventas')}
                            >
                                Ventas
                            </Button>
                        </Col> */}
                    </Row>
                </div>

                <div className="mt-4">
                    {selectedOption === 'clientes' && <RankingClientes />}
                    {selectedOption === 'alimentos' && <RankingAlimento />}
                    {selectedOption === 'ventas' && <RankingVentas />}
                </div>

            </Container>
        </div>
    );
};

export default Rankings;
