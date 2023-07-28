import React, { useState } from 'react';
import RubroIngrediente from './RubroIngredientes/RubroIngrediente';
import RubroProductos from './RubroProductos/RubroProductos';
import { Rubro } from '../../../interface/Rubro';
import { Button, Col, Row } from 'react-bootstrap';

const Rubros: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<"rubroProductos" | "rubroIngredientes">("rubroProductos");
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [rubros, setRubros] = useState<Rubro[]>([]);

  const API_URL_Ingrediente = "assets/data/rubrosIngredientesEjemplo.json";
  const API_URL_Producto = "assets/data/rubrosProductosEjemplo.json";

  const handleSidebarToggle = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const handleOptionChange = (option: "rubroProductos" | "rubroIngredientes") => {
    setSelectedOption(option);
  };

  return (
    <div>

      <div className="d-grid gap-2 d-md-block text-center">
        <Row>
          <Col xs={12} md={6} lg={6} className="mx-auto mb-2">
            <Button
              className={`btn btn-primary rounded w-100 ${selectedOption === 'rubroProductos' ? 'btn-dark' : 'btn-secondary'}`}
              onClick={() => handleOptionChange('rubroProductos')}
            >
              Productos
            </Button>
          </Col>
          <Col xs={12} md={6} lg={6} className="mx-auto mb-2">
            <Button
              className={`btn btn-primary rounded w-100 ${selectedOption === 'rubroIngredientes' ? 'btn-dark' : 'btn-secondary'}`}
              onClick={() => handleOptionChange('rubroIngredientes')}
            >
              Ingredientes
            </Button>
          </Col>
        </Row>
      </div>
      <div style={{ marginTop: '20px' }}>
        {selectedOption === 'rubroProductos' && <RubroProductos />}
        {selectedOption === 'rubroIngredientes' && <RubroIngrediente />}
      </div>
    </div>
  );
};

export default Rubros;
