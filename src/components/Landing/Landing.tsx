import React from "react";
import BotonesMenu from '../Componentes/BotonesMenu';
import ImagenMenu from '../Componentes/ImagenMenu';
import TarjetaComida from '../Componentes/TarjetaComida';
import {Products} from '../../types/types';

export default function Landing() {
  return (
    <div >

      <h1 >Home</h1>
      <div >
        <ImagenMenu />
        <p >La mejor comida rápida</p>
        <BotonesMenu/>
        <div >
          <input placeholder="Busqueda" className="Search_Food" style={{marginRight: "10px"}}></input>
          <i className="bi bi-search"></i>
        </div>
        <div>
            <TarjetaComida imageSrc={""} title={""} text={""} buttonText={""} />
        </div>
      </div>
    </div>
  );
}