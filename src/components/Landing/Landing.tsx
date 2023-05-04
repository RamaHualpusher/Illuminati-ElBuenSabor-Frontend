import React from "react";
import BotonesMenu from '../Componentes/BotonesMenu';
import ImagenMenu from '../Componentes/ImagenMenu';
import { Navbar } from "react-bootstrap";

export default function Landing() {
  return (
    <div >
        <Navbar/>
      <h1 >Home</h1>
      <div >
        <ImagenMenu />
        <p >La mejor comida rápida</p>
        <BotonesMenu/>
        <div >
          <input placeholder="Busqueda" className="Search_Food"></input>
          <i className="fa-solid fa-magnifying-glass"></i>
        </div>
      </div>
    </div>
  );
}