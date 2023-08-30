import React, { useEffect, useState } from "react";
import { Container, Row, Col } from 'react-bootstrap';
import { Producto } from '../../../interface/Producto';
import GenericTable from "../../GenericTable/GenericTable";
import { Column } from "../../../interface/CamposTablaGenerica";
import { Pedido } from "../../../interface/Pedido";

const RankingProductos = () => {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [addModalShow, setAddModalShow] = useState(false);
    const [pedidos, setPedidos] = useState<Pedido[]>([]);

    useEffect(() => {
        const API_URL = "assets/data/productosLanding.json";
        const API_URL_pedido = "assets/data/pedidos.json";

        Promise.all([
            fetch(API_URL).then(response => response.json()),
            fetch(API_URL_pedido).then(response => response.json())
        ])
        .then(([productosData, pedidosData]) => {
            setProductos(productosData);
            setPedidos(pedidosData);
        })
        .catch(error => console.log(error));
    }, []);

    const columns: Column<Producto>[] = [
        { title: "ID", field: "idProducto", width: 1 },
        {
            title: "Producto", field: "imagen", width: 2,
            render: (rowData) => <img src={rowData.imagen} alt="Producto" style={{ width: "150px", height: "100px" }} />
        },
        { title: "Nombre", field: "nombre", width: 4 },
        {
            title: "Ventas por producto", field: "stockActual", width: 3,
            render: (rowData) =>
                <div>{calculateCantidadVendido(rowData.idProducto)}</div>
        },
    ];

    const calculateCantidadVendido = (productoId: number) => {
        return pedidos.reduce((totalCantidad, pedido) => {
            const cantidadProductoEnPedido = pedido.DetallePedido.reduce((cantidad, detalle) => {
                if (detalle.Productos && detalle.Productos.length > 0) {
                    const cantidadProducto = detalle.Productos.reduce((cantidadProductoDetalle, producto) => {
                        if (producto.idProducto === productoId) {
                            cantidadProductoDetalle += detalle.cantidad;
                        }
                        return cantidadProductoDetalle;
                    }, 0);
                    cantidad += cantidadProducto;
                }
                return cantidad;
            }, 0);
            return totalCantidad + cantidadProductoEnPedido;
        }, 0);
    };

    const handleAddModalOpen = () => {
        setAddModalShow(true);
    };

    const handleAddModalClose = () => {
        setAddModalShow(false);
    };

    const data = productos.map((producto) => ({
        idProducto: producto.idProducto,
        imagen: producto.imagen,
        nombre: producto.nombre,
        denominacion: producto.denominacion,
        stockActual: calculateCantidadVendido(producto.idProducto), // Cambiamos esto por la cantidad vendida
    }));

    return (
        <div>
            <Container fluid>
                <Row className="mt-3">
                    <Col>
                        <GenericTable<Producto>
                            columns={columns}
                            data={productos.sort((a, b) => b.stockActual - a.stockActual)}
                            actions={{
                                create: true,
                                update: false,
                                delete: false,
                                view: false,
                            }}
                            onAdd={handleAddModalOpen}
                        />
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default RankingProductos;
