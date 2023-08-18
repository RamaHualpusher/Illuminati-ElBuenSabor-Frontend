import React, { FC } from "react";
import classNames from "classnames";

const ImagenMenu: FC = () => {
  return (
    <div className="d-flex justify-content-center mb-4">
      {/* La imagen se ajusta al ancho disponible, sin bordes y con estilo de imagen fluida */}
      <img
        className={classNames("img-fluid w-100")}
        src="/assets/img/pizza-carousell.png"
        alt="Imagen del menú"
        style={{
          borderRadius: "0%", // El borde redondeado se establece en 0%
        }}
      />
    </div>
  );
};

export default ImagenMenu;
