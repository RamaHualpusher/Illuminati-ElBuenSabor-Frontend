import React, { FC } from "react";
import { Form } from "react-bootstrap";

interface BotonesMenuProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const BotonesMenu: FC<BotonesMenuProps> = ({
  selectedCategory,
  onCategoryChange,
}) => {
  const buttonStyle = {
    marginRight: "100px",
    border: "none",
    outline: "none",
  };

  const iconStyle = {
    fontSize: "260%",
  };

  const handleOptionChange = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    const category = event.currentTarget.value;
    onCategoryChange(category);
  };

  return (
    <Form>
      <Form.Group>
        <Form.Label>
          <div>
            <button
              type="button"
              className={`btn ${selectedCategory === "Todos" ? "btn btn-dark" : "btn-outline-secondary"
                }`}
              value="Todos"
              onClick={handleOptionChange}
              style={buttonStyle}
            >
              Todos
              <br />
              <i className="bi bi-grid-3x3-gap" style={iconStyle} />
            </button>
            <button
              type="button"
              className={`btn ${selectedCategory === "Ofertas" ? "btn btn-dark" : "btn-outline-secondary"
                }`}
              value="Ofertas"
              onClick={handleOptionChange}
              style={buttonStyle}
            >
              Ofertas
              <br />
              <i className="bi bi-tag-fill" style={iconStyle} />
            </button>
            <button
              type="button"
              className={`btn ${selectedCategory === "Pizzas" ? "btn btn-dark" : "btn-outline-secondary"
                }`}
              value="Pizzas"
              onClick={handleOptionChange}
              style={buttonStyle}
            >
              Pizza
              <br />
              <i className="bi bi-fan" style={iconStyle} />
            </button>
            <button
              type="button"
              className={`btn ${selectedCategory === "Hamburguesas" ? "btn btn-dark" : "btn-outline-secondary"
                }`}
              value="Hamburguesas"
              onClick={handleOptionChange}
              style={buttonStyle}
            >
              Hamburguesas
              <br />
              <i className="bi bi-slack" style={iconStyle} />
            </button>
            <button
              type="button"
              className={`btn ${selectedCategory === "Bebidas" ? "btn btn-dark" : "btn-outline-secondary"
                }`}
              value="Bebidas"
              onClick={handleOptionChange}
              style={{ ...buttonStyle, marginRight: "0" }}
            >
              Bebidas
              <br />
              <i className="bi bi-cup-straw" style={iconStyle} />
            </button>
          </div>
        </Form.Label>
      </Form.Group>
    </Form>
  );
};

export default BotonesMenu;
