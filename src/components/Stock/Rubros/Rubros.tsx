import React, { useState } from 'react';
import RubroIngrediente from './RubroIngredientes/RubroIngrediente';
import RubroProductos from './RubroProductos/RubroProductos';
import { Button, Col, Row } from 'react-bootstrap';

const Rubros: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<"rubroProductos" | "rubroIngredientes">("rubroProductos");
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const handleSidebarToggle = () => {
    setSidebarVisible(!sidebarVisible);
  };

  // Cambiar la opción seleccionada (Rubros Productos o Rubros Ingredientes)
  const handleOptionChange = (option: "rubroProductos" | "rubroIngredientes") => {
    setSelectedOption(option);
  };

  return (
    <div>
      {/* Botones para cambiar entre Rubros Productos y Rubros Ingredientes */}
      <div className="d-grid gap-2 d-md-block text-center">
        <Row>
          <Col xs={12} md={6} lg={6} className="mx-auto mb-2">
            <Button
              className={`btn btn-primary rounded w-100 ${selectedOption === 'rubroProductos' ? 'btn-dark' : 'btn-secondary'}`}
              onClick={() => handleOptionChange('rubroProductos')}
            >
              Rubros Productos
            </Button>
          </Col>
          <Col xs={12} md={6} lg={6} className="mx-auto mb-2">
            <Button
              className={`btn btn-primary rounded w-100 ${selectedOption === 'rubroIngredientes' ? 'btn-dark' : 'btn-secondary'}`}
              onClick={() => handleOptionChange('rubroIngredientes')}
            >
              Rubros Ingredientes
            </Button>
          </Col>
        </Row>
      </div>

      {/* Mostrar el contenido correspondiente según la opción seleccionada */}
      <div style={{ marginTop: '20px' }}>
        {selectedOption === 'rubroProductos' && <RubroProductos />}
        {selectedOption === 'rubroIngredientes' && <RubroIngrediente />}
      </div>
    </div>
  );
};

export default Rubros;
