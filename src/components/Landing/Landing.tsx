import React, { useState } from "react";
import BotonesMenu from "./BotonesMenu";
import ImagenMenu from "./ImagenMenu";
import TarjetaComida from "./TarjetaComida";
import { Products } from "../../interface/interfaces";
import ComoFunc from "./ComoFunc";

export default function Landing() {
    const [selectedCategory, setSelectedCategory] = useState("Todos");

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
    };

    const productos: Products[] = [
        {
            Imagen: "assets/img/pizza_casera_31391_orig.jpg",
            Nombre: "Pizza",
            Rubro: "Pizzas",
            PrecioVenta: 5.99,
            TiempoCocina: 10,
            Estado: "Disponible",
            Descripcion: "Una deliciosa pizza con queso y pepperoni",
            Ingredients: [
                {
                    Ingredient: "Salsa de tomate",
                    Cuantity: "150 gr",
                    UMedida: "ml",
                },
                {
                    Ingredient: "Queso mozzarella",
                    Cuantity: "100 gr",
                    UMedida: "gr",
                },
                {
                    Ingredient: "Pepperoni",
                    Cuantity: "50 gr",
                    UMedida: "gr",
                },
            ],
        },
        {
            Imagen: "assets/img/la-hamburguesa-mucho-mas-que___0HXb0UR0v_2000x1500__1.webp",
            Nombre: "Hamburguesa",
            Rubro: "Hamburguesas",
            PrecioVenta: 6.99,
            TiempoCocina: 8,
            Estado: "Disponible",
            Descripcion: "Una deliciosa hamburguesa con queso, lechuga y tomate",
            Ingredients: [
                {
                    Ingredient: "Pan de hamburguesa",
                    Cuantity: "1 unidad",
                    UMedida: "unidad",
                },
                {
                    Ingredient: "Carne de res",
                    Cuantity: "150 gr",
                    UMedida: "gr",
                },
                {
                    Ingredient: "Queso cheddar",
                    Cuantity: "50 gr",
                    UMedida: "gr",
                },
                {
                    Ingredient: "Lechuga",
                    Cuantity: "50 gr",
                    UMedida: "gr",
                },
                {
                    Ingredient: "Tomate",
                    Cuantity: "50 gr",
                    UMedida: "gr",
                },
            ],
        },
        {
            Imagen: "assets/img/la-hamburguesa-mucho-mas-que___0HXb0UR0v_2000x1500__1.webp",
            Nombre: "Hamburguesa",
            Rubro: "Hamburguesas",
            PrecioVenta: 6.99,
            TiempoCocina: 8,
            Estado: "Disponible",
            Descripcion: "Una deliciosa hamburguesa con queso, lechuga y tomate",
            Ingredients: [
                {
                    Ingredient: "Pan de hamburguesa",
                    Cuantity: "1 unidad",
                    UMedida: "unidad",
                },
                {
                    Ingredient: "Carne de res",
                    Cuantity: "150 gr",
                    UMedida: "gr",
                },
                {
                    Ingredient: "Queso cheddar",
                    Cuantity: "50 gr",
                    UMedida: "gr",
                },
                {
                    Ingredient: "Lechuga",
                    Cuantity: "50 gr",
                    UMedida: "gr",
                },
                {
                    Ingredient: "Tomate",
                    Cuantity: "50 gr",
                    UMedida: "gr",
                },
            ],
        },
        {
            Imagen: "assets/img/la-hamburguesa-mucho-mas-que___0HXb0UR0v_2000x1500__1.webp",
            Nombre: "Hamburguesa",
            Rubro: "Hamburguesas",
            PrecioVenta: 6.99,
            TiempoCocina: 8,
            Estado: "Disponible",
            Descripcion: "Una deliciosa hamburguesa con queso, lechuga y tomate",
            Ingredients: [
                {
                    Ingredient: "Pan de hamburguesa",
                    Cuantity: "1 unidad",
                    UMedida: "unidad",
                },
                {
                    Ingredient: "Carne de res",
                    Cuantity: "150 gr",
                    UMedida: "gr",
                },
                {
                    Ingredient: "Queso cheddar",
                    Cuantity: "50 gr",
                    UMedida: "gr",
                },
                {
                    Ingredient: "Lechuga",
                    Cuantity: "50 gr",
                    UMedida: "gr",
                },
                {
                    Ingredient: "Tomate",
                    Cuantity: "50 gr",
                    UMedida: "gr",
                },
            ],
        },
    ];

    const filteredProductos =
        selectedCategory === "Todos"
            ? productos
            : productos.filter((producto) => producto.Rubro === selectedCategory);

    const getTarjetaComidaContainerClass = (totalTarjetas: number) => {
        if (totalTarjetas <= 1) {
            return "col-md-12";
        } else if (totalTarjetas === 2) {
            return "col-md-6";
        } else if (totalTarjetas === 3) {
            return "col-md-4";
        } else {
            return "col-md-3";
        }
    };

    return (
        <div>
            <ImagenMenu />
            <BotonesMenu
                onCategoryChange={handleCategoryChange}
                selectedCategory={selectedCategory}
            />
            <div className="d-flex justify-content-center mt-3">
                <div className="row">
                    {filteredProductos.map((producto, index) => (
                        <div
                            className={`mx-auto text-center ${getTarjetaComidaContainerClass(
                                filteredProductos.length
                            )}`}
                            key={index}
                        >
                            <TarjetaComida
                                imageSrc={producto.Imagen}
                                title={producto.Nombre}
                                text={producto.Descripcion}
                                buttonText={"Agregar al Carrito"}
                            />
                        </div>
                    ))}
                </div>
            </div>
            <ComoFunc backgroundImage={"/assets/img/FondoComoFunc.jpg"} />
        </div>
    );
}
