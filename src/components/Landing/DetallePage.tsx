import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Producto } from '../../interface/Producto';
import Spinner from '../Spinner/Spinner';
import { CartContext } from '../CarritoCompras/CartProvider';

const DetallePage = () => {
  const { id } = useParams<{ id: string }>();
  const [producto, setProducto] = useState<Producto | undefined>();
  const [showAlert, setShowAlert] = useState(false);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    if (id) {
      console.log(id);
      fetch('/assets/data/productosLanding.json')
        .then((response) => response.json())
        .then((data) => {
          const productoEncontrado = data.find((producto: Producto) => producto.idProducto === parseInt(id));
          console.log('productoEncontrado:', productoEncontrado);
          setProducto(productoEncontrado);
          if (productoEncontrado && productoEncontrado.stockActual === 0) {
            setShowAlert(true);
          }
        })
        .catch((error) => console.error(error));
    }
  }, [id]);

  const handleAddToCart = () => {
    if (producto && producto.stockActual > 0) {
      const item = {
        id: producto.idProducto,
        name: producto.nombre,
        quantity: 1,
        price: producto.precio,
        image: producto.imagen,
        title: producto.nombre,
        DetallePedido: {
          idDetallePedido: 0,
          cantidad: 0,
          Producto: producto,
        },
      };
      addToCart(item);
    }
  };
  

  if (!producto || producto === null) {
    return <Spinner />;
  }

  const primerProducto: Producto = producto;

  const ingredientesList = primerProducto.ProductoIngrediente.map((productoIngrediente, index) => (
    <span key={productoIngrediente.idProductoIngrediente}>
      {productoIngrediente.Ingredientes.nombre}
      {index !== primerProducto.ProductoIngrediente.length - 1 ? ', ' : '.'}
    </span>
  ));

  const ingredientesSection = primerProducto.ProductoIngrediente.length > 0 && (
    <p className="card-text">Ingredientes: {ingredientesList}</p>
  );

  return (
    <div className="container mt-5">
      <div className="row justify-content-center align-items-center vh-100">
        <div className="col-12 col-md-8 text-center">
          {primerProducto && <h1 className="display-4 mt-5">{primerProducto.nombre}</h1>}
          <div className="card text-center mx-auto" style={{ width: '40rem' }}>
            <img src={primerProducto.imagen} className="card-img-top img-fluid" alt={primerProducto.nombre} />
            <div className="card-body">
              <h4 className="card-text">Detalles: <br />{primerProducto.preparacion}</h4>
              <p className="card-text">Precio de venta: ${producto.precio}</p>
              <p className="card-text">Disponibles: {producto.stockActual}</p>
              {showAlert && (
                <div className="alert alert-danger" role="alert">
                  No disponible para comprar
                </div>
              )}
              <p className="card-text">Tiempo estimado: {primerProducto.tiempoEstimadoCocina} Min</p>
              {ingredientesSection}
              {producto.stockActual > 0 && (
                <button onClick={handleAddToCart} className="btn btn-primary mb-2">
                  Agregar al Carrito
                </button>
              )}
            </div>
          </div>

          <Link to="/" className="btn btn-primary btn-lg mt-3">
            Volver al Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DetallePage;
