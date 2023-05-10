import React, { FC, useState } from "react";
import { Form } from "react-bootstrap";

const BotonesMenu: FC = () => {
  const [selectedOption, setSelectedOption] = useState("Todos");

  const handleOptionChange = (event: React.MouseEvent<HTMLButtonElement>) => {
    setSelectedOption(event.currentTarget.value);
  };

  const buttonStyle = {
    marginRight: "100px",
    border: "none",
    outline: "none"
  };

  const iconStyle = {
    fontSize: "260%"
  };

  return (
    <Form>
      <Form.Group>
        <Form.Label>
          <div>
            <button 
              type="button"
              className={` btn ${selectedOption === "Todos" ? "btn btn-dark" : "btn-outline-secondary"}`}
              value="Todos"
              onClick={handleOptionChange}
              style={buttonStyle}
            >
              Todos
              <br />
              <i className="bi bi-grid-3x3-gap" style={iconStyle}/>
            </button>
            <button
              type="button"
              className={`btn ${selectedOption === "Ofertas" ? "btn btn-dark" : "btn-outline-secondary"}`}
              value="Ofertas"
              onClick={handleOptionChange}
              style={buttonStyle}
            >
              Ofertas
              <br />
              <i className="bi bi-tag-fill" style={iconStyle}/>
            </button>
            <button
              type="button"
              className={`btn ${selectedOption === "Pizzas" ? "btn btn-dark" : "btn-outline-secondary"}`}
              value="Pizzas"
              onClick={handleOptionChange}
              style={buttonStyle}
            >
              Pizza
              <br />
              <i className="bi bi-fan" style={iconStyle}/>
            </button>
            <button
              type="button"
              className={`btn ${selectedOption === "Burguer" ? "btn btn-dark" : "btn-outline-secondary"}`}
              value="Burguer"
              onClick={handleOptionChange}
              style={buttonStyle}
            >
              Burguer
              <br />
              <i className="bi bi-slack" style={iconStyle}/>
            </button>
            <button
              type="button"
              className={`btn ${selectedOption === "Bebidas" ? "btn btn-dark" : "btn-outline-secondary"}`}
              value="Bebidas"
              onClick={handleOptionChange}
              style={{...buttonStyle, marginRight: "0"}}
            >
              Bebidas
              <br />
              <i className="bi bi-cup-straw" style={iconStyle}/>
            </button>
          </div>
        </Form.Label>
      </Form.Group>
    </Form>
  );
};

export default BotonesMenu;



