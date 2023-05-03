import React, { FC, useState } from "react";


const BotonesMenu: FC = () => {
    const [BotonesOpen, setBotonesOpen] = useState(false);

    const toggleBotones = () => {
        setBotonesOpen(!BotonesOpen);
    };
    return (
        <div className="fok">
        <ul>
          <li className="fak">
            <div className="frame-20">
              <div className="todos">Todos</div>
            </div>
            <div className="frame-19">
              <div className="ofertas">Ofertas</div>
            </div>
            <div className="frame-202">
              <div className="pizzas">Pizzas</div>
            </div>
            <div className="frame-21">
              <div className="burguer">Burguer</div>
            </div>
            <div className="frame-22">
              <div className="bebidas">Bebidas</div>
            </div>
          </li>
        </ul>
      </div>

    );
};

export default BotonesMenu;