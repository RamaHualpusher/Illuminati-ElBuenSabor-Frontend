import React, { useEffect, useState, useContext } from "react";
import BotonesMenu from "./BotonesMenu";
import ImagenMenu from "./ImagenMenu";
import TarjetaComida from "./TarjetaComida";
import ComoFunc from "./ComoFunc";
import { Producto } from "../../interface/Producto";
import { CartContext } from "../CarritoCompras/CartProvider";
import { SearchContext } from "../Buscador/SearchContext";
import DondeEstamos from "../DondeEstamos/DondeEstamos";

export default function Landing() {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [produc, setProduc] = useState<Producto[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Producto[]>([]);
  const { addToCart, cartItems } = useContext(CartContext);
  const { searchParam } = useContext(SearchContext);
  const [showScrollButton, setShowScrollButton] = useState(false);

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
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setShowScrollButton(scrollTop > 0);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const filteredProductos = produc.filter((producto) =>
      producto.nombre.toLowerCase().includes(searchParam.toLowerCase())
    );

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

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="mt-5 overflow-hidden" style={{ background: 'linear-gradient(to top,#bfbdbd, #ffffff )' }}>
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
                producto={producto}
                buttonText={"Agregar al Carrito"}
              />
            </div>
          ))}
        </div>
      </div>
      <ComoFunc backgroundImage={"/assets/img/FondoComoFunc.jpg"} />
      <DondeEstamos />
      {showScrollButton && (
        <div className="position-fixed bottom-0 end-0 mb-3 me-3">
          <button className="btn btn-primary btn-lg" onClick={handleScrollToTop}>
          <i className="bi bi-caret-up-square-fill"></i>
          </button>
        </div>
      )}
    </div>
  );
}
