import React from "react";
import TarjetaComida from "./TarjetaComida";
import { Producto } from "../../interface/Producto";

interface CatalogoProps {
  filteredProductos: Producto[];
}

const Catalogo: React.FC<CatalogoProps> = ({ filteredProductos }) => {
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
    <div className="d-flex justify-content-center mt-3">
      <div className="row">
        {filteredProductos.map((producto, index) => (
          <div
            className={`mx-auto text-center ${getTarjetaComidaContainerClass(
              filteredProductos.length
            )}`}
            key={index}
          >
            <TarjetaComida
              producto={producto}
              buttonText={"Agregar al Carrito"}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Catalogo;
