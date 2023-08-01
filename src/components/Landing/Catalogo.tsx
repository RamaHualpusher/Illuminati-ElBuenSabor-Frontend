import React, { useState } from "react";
import TarjetaComida from "./TarjetaComida";
import { ICatalogoProps } from "../../interface/ICatalogo";

const Catalogo: React.FC<ICatalogoProps> = ({ filteredProductos }) => {
  const [showButton, setShowButton] = useState(false);

  const getTarjetaComidaContainerClass = (totalTarjetas: number) => {
    if (totalTarjetas <= 1) {
      return "col-md-12";
    } else if (totalTarjetas === 2) {
      return "col-md-6";
    } else if (totalTarjetas === 3) {
      return "col-md-4";
    } else {
      return "col-md-3";
    }
  };

  return (
    <div className=" d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <div>
        {filteredProductos.length === 0 ? (
          <h4 className="display-4 mb-4 text-center">
            El producto en búsqueda no se encuentra.
            <br />
            <i className="bi bi-hand-thumbs-down"></i>
          </h4>
        ) : (
          <div className="row justify-content-center">
            {filteredProductos.map((producto, index) => (

              <div
                className={`text-center ${getTarjetaComidaContainerClass(
                  filteredProductos.length
                )}`}
                key={index}
                style={{ marginBottom: "20px" }}
              >

                <TarjetaComida
                  producto={producto}
                  buttonText={"Agregar al Carrito"}
                  showButton={producto.stockActual > 0 ? true : false}
                />

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalogo;
