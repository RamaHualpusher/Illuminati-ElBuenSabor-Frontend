import React, { useState } from 'react';
import RankingAlimento from './RanKingAlimento';
import RankingBebidas from './RankingBebidas';
import { Button, Col, Row } from 'react-bootstrap';

const Rubros: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<"bebida" | "alimento">("bebida");
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const handleSidebarToggle = () => {
    setSidebarVisible(!sidebarVisible);
  };

  // Cambiar la opción seleccionada (Rubros Productos o Rubros Ingredientes)
  const handleOptionChange = (option: "bebida" | "alimento") => {
    setSelectedOption(option);
  };

  return (
    <div>
      {/* Botones para cambiar entre Rubros Productos y Rubros Ingredientes */}
      <div className="d-grid gap-2 d-md-block text-center">
        <Row>
          <Col xs={12} md={6} lg={6} className="mx-auto mb-2">
            <Button
              className={`btn btn-primary rounded w-100 ${selectedOption === 'bebida' ? 'btn-dark' : 'btn-secondary'}`}
              onClick={() => handleOptionChange('bebida')}
            >
              Rubros Productos
            </Button>
          </Col>
          <Col xs={12} md={6} lg={6} className="mx-auto mb-2">
            <Button
              className={`btn btn-primary rounded w-100 ${selectedOption === 'alimento' ? 'btn-dark' : 'btn-secondary'}`}
              onClick={() => handleOptionChange('alimento')}
            >
              Rubros Ingredientes
            </Button>
          </Col>
        </Row>
      </div>

      {/* Mostrar el contenido correspondiente según la opción seleccionada */}
      <div style={{ marginTop: '20px' }}>
        {selectedOption === 'bebida' && <RankingBebidas />}
        {selectedOption === 'alimento' && <RankingAlimento />}
      </div>
    </div>
  );
};

export default Rubros;
