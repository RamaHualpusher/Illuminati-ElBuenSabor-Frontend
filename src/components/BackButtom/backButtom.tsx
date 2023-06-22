import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function BackButton() {
  const navigate = useNavigate();
  const location = useLocation();

  const goBack = () => {
    window.history.go(-1);
  };

  return (
    <button className="btn btn-primary" onClick={goBack}>
      <i className="bi bi-arrow-left"></i>
    </button>
  );
}

export default BackButton;



  