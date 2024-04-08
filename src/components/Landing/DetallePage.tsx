import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Spinner from '../Spinner/Spinner';
import { CartContext, CartItem } from '../../context/cart/CartProvider';
import { IProducto } from '../../interface/IProducto';
import { IDetallePedido } from '../../interface/IDetallePedido';
import axios from 'axios';

const DetallePage = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useContext(CartContext);
const API_URL = process.env.REACT_APP_API_URL || "";
  const [producto, setProducto] = useState<IProducto | undefined>();
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const fetchProducto = async () => {
      if (id) {
        try {
          const response = await axios.get(`${API_URL}producto`);          
          const productoEncontrado = response.data.find((producto: IProducto) => producto.id === parseInt(id));
          setProducto(productoEncontrado);
          if (productoEncontrado && productoEncontrado.stockActual === 0) {
            setShowAlert(true);
          }
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchProducto();
  }, [id]);

  const handleAddToCart = () => {
    if (producto && producto.stockActual > 0) {
      const detallePedido: IDetallePedido = {
        id: 0,
        cantidad: 0,
        subTotal: 0,
        producto: producto,
        maxCantidadProducto: 0,
      };

      const item: CartItem = {
        id: producto?.id ?? 0,
        name: producto?.nombre ?? '',
        quantity: 1,
        price: producto?.precio ?? 0,
        image: producto?.imagen ?? '',
        title: producto?.nombre ?? '',
        detallePedido: detallePedido,
      };

      addToCart(item);
    }
  };

  if (!producto) {
    return <Spinner />;
  }

  const ingredientesList = producto.productosIngredientes?.map((productoIngrediente, index) => (
    <span key={productoIngrediente?.id}>
      {productoIngrediente?.ingrediente?.nombre}
      {index !== (producto.productosIngredientes?.length ?? 0) - 1 ? ', ' : '.'}
    </span>
  ));

  const ingredientesSection = (producto.productosIngredientes?.length ?? 0) > 0 && (
    <p className="card-text">Ingredientes: {ingredientesList}</p>
  );

  return (
    <div className="detalle-page-container" style={{ backgroundImage: `url('/assets/img/FondoColorGris.jpg') `, minHeight: '100vh' }}>
      <div className="container mt-5">
        <div className="row justify-content-center align-items-center">
          <div className="col-12 col-md-8 text-center">
            <h1 className="display-4 mt-5 text-white">{producto.nombre}</h1>
            <div className="card text-center mx-auto" style={{ width: '40rem' }}>
              <img src={producto.imagen} className="card-img-top img-fluid" alt={producto.nombre} />
              <div className="card-body">
                <h4 className="card-text">Detalles: <br />{producto.preparacion}</h4>
                <p className="card-text">Precio de venta: ${producto.precio}</p>
                <p className="card-text">Disponibles: {producto.stockActual}</p>
                <p className="card-text">Tiempo estimado: {producto.tiempoEstimadoCocina} Min</p>
                {ingredientesSection}
                {producto.stockActual > 0 ? (
                  <button onClick={handleAddToCart} className="btn btn-primary mb-2">
                    Agregar al Carrito
                  </button>
                ) : (
                  <div className="alert alert-danger p-2" role="alert">
                    Sin Stock
                  </div>
                )}
              </div>
            </div>
            <Link to="/" className="btn btn-primary btn-lg mt-3 mb-3">
              Volver al Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetallePage;
