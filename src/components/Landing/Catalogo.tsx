import React from "react";
import TarjetaComida from "./TarjetaComida";
import { ICatalogoProps } from "../../interface/ICatalogo";

const Catalogo: React.FC<ICatalogoProps> = ({ filteredProductos }) => {

  // Función para determinar la clase del contenedor de las tarjetas de comida en función del número total de tarjetas
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
    // Contenedor principal del catálogo
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <div>
        {/* Verificar si no hay productos filtrados */}
        {filteredProductos.length === 0 ? (
          // Mensaje de producto no encontrado
          <h4 className="display-4 mb-4 text-center">
            El producto en búsqueda no se encuentra.
            <br />
            <i className="bi bi-hand-thumbs-down"></i>
          </h4>
        ) : (
          // Mostrar el catálogo de productos
          <div className="row justify-content-center">
            {filteredProductos.map((producto, index) => (
              // Contenedor de cada tarjeta de comida
              <div
                className={`text-center ${getTarjetaComidaContainerClass(
                  filteredProductos.length
                )}`}
                key={index}
                style={{ marginBottom: "20px" }}
              >
                {/* Tarjeta de comida */}
                <TarjetaComida
                  producto={producto}
                  buttonText={"Agregar al Carrito"}
                  showButton={producto.maxCantidadProducto > 0} // Mostrar el botón si hay stock basado en maxCantidadProducto
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
