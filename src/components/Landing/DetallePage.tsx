import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ProductoManufacturadoVenta } from '../../interface/ProductoManufacturadoVenta';
import { ProductoManufacturado } from '../../interface/ProductoManufacturado';

const DetallePage = () => {
    const { id } = useParams<{ id: string }>();
    const [producto, setProducto] = useState<ProductoManufacturadoVenta>();

    useEffect(() => {
        if (id) {
            fetch('assets/data/productoDetalle.json') //error aca
                .then(response => response.json() )
                .then(data => {
                    const productoEncontrado = data.find((producto: ProductoManufacturado) => producto.idProductoManufacturado === parseInt(id));
                    console.log("entro:"+ productoEncontrado);
                    setProducto(productoEncontrado);
                })
                .catch(error => console.error(error));
        }
    }, [id]);

    if (!producto) {
        return <div>Cargando...</div>;
    }

    const primerProducto: ProductoManufacturado = producto.ProductoManufacturado[0];
    const fechaFormateada = producto.fecha.toLocaleDateString();

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-12 col-md-8 text-center">
                    <h1>{primerProducto.nombre}</h1>
                    <div className="card" style={{ width: '18rem' }}>
                        <img src={primerProducto.imagen} className="card-img-top" alt={primerProducto.nombre} />
                        <div className="card-body">
                            <h5 className="card-title">{primerProducto.denominacion}</h5>
                            <p className="card-text">Precio de venta: {producto.precioVenta}</p>
                            <p className="card-text">Cantidad: {producto.cantidad}</p>
                            <p className="card-text">Fecha: {fechaFormateada}</p>
                        </div>
                    </div>
                    <Link to="/productos" className="btn btn-primary btn-lg mt-3">Volver a la lista</Link>
                </div>
            </div>
        </div>
    );
};

export default DetallePage;
