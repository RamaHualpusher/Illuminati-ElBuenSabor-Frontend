import React, { FC, useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Clientes from '../Clientes/Clientes';
import Empleados from '../Empleado/Empleados';

const Usuarios: FC = () => {
    const [selectedOption, setSelectedOption] = useState<"empleados" | "clientes">("empleados");

    // Maneja el cambio entre la vista de empleados y clientes
    const handleOptionChange = (option: "empleados" | "clientes") => {
        setSelectedOption(option);
    };

    return (
        <div>
            <Container>
                <h1 className="display-3">Usuarios</h1>
                <div className="d-grid gap-2 d-md-block text-center">
                    <Row>
                        {/* Botón para cambiar a la vista de empleados */}
                        <Col xs={12} md={6} lg={5} className="mx-auto mb-2">
                            <Button
                                className={`btn btn-primary rounded w-100 ${selectedOption === 'empleados' ? 'btn-dark' : 'btn-secondary'}`}
                                onClick={() => handleOptionChange('empleados')}
                            >
                                Empleados
                            </Button>
                        </Col>
                        {/* Botón para cambiar a la vista de clientes */}
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
                    {/* Muestra la vista correspondiente según la opción seleccionada */}
                    {selectedOption === 'empleados' && <Empleados />}
                    {selectedOption === 'clientes' && <Clientes />}
                </div>
            </Container>
        </div>
    );
};

export default Usuarios;
