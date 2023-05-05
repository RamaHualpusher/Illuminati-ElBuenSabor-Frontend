import React, { FC, useState } from "react";
import { Form } from "react-bootstrap";


const ImagenMenu: FC =() =>{
    
  

    return(
        <div className="container-fluid w-100">
          <img
            className="pizza-carousell-1"
            src="/assets/img/pizza-carousell.png"
            alt="imagenMenu"
            style={{
              width: "100%",
              height: "350px",
              borderRadius: "0%",
            }}
          /></div>
    )
}

export default ImagenMenu;