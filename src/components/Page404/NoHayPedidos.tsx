import React from 'react';

interface NoHayPedidosProps {
  onReload: () => void; // Función para recargar la página de Delivery
}

const NoHayPedidos: React.FC<NoHayPedidosProps> = ({ onReload }) => {
  return (
    <div className="container mt-5">
      <div className="text-center" style={{ marginTop: '100px', marginBottom: '50px' }}>
        <h2>No hay pedidos para mostrar</h2>
        <div style={{ fontSize: '100px',color: '#FFA500' }}>
          <i className="bi bi-emoji-frown"></i>
        </div>
        <p className="lead">Lo sentimos, no hay pedidos disponibles en este momento.</p>
        <button className="btn btn-primary" onClick={onReload}>
          Recargar página
        </button>
      </div>
    </div>
  );
};

export default NoHayPedidos;
