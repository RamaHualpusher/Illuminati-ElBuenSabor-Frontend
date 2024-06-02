import React, { FC } from "react";
import { Form, Button } from "react-bootstrap";
import { IBotonMenu, IBotonesMenuProps } from "../../interface/IBotonesMenu";

const BotonesMenu: FC<IBotonesMenuProps> = ({
  selectedCategory,
  onCategoryChange,
}) => {
  // Definir los botones de categoría con sus valores, etiquetas e iconos
  const buttons: IBotonMenu[] = [
    {
      value: "Todos",
      label: "Todos",
      icon: "bi bi-grid-3x3-gap",
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

  // Función para manejar el cambio de categoría
  const handleOptionChange = (category: string) => {
    onCategoryChange(category); // Llamar a la función proporcionada para cambiar la categoría
  };

  return (
    // Formulario de botones de categoría
    <Form className="d-flex justify-content-center align-items-center flex-wrap">
      {buttons.map((button) => (
        // Botón de categoría
        <Button
          key={button.value}
          variant={selectedCategory === button.value ? "dark" : "outline-secondary"}
          onClick={() => handleOptionChange(button.value)}
          className="me-3 mb-3 border-0"
          style={{ minWidth: "100px" }}
        >
          {button.label}
          <br />
          <i className={button.icon} style={{ fontSize: "260%" }} />
        </Button>
      ))}
    </Form>
  );
};

export default BotonesMenu;
