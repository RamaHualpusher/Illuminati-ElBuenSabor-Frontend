import React, { useState } from 'react';
import Ingredientes from './Ingrediente/Ingrediente';
import Productos from './Producto/Productos';

const Stock: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<"productos" | "ingredientes">("productos");
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const handleSidebarToggle = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const handleOptionChange = (option: "productos" | "ingredientes") => {
    setSelectedOption(option);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1>Stock</h1>
      <div
        className="d-grid gap-2 d-md-block"
        style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: '20px' }}
      >
        <button
          className={`btn btn-primary rounded`}
          style={{
            width: '48%', // Se ajusta el ancho del botón a 48% del contenedor
            height: '50px',          
            backgroundColor: selectedOption === 'productos' ? 'rgba(0, 0, 255, 1)' : 'initial'
          }}
          onClick={() => handleOptionChange('productos')}
        >
          Productos
        </button>
        <button
          className={`btn btn-primary rounded`}
          style={{
            width: '48%', // Se ajusta el ancho del botón a 48% del contenedor
            height: '50px',
            backgroundColor: selectedOption === 'ingredientes' ? 'rgba(0, 0, 255, 1)' : 'initial'
          }}
          onClick={() => handleOptionChange('ingredientes')}
        >
          Ingredientes
        </button>
      </div>
      <div style={{ marginTop: '20px' }}>
        {selectedOption === 'productos' && <Productos />}
        {selectedOption === 'ingredientes' && <Ingredientes />}
      </div>
    </div>
  );
};

export default Stock;
