import React, { FC } from "react";

const ImagenMenu: FC = () => {
  return (
    <div className="d-flex justify-content-center" style={{marginBottom:"20px"}}>
      <img
        className="pizza-carousell-1"
        src="/assets/img/pizza-carousell.png"
        alt="imagenMenu"
        style={{
          width: "100%",
          height: "350px",
          borderRadius: "0%",
        }}
      />
    </div>
  )
}

export default ImagenMenu;
