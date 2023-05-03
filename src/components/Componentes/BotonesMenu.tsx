import React, { FC, useState } from "react";
import { Form } from "react-bootstrap";


const BotonesMenu: FC = () => {
    const [BotonesOpen, setBotonesOpen] = useState(false);

    const toggleBotones = () => {
        setBotonesOpen(!BotonesOpen);
    };

    const [selectedOption, setSelectedOption] = useState("option1");

    const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedOption(event.target.value);
    };
    return (
      
        <Form>
            <Form.Group>
                <Form.Label>
                    <div>
                        <Form.Check
                            type="radio"
                            label={<i className="bi bi-0-square-fill">Todos</i>}
                            name="option"
                            value="Todos"
                            checked={selectedOption === "Todos"}
                            onChange={handleOptionChange}
                            inline
                        />
                        <Form.Check
                            type="radio"
                            label={<i className="bi bi-tag-fill">Ofertas</i>}
                            name="option"
                            value="Ofertas"
                            checked={selectedOption === "Ofertas"}
                            onChange={handleOptionChange}
                            inline
                        />
                        <Form.Check
                            type="radio"
                            label={<i className="bi bi-1-square-fill">Pizza</i>}
                            name="option"
                            value="Pizzas"
                            checked={selectedOption === "Pizzas"}
                            onChange={handleOptionChange}
                            inline
                        />
                        <Form.Check
                            type="radio"
                            label={<i className="bi bi-2-square-fill">Burguer</i>}
                            name="option"
                            value="Burguer"
                            checked={selectedOption === "Burguer"}
                            onChange={handleOptionChange}
                            inline
                        />
                        <Form.Check
                            type="radio"
                            label={<i className="bi bi-3-square-fill">Bebidas</i>}
                            name="option"
                            value="Bebidas"
                            checked={selectedOption === "Bebidas"}
                            onChange={handleOptionChange}
                            inline
                        />
                    </div>
                </Form.Label>
            </Form.Group>
        </Form>
    )


}

export default BotonesMenu;