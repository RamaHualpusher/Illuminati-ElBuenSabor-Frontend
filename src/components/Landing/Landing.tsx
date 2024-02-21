import React, { useEffect, useState, useContext } from "react";
import BotonesMenu from "./BotonesMenu";
import ImagenMenu from "./ImagenMenu";
import ComoFunc from "./ComoFunc";
import { IProducto } from "../../interface/IProducto";
import { SearchContext } from "../Buscador/SearchContext";
import DondeEstamos from "../DondeEstamos/DondeEstamos";
import Catalogo from "./Catalogo";

/**
 * Componente de la página principal (landing page) de la aplicación.
 */
export default function Landing() {
  // Estado para la categoría seleccionada
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  // Estado para almacenar los productos y los productos filtrados
  const [productos, setProductos] = useState<IProducto[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<IProducto[]>([]);

  // Obtener el parámetro de búsqueda del contexto
  const { searchParam } = useContext(SearchContext);

  // Estado para mostrar el botón de scroll
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Cargar los productos al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('assets/data/productosLanding.json');
        const data = await response.json();
        setProductos(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  // Manejar el evento de scroll y mostrar el botón de scroll al top
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

  // Filtrar productos por búsqueda
  useEffect(() => {
    const filteredProductos = productos.filter((producto) =>
      producto?.nombre?.toLowerCase().includes(searchParam.toLowerCase())
    );

    setFilteredProducts(filteredProductos);
  }, [searchParam, productos]);

  // Manejar el cambio de categoría seleccionada
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  // Filtrar productos por categoría seleccionada
  const filteredProductos =
    selectedCategory === "Todos"
      ? filteredProducts
      : filteredProducts.filter((producto) => producto.rubro.nombre === selectedCategory);

  // Manejar el scroll al top de la página
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="mt-5 overflow-hidden" style={{ background: 'linear-gradient(to top,#494747, #ffffff )' }}>
      {/* Componente de imagen */}
      <ImagenMenu />

      {/* Componente de botones de categoría */}
      <BotonesMenu
        onCategoryChange={handleCategoryChange}
        selectedCategory={selectedCategory}
      />

      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        {/* Componente de catálogo */}
        <Catalogo filteredProductos={filteredProductos} />
      </div>

      {/* Componente de cómo funciona */}
      <ComoFunc />

      {/* Componente de dónde estamos */}
      <DondeEstamos />

      {/* Botón de scroll al top */}
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
