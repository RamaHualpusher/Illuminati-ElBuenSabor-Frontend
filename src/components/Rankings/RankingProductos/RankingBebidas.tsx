import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { IProducto } from '../../../interface/IProducto';
import GenericTable from "../../GenericTable/GenericTable";
import { IColumn } from "../../../interface/ICamposTablaGenerica";
import { IPedido } from "../../../interface/IPedido";
import { IDetallePedido, IDetallePedidoDto } from "../../../interface/IDetallePedido";
import axios from "axios";

const RankingProductos = () => {
    const [productoBebidas, setProductosBebidas] = useState<IDetallePedido[]>([]);
    const [detallePedidos, setDetallesPedidos] = useState<IDetallePedido[]>([]);
    const [searchText, setSearchText] = useState<string>('');
    const [startDate, setStartDate] = useState<Date | null>(new Date());
    const [endDate, setEndDate] = useState<Date | null>(new Date());

    useEffect(() => {
        const fetchData = async () => {
            try {
                const detallePedidoResponse = await axios.get(process.env.REACT_APP_API_URL + "detalle-pedido");
                setDetallesPedidos(detallePedidoResponse.data);
                detallePedidos.map((detalle) => {
                    if (detalle.producto.esBebida) {
                        productoBebidas.map((beb) => {
                            if (beb.producto.id === detalle.producto.id) {
                                beb = {
                                    ...beb,
                                    cantidad: beb.cantidad + detalle.cantidad,
                                }
                            } else {
                                setProductosBebidas([...productoBebidas, detalle]);
                            }
                        });
                    }
                });

            } catch (error) {
                console.log(error);
            }
        }

        fetchData();
    }, []);

    const columns: IColumn<IDetallePedido>[] = [
        {
            title: "Nombre",
            field: "producto",
            render: (detalle: IDetallePedido) => <span>{detalle.producto.nombre}</span>
        },
        { title: "Activo", field: "activo" },
        { title: "Imagen", field: "producto", render: (detalle: IDetallePedido) => <span>{detalle.producto.imagen}</span> },
        { title: "Cantidad", field: "cantidad" },
    ];

    /*const calculateCantidadVendido = (productoId: number, esBebida: boolean | undefined) => {
        return pedidos.reduce((totalCantidad, pedido) => {
            const cantidadProductoEnPedido = pedido.DetallePedido.reduce((cantidad, detalle) => {
                if (
                    detalle.Productos &&
                    detalle.Productos.id === productoId &&
                    (esBebida === undefined || detalle.Productos.esBebida === esBebida)
                ) {
                    cantidad += detalle.cantidad;
                }
                return cantidad;
            }, 0);
            console.log(`Pedido ${pedido.id}, Cantidad: ${cantidadProductoEnPedido}`);
            return totalCantidad + cantidadProductoEnPedido;
        }, 0);
    };*/

    // const handleBuscarClick = () => {
    //     if (startDate !== null && endDate !== null) {
    //         const pedidosFiltrados = pedidos.filter(pedido => {
    //             const fechaPedido = new Date(pedido.fechaPedido);
    //             return fechaPedido >= startDate && fechaPedido <= endDate;
    //         });

    //         const ventasPorProducto = pedidosFiltrados.map((pedido) => {
    //             const ventas = pedido.DetallePedido.reduce((total, detalle) => {
    //                 if (detalle.Productos) {
    //                     return total + detalle.cantidad;
    //                 }
    //                 return total;
    //             }, 0);
    //             return { ...pedido, ventas };
    //         });

    //         // Filtrar los productos por el texto ingresado
    //         const productosFiltrados = ventasPorProducto.filter((pedido) =>
    //             pedido.DetallePedido.some((detalle) =>
    //                 detalle.Productos.nombre.toLowerCase().includes(searchText.toLowerCase())
    //             )
    //         );
    //         // Ordenar la lista de productos por ventas
    //         productosFiltrados.sort((a, b) => b.ventas - a.ventas);

    //         // Actualizar el estado con los productos filtrados y ordenados
    //         setPedidos(productosFiltrados);
    //     } else {
    //         alert("Por favor, seleccione ambas fechas antes de realizar la búsqueda.");
    //     }
    // };

    /* const pedidosBebida = pedidos
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
             ventasNoBebida: pedido.id !== undefined ? calculateCantidadVendido(pedido.id, true) : 0,
             ventasBebida: pedido.id !== undefined ? calculateCantidadVendido(pedido.id, false) : 0,
         }));
 
     const mergedProducts = [...pedidosBebida, ...pedidosNoBebida];
 */
    return (
        <div>
            <Container fluid>
                {/* <Row className="mt-3">
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
                </Row> */}
                <Row className="mt-3">
                    <Col>
                        <h2>Ranking Bebidas</h2>
                        <GenericTable<IDetallePedido>
                            columns={columns}
                            data={detallePedidos.sort((a, b) => b.cantidad - a.cantidad)}
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