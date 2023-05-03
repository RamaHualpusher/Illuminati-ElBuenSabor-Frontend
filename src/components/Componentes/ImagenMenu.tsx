import React, { FC, useState } from "react";
import { Form } from "react-bootstrap";


const ImagenMenu: FC =() =>{
    
  

    return(
        <div className="container">
          <img
            className="pizza-carousell-1 me-2"
            src="/assets/img/pizza-carousell.jpg"
            alt="imagenMenu"
            style={{
              width: "1920px",
              height: "350px",
              borderRadius: "0%",
            }}
          /></div>
    )
}

export default ImagenMenu;