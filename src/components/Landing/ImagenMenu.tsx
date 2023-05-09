import React, { FC } from "react";


const ImagenMenu: FC = () => {



  return (
    <div className="container-fluid w-100 d-flex justify-content-center">
      <img
        className="pizza-carousell-1"
        src="/assets/img/pizza-carousell.png"
        alt="imagenMenu"
        style={{
          width: "100vw",
          height: "350px",
          borderRadius: "0%",
        }}
      />
    </div>

  )
}

export default ImagenMenu;