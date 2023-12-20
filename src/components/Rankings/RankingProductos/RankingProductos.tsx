import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { IProducto } from '../../../interface/IProducto';
import GenericTable from "../../GenericTable/GenericTable";
import { IColumn } from "../../../interface/ICamposTablaGenerica";
import { IPedido } from "../../../interface/IPedido";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const RankingProductos = () => {
    const [productos, setProductos] = useState<IProducto[]>([]);
    const [pedidos, setPedidos] = useState<IPedido[]>([]);
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

    const columns: IColumn<IPedido>[] = [
        { title: "Fecha Pedido", field: "fechaPedido", width: 2 },
        {
            title: "Producto",
            field: "DetallePedido",
            width: 2,
            render: (rowData) => (
                <img src={rowData.DetallePedido[0].Productos.imagen} alt="Producto" style={{ width: "120px", height: "100px" }} />
            ),
        },
        // aca no se si entrar con un "map" y ver todos losa tributos del detalle pedido y luego en "data" debajo de esta seccion, poner esos 
        //atributos, o como organizarme para ver esos items.
        {
            title: "Nombre", field: "DetallePedido", width: 4,
            render: (rowData: IPedido) => (
                <ul>
                    {rowData.DetallePedido.map((detalle, index) => (
                        <li key={index}>
                            Nombre: {detalle.Productos.nombre}
                        </li>
                    ))}
                </ul>
            ),
        },
        {
            title: "Ventas por producto", field: "DetallePedido", width: 3,
            render: (rowData: IPedido) =>
                // <div>{calculateCantidadVendido(rowData.DetallePedido[0].cantidad, false)}</div>
                <ul>
                    {rowData.DetallePedido.map((detalle, index) => (
                        <li key={index}>
                            {detalle.cantidad}
                        </li>
                    ))}
                </ul>
        },
    ];

    // const data = pedidos.map((pedido) => ({
    //     //aca esto no esta infresando en la tabla generica
    //     fechaPedido: pedido.fechaPedido,
    //     DetallePedido: pedido.DetallePedido[0].Productos.imagen ||
    //         pedido.DetallePedido[0].Productos.nombre ||
    //         pedido.DetallePedido[0].Productos.idProducto
    // }));

    const calculateCantidadVendido = (productoId: number, esBebida: boolean) => {
        return pedidos.reduce((totalCantidad, pedido) => {
            const cantidadProductoEnPedido = pedido.DetallePedido.reduce((cantidad, detalle) => {
                if (detalle.Productos && detalle.Productos.id === productoId && detalle.Productos.esBebida === esBebida) {
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

            const ventasPorProducto = pedidosFiltrados.map((pedido) => {
                const ventas = pedido.DetallePedido.reduce((total, detalle) => {
                    if (detalle.Productos) {
                        return total + detalle.cantidad;
                    }
                    return total;
                }, 0);
                return { ...pedido, ventas };
            });

            // Filtrar los productos por el texto ingresado
            const productosFiltrados = ventasPorProducto.filter((pedido) =>
                pedido.DetallePedido.some((detalle) =>
                    detalle.Productos.nombre.toLowerCase().includes(searchText.toLowerCase())
                )
            );
            // Ordenar la lista de productos por ventas
            productosFiltrados.sort((a, b) => b.ventas - a.ventas);

            // Actualizar el estado con los productos filtrados y ordenados
            setPedidos(productosFiltrados);
        } else {
            alert("Por favor, seleccione ambas fechas antes de realizar la búsqueda.");
        }
    };

    const pedidosBebida = pedidos
        .filter((pedido) => pedido.id !== undefined && pedido.DetallePedido.some((detalle) => detalle.Productos.esBebida))
        .map((pedido) => ({
            ...pedido,
            ventasNoBebida: pedido.id !== undefined ? calculateCantidadVendido(pedido.id, false) : 0,
            ventasBebida: pedido.id !== undefined ? calculateCantidadVendido(pedido.id, true) : 0,
        }));

    const pedidosNoBebida = pedidos
        .filter((pedido) => pedido.id !== undefined && !pedido.DetallePedido.some((detalle) => detalle.Productos.esBebida))
        .map((pedido) => ({
            ...pedido,
            ventasNoBebida: pedido.id !== undefined ? calculateCantidadVendido(pedido.id, false) : 0,
            ventasBebida: pedido.id !== undefined ? calculateCantidadVendido(pedido.id, true) : 0,
        }));

    const mergedProducts = [...pedidosBebida, ...pedidosNoBebida];

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
                        <GenericTable<IPedido>
                            columns={columns}
                            data={pedidosNoBebida.sort((a, b) => b.ventasNoBebida - a.ventasNoBebida)}
                            actions={{
                                create: false,
                                update: false,
                                delete: false,
                                view: false,
                            }}
                        />
                    </Col>
                    <Col>
                        <h2>Ranking Bebidas</h2>
                        <GenericTable<IPedido>
                            columns={columns}
                            data={pedidosBebida.sort((a, b) => b.ventasBebida - a.ventasBebida)}
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