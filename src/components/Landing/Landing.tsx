import React, { useEffect, useState, useContext } from "react";
import BotonesMenu from "./BotonesMenu";
import ImagenMenu from "./ImagenMenu";
import TarjetaComida from "./TarjetaComida";
import ComoFunc from "./ComoFunc";
import SearchBar from "../Buscador/Buscador";
import { ProductoManufacturado } from "../../interface/ProductoManufacturado";
import { CartContext } from "../CarritoCompras/CartProvider";

export default function Landing() {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [produc, setProduc] = useState<ProductoManufacturado[]>([]);
  const [producComplete, setProducComplete] = useState<ProductoManufacturado[]>([]);
  const { addToCart, cartItems} = useContext(CartContext); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('assets/data/productosLanding.json');
        const data = await response.json();
        setProduc(data);
        setProducComplete(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const filter = (searchParam: string) => {
    const searchResult = producComplete.filter((productVal: ProductoManufacturado) => {
      if (
        productVal.nombre.toString().toLowerCase().includes(searchParam.toLowerCase()) ||
        productVal.Rubro.toString().toLowerCase().includes(searchParam.toLowerCase())
      ) {
        return productVal;
      }
      return null;
    });
    setProduc(searchResult);
  };

  const handleSearch = (searchParam: string) => {
    filter(searchParam);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const filteredProductos =
    selectedCategory === "Todos"
      ? produc
      : produc.filter((producto) => producto.Rubro.nombre === selectedCategory);

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
        <div className="d-flex justify-content-center">
          <div className="w-50">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
        
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
                      price: 0,
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
