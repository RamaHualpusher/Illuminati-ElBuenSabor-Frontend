import React from 'react';
import { useNavigate } from 'react-router-dom';

function BackButton() {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <button className="btn btn-primary" onClick={goBack}>
     <i className="bi bi-arrow-left"></i>
    </button>
  );
}

export default BackButton;


  