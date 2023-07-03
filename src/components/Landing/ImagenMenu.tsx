import React, { FC } from "react";
import classNames from "classnames";

const ImagenMenu: FC = () => {
  return (
    <div className="d-flex justify-content-center mb-4">
      <img
        className={classNames("pizza-carousell-1", "img-fluid", "w-100")}
        src="/assets/img/pizza-carousell.png"
        alt="imagenMenu"
        style={{
          borderRadius: "0%",
        }}
      />
    </div>
  );
};

export default ImagenMenu;
