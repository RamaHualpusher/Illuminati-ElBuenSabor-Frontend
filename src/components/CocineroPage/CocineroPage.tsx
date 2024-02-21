import React, { useState, FC } from "react"; // Importar React y useState desde React, y FC (Functional Component) desde "react"
import { Button, Col, Container, Row } from "react-bootstrap"; // Importar componentes Button, Col, Container y Row desde react-bootstrap
import CocineroPedido from "./CocineroPedidos"; // Importar el componente CocineroPedido desde el archivo "./CocineroPedidos"
import Stock from "../Stock/Stock/Stock"; // Importar el componente Stock desde el archivo "../Stock/Stock/Stock"

const CocineroPage: FC = () => {

    // Definir un estado llamado selectedOption para controlar la opción seleccionada (pedidos o stock)
    const [selectedOption, setSelectedOption] = useState("pedidos");

    // Función para cambiar la opción seleccionada
    const handleOptionChange = (option: "pedidos" | "stock") => {
        setSelectedOption(option);
    };

    return (
        <div>
            <Container>
                <Row className="d-flex justify-content-center mt-4">
                    <Col xs={12} md={6} lg={4} className="mb-2">
                        {/* Botón para seleccionar la opción "pedidos" */}
                        <Button
                            className={`btn btn-primary rounded w-100 ${selectedOption === 'pedidos' ? 'btn-dark' : 'btn-secondary'}`}
                            onClick={() => handleOptionChange('pedidos')}
                        >
                            Pedidos a preparar
                        </Button>
                    </Col>
                    <Col xs={12} md={6} lg={4} className="mb-2">
                        {/* Botón para seleccionar la opción "stock" */}
                        <Button
                            className={`btn btn-primary rounded w-100 ${selectedOption === 'stock' ? 'btn-dark' : 'btn-secondary'}`}
                            onClick={() => handleOptionChange('stock')}
                        >
                            Stock
                        </Button>
                    </Col>
                </Row>
                <div className="mt-4">
                    {selectedOption === 'pedidos' ? <CocineroPedido /> : <Stock />}
                </div>
            </Container>
        </div>
    );
};

export default CocineroPage; // Exportar el componente CocineroPage
