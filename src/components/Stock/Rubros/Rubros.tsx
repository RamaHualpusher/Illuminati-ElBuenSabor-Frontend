import React, { useEffect, useState } from 'react';
import RubroIngrediente from './RubroIngredientes/RubroIngrediente';
import RubroProductos from './RubroProductos/RubroProductos';
import { Button, Col, Row } from 'react-bootstrap';
import axios from 'axios';
import { IRubroNew } from '../../../interface/IRubro';

const Rubros: React.FC = () => {
  const [categoriaIngrediente, setCategoriaIngrediente] = useState<IRubroNew[]>([]);
  const [categoriaProducto, setCategoriaProducto] = useState<IRubroNew[]>([]);
  const [rubroProducto, setRubroProducto] = useState<IRubroNew[]>([]);
  const [rubroIngrediente, setRubroIngrediente] = useState<IRubroNew[]>([]);
  const [selectedOption, setSelectedOption] = useState<"rubroProductos" | "rubroIngredientes">("rubroProductos");
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const API_URL = process.env.REACT_APP_API_URL || "";

  // Definir la función fetchData fuera del useEffect para que sea accesible en todo el componente
  const fetchData = async () => {
    try {
      const response = await axios.get<IRubroNew[]>(`${API_URL}rubro`);
      const data = await response.data;
      const categoriaIngredienteData = data.filter((rubro: IRubroNew) => rubro.ingredientOwner && rubro.rubroPadre === null);
      const categoriaProductoData = data.filter((rubro: IRubroNew) => !rubro.ingredientOwner && rubro.rubroPadre === null);
      const rubroProductoData = data.filter((rubro: IRubroNew) => !rubro.ingredientOwner && rubro.rubroPadre !== null);
      const rubroIngredienteData = data.filter((rubro: IRubroNew) => rubro.ingredientOwner && rubro.rubroPadre !== null);
      setCategoriaIngrediente(categoriaIngredienteData);
      setCategoriaProducto(categoriaProductoData);
      setRubroProducto(rubroProductoData);
      setRubroIngrediente(rubroIngredienteData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData(); // Llamar a la función para obtener los datos al cargar el componente
  }, []);
  
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
        {selectedOption === 'rubroProductos' && <RubroProductos rubros={rubroProducto} categorias={categoriaProducto} onRubroChange={() => fetchData()}/>}
        {selectedOption === 'rubroIngredientes' && <RubroIngrediente rubros={rubroIngrediente} categorias={categoriaIngrediente} onRubroChange={() => fetchData()}/>}
      </div>
    </div>
  );
};

export default Rubros;