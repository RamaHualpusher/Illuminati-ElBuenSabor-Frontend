import React, { useState } from 'react';
import RubroIngrediente from './RubroIngredientes/RubroIngrediente';
import RubroProductos from './RubroProductos/RubroProductos';
import { Rubro } from '../../interface/Rubro';

const Stock: React.FC = () => {
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
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1>Rubros</h1>
      <div
        className="d-grid gap-2 d-md-block"
        style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: '20px' }}
      >
        <button
          className={`btn btn-primary rounded`}
          style={{
            width: '48%', // Se ajusta el ancho del botón a 48% del contenedor
            height: '50px',
            backgroundColor: selectedOption === 'rubroProductos' ? 'rgba(0, 0, 255, 1)' : 'initial'
          }}
          onClick={() => handleOptionChange('rubroProductos')}
        >
          Productos
        </button>
        <button
          className={`btn btn-primary rounded`}
          style={{
            width: '48%', // Se ajusta el ancho del botón a 48% del contenedor
            height: '50px',
            backgroundColor: selectedOption === 'rubroIngredientes' ? 'rgba(0, 0, 255, 1)' : 'initial'
          }}
          onClick={() => handleOptionChange('rubroIngredientes')}
        >
          Ingredientes
        </button>
      </div>
      <div style={{ marginTop: '20px' }}>
        {selectedOption === 'rubroProductos' && <RubroProductos />}
        {selectedOption === 'rubroIngredientes' && <RubroIngrediente />}
      </div>
    </div>
  );
};

export default Stock;
