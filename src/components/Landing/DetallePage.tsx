import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ProductoManufacturadoVenta } from '../../interface/ProductoManufacturadoVenta';
import { ProductoManufacturado } from '../../interface/ProductoManufacturado';

const DetallePage = () => {
    const { id } = useParams<{ id: string }>();
    const [producto, setProducto] = useState<ProductoManufacturadoVenta>();

    useEffect(() => {
        if (id) {
            fetch('/assets/data/productoDetalle.json')
                .then(response => response.json())
                .then(data => {
                    const productoEncontrado = data.find((producto: ProductoManufacturadoVenta) => producto.idProductoManufacturadoVenta === parseInt(id));
                    console.log("productoEncontrado:", productoEncontrado);
                    setProducto(productoEncontrado);
                })
                .catch(error => console.error(error));
        }
    }, [id]);

    if (!producto) {
        return <div>Cargando...</div>;
    }

    const primerProducto: ProductoManufacturado = producto.ProductoManufacturado as unknown as ProductoManufacturado;
    const fechaFormateada = new Date(producto.fecha).toLocaleDateString();

    return (
        <div className="container">
            <div className="row justify-content-center align-items-center vh-100">
                <div className="col-12 col-md-8 text-center">
                    {primerProducto && <h1 className='display-1'>{primerProducto.nombre}</h1>}
                    {primerProducto && (
                        <div className="card text-center" style={{ width: '30rem' }}>
                            <img src={primerProducto.imagen} className="card-img-top" alt={primerProducto.nombre} />
                            <div className="card-body">
                                <h5 className="card-text">Detalles: {primerProducto.preparacion}</h5>
                                <p className="card-text">Precio de venta: ${producto.precioVenta}</p>
                                <p className="card-text">Cantidad: {producto.cantidad}</p>
                                <p className="card-text">Fecha: {fechaFormateada}</p>
                                <p className="card-text">Rubro: {primerProducto.Rubro.nombre}</p>
                                
                                <p className="card-text">Preparacion: {primerProducto.preparacion}</p>
                            </div>
                        </div>
                    )}

                    <Link to="/" className="btn btn-primary btn-lg mt-3">Volver al Home</Link>
                </div>
            </div>
        </div>
    );
};

export default DetallePage;
