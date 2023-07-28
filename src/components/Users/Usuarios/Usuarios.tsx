import React, { FC, useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Clientes from '../Clientes/Clientes';
import Empleado from '../Empleado/Empleados';

const Usuarios: FC = () => {
    const [selectedOption, setSelectedOption] = useState<"empleados" | "clientes">("empleados");

    const handleOptionChange = (option: "empleados" | "clientes") => {
        setSelectedOption(option);
    };

    return (
        <div>
            <Container>
                <h1 className="display-3">Usuarios</h1>
                <div className="d-grid gap-2 d-md-block text-center">
                    <Row>
                        <Col xs={12} md={6} lg={5} className="mx-auto mb-2">
                            <Button
                                className={`btn btn-primary rounded w-100 ${selectedOption === 'empleados' ? 'btn-dark' : 'btn-secondary'}`}
                                onClick={() => handleOptionChange('empleados')}
                            >
                                Empleados
                            </Button>
                        </Col>
                        <Col xs={12} md={6} lg={5} className="mx-auto mb-2">
                            <Button
                                className={`btn btn-primary rounded w-100 ${selectedOption === 'clientes' ? 'btn-dark' : 'btn-secondary'}`}
                                onClick={() => handleOptionChange('clientes')}
                            >
                                Clientes
                            </Button>
                        </Col>
                    </Row>
                </div>

                <div className="mt-4">
                    {selectedOption === 'empleados' && <Empleado />}
                    {selectedOption === 'clientes' && <Clientes />}
                </div>

            </Container>
        </div>
    );
};

export default Usuarios;
