import React, { FC, useState } from "react";
import { Form } from "react-bootstrap";

const BotonesMenu: FC = () => {
  const [selectedOption, setSelectedOption] = useState("Todos");

  const handleOptionChange = (event: React.MouseEvent<HTMLButtonElement>) => {
    setSelectedOption(event.currentTarget.value);
  };

  return (
    <Form>
      <Form.Group>
        <Form.Label>
          <div>
            <button
              type="button"
              className={`btn ${selectedOption === "Todos" ? "btn-primary" : "btn-outline-primary"}`}
              value="Todos"
              onClick={handleOptionChange}
            >
              <i className="bi bi-0-square-fill"/> Todos
            </button>
            <button
              type="button"
              className={`btn ${selectedOption === "Ofertas" ? "btn-primary" : "btn-outline-primary"}`}
              value="Ofertas"
              onClick={handleOptionChange}
            >
              <i className="bi bi-tag-fill"/> Ofertas
            </button>
            <button
              type="button"
              className={`btn ${selectedOption === "Pizzas" ? "btn-primary" : "btn-outline-primary"}`}
              value="Pizzas"
              onClick={handleOptionChange}
            >
              <i className="bi bi-1-square-fill"/> Pizza
            </button>
            <button
              type="button"
              className={`btn ${selectedOption === "Burguer" ? "btn-primary" : "btn-outline-primary"}`}
              value="Burguer"
              onClick={handleOptionChange}
            >
              <i className="bi bi-2-square-fill"/> Burguer
            </button>
            <button
              type="button"
              className={`btn ${selectedOption === "Bebidas" ? "btn-primary" : "btn-outline-primary"}`}
              value="Bebidas"
              onClick={handleOptionChange}
            >
              <i className="bi bi-3-square-fill"/> Bebidas
            </button>
          </div>
        </Form.Label>
      </Form.Group>
    </Form>
  );
};

export default BotonesMenu;
