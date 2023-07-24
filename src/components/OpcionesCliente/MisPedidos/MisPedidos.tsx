import React, { FC, useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Pasados from './Pasados';
import Pendientes from './Pendientes';

const MisPedidos: FC = () => {
    const [selectedOption, setSelectedOption] = useState<"pedidosPendientes" | "pedidosPasados">("pedidosPendientes");

    const handleOptionChange = (option: "pedidosPendientes" | "pedidosPasados") => {
        setSelectedOption(option);
    };

    return (
        <div style={{ marginTop: '90px' }}>
            <Container>
                <h1 className="display-3">Mis Pedidos</h1>

                <div className="d-grid gap-2 d-md-block text-center mt-3">
                    <Row>
                        <Col xs={12} md={6} lg={5} className="mx-auto mb-2">
                            <Button
                                className={`btn btn-primary rounded w-100 ${selectedOption === 'pedidosPendientes' ? 'btn-dark' : 'btn-secondary'}`}
                                onClick={() => handleOptionChange('pedidosPendientes')}
                            >
                                Pendientes
                            </Button>
                        </Col>
                        <Col xs={12} md={6} lg={5} className="mx-auto mb-2">
                            <Button
                                className={`btn btn-primary rounded w-100 ${selectedOption === 'pedidosPasados' ? 'btn-dark' : 'btn-secondary'}`}
                                onClick={() => handleOptionChange('pedidosPasados')}
                            >
                                Pasados
                            </Button>
                        </Col>
                    </Row>
                </div>

                <div className="mt-4">
                    {selectedOption === 'pedidosPasados' && <Pasados />}
                    {selectedOption === 'pedidosPendientes' && <Pendientes />}
                </div>

            </Container>
        </div>
    );
};

export default MisPedidos;
