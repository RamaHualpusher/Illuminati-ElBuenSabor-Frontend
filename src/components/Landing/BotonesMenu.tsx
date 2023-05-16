import React, { FC } from "react";
import { Form } from "react-bootstrap";

interface Button {
  value: string;
  label: string;
  icon: string;
}

interface BotonesMenuProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const buttonStyle = {
  marginRight: "100px",
  border: "none",
  outline: "none",
};

const iconStyle = {
  fontSize: "260%",
};

const BotonesMenu: FC<BotonesMenuProps> = ({
  selectedCategory,
  onCategoryChange,
}) => {
  const buttons: Button[] = [
    {
      value: "Todos",
      label: "Todos",
      icon: "bi bi-grid-3x3-gap",
    },
    {
      value: "Ofertas",
      label: "Ofertas",
      icon: "bi bi-tag-fill",
    },
    {
      value: "Pizzas",
      label: "Pizza",
      icon: "bi bi-fan",
    },
    {
      value: "Hamburguesas",
      label: "Hamburguesas",
      icon: "bi bi-slack",
    },
    {
      value: "Bebidas",
      label: "Bebidas",
      icon: "bi bi-cup-straw",
    },
  ];

  const handleOptionChange = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    const category = event.currentTarget.value;
    onCategoryChange(category);
  };

  return (
    <Form className="d-flex justify-content-center align-items-center">
      <Form.Group>
        <Form.Label>
          <div>
            {buttons.map((button) => (
              <button
                key={button.value}
                type="button"
                className={`btn ${selectedCategory === button.value ? "btn btn-dark" : "btn-outline-secondary"
                  }`}
                value={button.value}
                onClick={handleOptionChange}
                style={buttonStyle}
              >
                {button.label}
                <br />
                <i className={button.icon} style={iconStyle} />
              </button>
            ))}
          </div>
        </Form.Label>
      </Form.Group>
    </Form>
  );
};

export default BotonesMenu;
