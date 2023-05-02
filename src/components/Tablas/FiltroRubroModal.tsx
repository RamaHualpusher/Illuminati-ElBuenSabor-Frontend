import React, { useState } from 'react';

type DropdownProps = {
  options: string[];
}

function DropdownButton({ options }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionClick = (option: string) => {
    console.log(`Selected option: ${option}`);
    setIsOpen(false);
  }

  return (
    <div className="dropdown">
      <button className="dropdown-toggle" onClick={toggleDropdown}>
        Seleccione una opción
      </button>
      {isOpen && (
        <ul className="dropdown-menu">
          <li onClick={() => handleOptionClick('Todos')}>Todos</li>
          <li onClick={() => handleOptionClick('Lácteos')}>Lácteos</li>
          <li onClick={() => handleOptionClick('Carne')}>Carne</li>
          <li onClick={() => handleOptionClick('Verduras')}>Verduras</li>
        </ul>
      )}
    </div>
  );
}

export default DropdownButton;