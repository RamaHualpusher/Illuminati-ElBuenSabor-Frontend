import React from 'react';

interface NoHayElementosTablaGenericaProps {
  onReload: () => void; // Función para recargar la página
}

const NoHayElementosTablaGenerica: React.FC<NoHayElementosTablaGenericaProps> = ({ onReload }) => {
  return (
    <div className="container mt-5">
      <div className="text-center" style={{ marginTop: '100px', marginBottom: '50px' }}>
        <h2>No se encontraron elementos para mostrar</h2>
        <div style={{ fontSize: '100px', color: '#FFA500' }}>
          <i className="bi bi-emoji-frown"></i>
        </div>
        <p className="lead">Lo sentimos, no hay elementos disponibles en este momento.</p>
        <button className="btn btn-primary" onClick={onReload}>
          Recargar página
        </button>
      </div>
    </div>
  );
};

export default NoHayElementosTablaGenerica;