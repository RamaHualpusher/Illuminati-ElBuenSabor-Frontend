import React, { useEffect, useState, useContext } from "react";
import BotonesMenu from "./BotonesMenu";
import ImagenMenu from "./ImagenMenu";
import TarjetaComida from "./TarjetaComida";
import ComoFunc from "./ComoFunc";
import { ProductoManufacturado } from "../../interface/ProductoManufacturado";
import { CartContext } from "../CarritoCompras/CartProvider";
import { SearchContext } from "../Buscador/SearchContext";

export default function Landing() {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [produc, setProduc] = useState<ProductoManufacturado[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductoManufacturado[]>([]);
  const { addToCart, cartItems} = useContext(CartContext); 
  const { searchParam } = useContext(SearchContext);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('assets/data/productosLanding.json');
        const data = await response.json();
        setProduc(data);
        setFilteredProducts(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    // Filtrar productos según el parámetro de búsqueda
    const filteredProductos = produc.filter((producto) =>
      producto.nombre.toLowerCase().includes(searchParam.toLowerCase())
    );

    // Actualizar la lista de productos filtrados
    setFilteredProducts(filteredProductos);
  }, [searchParam, produc]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const filteredProductos =
    selectedCategory === "Todos"
      ? filteredProducts
      : filteredProducts.filter((producto) => producto.Rubro.nombre === selectedCategory);

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
    <div className="mt-5">
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
                id={producto.idProductoManufacturado}
                imageSrc={producto.imagen}
                title={producto.nombre}
                text={producto.preparacion}
                buttonText={"Agregar al Carrito"}
                onButtonClick={() =>
                  addToCart({
                    id: producto.idProductoManufacturado,
                    name: producto.nombre,
                    quantity: 1,
                    price: 100 + Math.floor(Math.random() * 400), //aleatorio entre 100 y 500
                    image: producto.imagen,
                    title: producto.nombre,
                  })
                }
              />
            </div>
          ))}
        </div>
      </div>
      <ComoFunc backgroundImage={"/assets/img/FondoComoFunc.jpg"} />
    </div>
  );
}

