import React, { useState, FC } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import IngredientesTable from "../Stock/Ingrediente/Ingrediente";
import ProductosTable from "../Stock/Producto/Productos";
import CocineroPedido from "./CocineroPedidos";
import Rubros from "../Stock/Rubros/Rubros";

const CocineroPage: FC = () => {

    const [selectedOption, setSelectedOption] = useState("pedidos");
    const handleOptionChange = (option: "pedidos" | "productos" | "ingredientes" | "rubros") => {
        setSelectedOption(option);
    };

    return (
        <div>
            <Container>
                <Row className="d-flex justify-content-center mt-4">
                    <Col xs={12} md={6} lg={4} className="mb-2">
                        <Button
                            className={`btn btn-primary rounded w-100 ${selectedOption === 'pedidos' ? 'btn-dark' : 'btn-secondary'}`}
                            onClick={() => handleOptionChange('pedidos')}
                        >
                            Pedidos a preparar
                        </Button>
                    </Col>
                    <Col xs={12} md={6} lg={4} className="mb-2">
                        <Button
                            className={`btn btn-primary rounded w-100 ${selectedOption === 'productos' ? 'btn-dark' : 'btn-secondary'}`}
                            onClick={() => handleOptionChange('productos')}
                        >
                            Productos
                        </Button>
                    </Col>
                    <Col xs={12} md={6} lg={4} className="mb-2">
                        <Button
                            className={`btn btn-primary rounded w-100 ${selectedOption === 'ingredientes' ? 'btn-dark' : 'btn-secondary'}`}
                            onClick={() => handleOptionChange('ingredientes')}
                        >
                            Ingredientes
                        </Button>
                    </Col>
                    <Col xs={12} md={6} lg={4} className="mb-2">
                        <Button
                            className={`btn btn-primary rounded w-100 ${selectedOption === 'rubros' ? 'btn-dark' : 'btn-secondary'}`}
                            onClick={() => handleOptionChange('rubros')}
                        >
                            Rubros
                        </Button>
                    </Col>
                </Row>
                <div className="mt-4">
                    {selectedOption === 'productos' && <ProductosTable />}
                    {selectedOption === 'ingredientes' && <IngredientesTable />}
                    {selectedOption === 'pedidos' && <CocineroPedido />}
                    {selectedOption === 'rubros' && <Rubros />}
                </div>
            </Container >
        </div >
    );
};
export default CocineroPage;
