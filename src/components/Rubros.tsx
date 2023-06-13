import { Route, Routes } from 'react-router-dom';
import RubrosIngredientesTable from './Tablas/RubroIngredientes';
import ProductosTable from './Tablas/RubroProducto';

function Rubros(): JSX.Element {
  return (
    <div>
      <h1>RUBROS</h1>
      <Routes>
        <Route path="/" element={<h1>Selecciona un rubro</h1>} />
        <Route path="/ingredientes" element={<RubrosIngredientesTable url="http://localhost:8080/api/rubros-ingredientes" />} />
        <Route path="/productos" element={<ProductosTable url="http://localhost:8080/api/rubros-productos" />} />
      </Routes>
    </div>
  );
}

export default Rubros;
