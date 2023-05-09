import React from "react";
import BotonesMenu from './BotonesMenu';
import ImagenMenu from './ImagenMenu';
import TarjetaComida from './TarjetaComida';
import { Products } from '../../types/types';
import ComoFunc from "./ComoFunc";
import FoodSearch from "./FoodSearch";


export default function Landing() {
    
    // const handleSearch = (searchTerm: string) => {
    //     console.log(`Searching for "${searchTerm}"...`);
    //     // Lógica para buscar comidas aquí
    //   };

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
            <div  style={{ background: "linear-gradient(to bottom, #fff, #cccc)"}}  >
                <ImagenMenu />
                <BotonesMenu />
                {/* <FoodSearch onSearch={handleSearch}/> */} 
                {/* Aca deberia implementarse esto y en la linea 12 crear la logica de busqueda */}

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
            
            <ComoFunc backgroundImage={""}/>

        </div>

    );
}