import React from "react";
import BotonesMenu from './BotonesMenu';
import ImagenMenu from '../Componentes/ImagenMenu';
import TarjetaComida from '../Componentes/TarjetaComida';
import { Products } from '../../types/types';



export default function Landing() {
    const producto1: Products = {
        Imagen: 'assets/img/pizza_casera_31391_orig.jpg',
        Nombre: 'Pizza',
        Rubro: 'Comida rápida',
        PrecioVenta: 5.99,
        TiempoCocina: 10,
        Estado: 'Disponible',
        Descripcion: 'Una deliciosa hamburguesa con queso, lechuga y tomate',
        Ingredients: [
            {
                Ingredient: "Salsa de tomate",
                Cuantity: "150 gr",
                UMedida: "ml"
            },
            {
                Ingredient: "Queso mozzarella",
                Cuantity: "100 gr",
                UMedida: "gr"
            },
            {
                Ingredient: "Albahaca fresca",
                Cuantity: "10 hojas",
                UMedida: "unidades"
            }
        ],
    };

    return (
        <div >
            <h1 className="display-1">Home</h1>
            <div >
                <ImagenMenu />
                <h1 className="display-6"><strong>La mejor comida rápida</strong></h1>
                <BotonesMenu />
                <div >
                    <input placeholder="Busqueda" className="Search_Food" style={{ marginRight: "10px" }}></input>
                    <i className="bi bi-search"></i>
                </div>

                <div className="d-flex justify-content-center mt-3">
                    <div className="card w-75">
                        <div className="row justify-content-center no-gutters mb-3 mt-3">
                            <div className="col-md-4">
                                <div className="mx-auto text-center">
                                    <TarjetaComida imageSrc={producto1.Imagen} title={producto1.Nombre} text={producto1.Descripcion} buttonText={"Agregar al Carrito"} />
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="mx-auto text-center">
                                    <TarjetaComida imageSrc={producto1.Imagen} title={producto1.Nombre} text={producto1.Descripcion} buttonText={"Agregar al Carrito"} />
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="mx-auto text-center">
                                    <TarjetaComida imageSrc={producto1.Imagen} title={producto1.Nombre} text={producto1.Descripcion} buttonText={"Agregar al Carrito"} />
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="mx-auto text-center">
                                    <TarjetaComida imageSrc={producto1.Imagen} title={producto1.Nombre} text={producto1.Descripcion} buttonText={"Agregar al Carrito"} />
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="mx-auto text-center">
                                    <TarjetaComida imageSrc={producto1.Imagen} title={producto1.Nombre} text={producto1.Descripcion} buttonText={"Agregar al Carrito"} />
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="mx-auto text-center">
                                    <TarjetaComida imageSrc={producto1.Imagen} title={producto1.Nombre} text={producto1.Descripcion} buttonText={"Agregar al Carrito"} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>



            </div>
        </div>
    );
}