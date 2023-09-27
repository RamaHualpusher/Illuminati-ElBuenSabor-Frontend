import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Producto } from '../../../interface/Producto';
import GenericTable from "../../GenericTable/GenericTable";
import { Column } from "../../../interface/CamposTablaGenerica";
import { Pedido } from "../../../interface/Pedido";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const RankingProductos = () => {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [searchText, setSearchText] = useState<string>('');
    const [startDate, setStartDate] = useState<Date | null>(new Date());
    const [endDate, setEndDate] = useState<Date | null>(new Date());

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
            title: "Producto", field: "imagen", width: 1,
            render: (rowData) => <img src={rowData.imagen} alt="Producto" style={{ width: "120px", height: "100px" }} />
        },
        { title: "Nombre", field: "nombre", width: 4 },
        {
            title: "Ventas por producto", field: "stockActual", width: 3,
            render: (rowData) =>
                <div>{calculateCantidadVendido(rowData.idProducto, false)}</div>
        },
    ];

    const calculateCantidadVendido = (productoId: number, esBebida: boolean) => {
        return pedidos.reduce((totalCantidad, pedido) => {
            const cantidadProductoEnPedido = pedido.DetallePedido.reduce((cantidad, detalle) => {
                if (detalle.Productos && detalle.Productos.idProducto === productoId && detalle.Productos.esBebida === esBebida) {
                    cantidad += detalle.cantidad;
                }
                return cantidad;
            }, 0);
            return totalCantidad + cantidadProductoEnPedido;
        }, 0);
    };

    const handleBuscarClick = () => {
        if (startDate !== null && endDate !== null) {
            const pedidosFiltrados = pedidos.filter(pedido => {
                const fechaPedido = new Date(pedido.fechaPedido);
                return fechaPedido >= startDate && fechaPedido <= endDate;
            });

            const ventasPorProducto = productos.map(producto => {
                const ventas = pedidosFiltrados.reduce((total, pedido) => {
                    const detallePedido = pedido.DetallePedido.find(detalle => detalle.Productos && detalle.Productos.idProducto === producto.idProducto);
                    if (detallePedido) {
                        return total + detallePedido.cantidad;
                    }
                    return total;
                }, 0);
                return { ...producto, ventas };
            });

            // Filtrar los productos por el texto ingresado
            const productosFiltrados = ventasPorProducto.filter(producto =>
                producto.nombre.toLowerCase().includes(searchText.toLowerCase())
            );

            // Ordenar la lista de productos por ventas
            productosFiltrados.sort((a, b) => b.ventas - a.ventas);

            // Actualizar el estado con los productos filtrados y ordenados
            setProductos(productosFiltrados);
        } else {
            alert("Por favor, seleccione ambas fechas antes de realizar la búsqueda.");
        }
    };

    const data = productos.map((producto) => ({
        idProducto: producto.idProducto,
        imagen: producto.imagen,
        nombre: producto.nombre,
        denominacion: producto.denominacion,
        stockActual: calculateCantidadVendido(producto.idProducto, false),
    }));

    const productosBebida = productos
        .filter(producto => producto.esBebida)
        .map(producto => ({
            ...producto,
            ventasNoBebida: calculateCantidadVendido(producto.idProducto, false),
            ventasBebida: calculateCantidadVendido(producto.idProducto, true)
        }));

    const productosNoBebida = productos
        .filter(producto => !producto.esBebida)
        .map(producto => ({
            ...producto,
            ventasNoBebida: calculateCantidadVendido(producto.idProducto, false),
            ventasBebida: calculateCantidadVendido(producto.idProducto, true)
        }));

    const mergedProducts = [...productosBebida, ...productosNoBebida];

    return (
        <div>
            <Container fluid>
                <Row className="mt-3">
                    <Col>
                        <Form>
                            <Col>
                                <Row>
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>Fecha inicio búsqueda</Form.Label>
                                            <Col>
                                                <DatePicker
                                                    selected={startDate}
                                                    onChange={(date: Date | null) => setStartDate(date)}
                                                    dateFormat="yyyy-MM-dd"
                                                    isClearable
                                                    className="form-control"
                                                />
                                            </Col>
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>Fecha fin búsqueda</Form.Label>
                                            <Col>
                                                <DatePicker
                                                    selected={endDate}
                                                    onChange={(date: Date | null) => setEndDate(date)}
                                                    dateFormat="yyyy-MM-dd"
                                                    isClearable
                                                    className="form-control"
                                                />
                                            </Col>
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Button variant="primary" style={{ marginTop: "30px" }} onClick={handleBuscarClick}>Buscar</Button>
                                    </Col>
                                </Row>
                            </Col>
                        </Form>
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col>
                        <h2>Ranking de Productos</h2>
                        <GenericTable<Producto>
                            columns={columns}
                            data={productosBebida.sort((a, b) => b.ventasBebida - a.ventasBebida)}
                            actions={{
                                create: false,
                                update: false,
                                delete: false,
                                view: false,
                            }}
                        />
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default RankingProductos;