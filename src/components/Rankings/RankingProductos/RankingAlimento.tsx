import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from 'react-bootstrap';
import GenericTable from "../../GenericTable/GenericTable";
import { IColumn } from "../../../interface/ICamposTablaGenerica";
import axios from "axios";
import { IPedidoDto } from "../../../interface/IPedido";
import NoHayPedidos from "../../Page404/NoHayPedidos";
import { exportTableDataToExcel } from "../../../util/exportTableDataToExcel";

const RankingAlimento = () => {
    const [productosCocina, setProductosCocina] = useState<IPedidoDto[]>([]);
    const [productosBebida, setProductosBebida] = useState<IPedidoDto[]>([]);
    const API_URL = process.env.REACT_APP_API_URL || "";

    useEffect(() => {
        const fetchData = async () => {
            try {
                const pedidoResponse = await axios.get<IPedidoDto[]>(`${API_URL}pedido`);
                const pedidos = pedidoResponse.data;

                const productosCocina = pedidos.filter(pedido => {
                    return pedido.detallesPedidos.some(detalle => !detalle.producto.esBebida);
                });


                const productosBebida = pedidos.filter(pedido => {
                    return pedido.detallesPedidos.some(detalle => detalle.producto.esBebida);
                });


                setProductosCocina(productosCocina);
                setProductosBebida(productosBebida);

                console.log("productos cocina", productosCocina)
                console.log("productos bebida", productosBebida)

            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, []);

    const columns: IColumn<IPedidoDto>[] = [
        {
            title: "ID",
            field: "id"            
        },
        {
            title: "Nombre",
            field: "fechaPedido",
            render: rowData => {
                return rowData.detallesPedidos[0].producto.nombre ?
                    <span>{rowData.detallesPedidos[0].producto.nombre}</span>
                    : <span>-</span>;
            }
        },
        {
            title: "Cantidad",
            field: "detallesPedidos",
            render: rowData => {
                return rowData.detallesPedidos[0].cantidad ?
                    <span>{rowData.detallesPedidos[0].cantidad}</span>
                    : <span>-</span>;
            }
        },
        {
            title: "Imagen",
            field: "detallesPedidos",
            render: rowData => <img src={rowData.detallesPedidos[0].producto.imagen} alt={rowData.detallesPedidos[0].producto.imagen} style={{ width: "50px" }} />
        },
    ];

    // Agrupa los pedidos por producto de cocina y muestra solo un producto con toda la información
    const pedidosPorProducto: IPedidoDto[] = productosCocina.reduce((acc: IPedidoDto[], pedido) => {
        const existingProductIndex = acc.findIndex(product => product.detallesPedidos[0].producto.id === pedido.detallesPedidos[0].producto.id);
        if (existingProductIndex === -1) {
            acc.push(pedido);
        } else {
            // Suma la cantidad vendida del producto existente
            acc[existingProductIndex].detallesPedidos[0].cantidad += pedido.detallesPedidos[0].cantidad;
        }
        return acc;
    }, []);

    //ordena los productos cocina desde el que tiene mas ventas, al de menor ventas
    const pedidosPorProductoOrdenado = pedidosPorProducto.sort((a, b) => {
        return b.detallesPedidos[0].cantidad - a.detallesPedidos[0].cantidad;
    });

    // Agrupa los pedidos por producto de bebida y muestra solo un producto con toda la información
    const pedidosPorProductoBebida = productosBebida.reduce((acc: IPedidoDto[], pedido) => {
        const existingProductIndex = acc.findIndex(product => product.detallesPedidos[0].producto.id === pedido.detallesPedidos[0].producto.id);
        if (existingProductIndex === -1) {
            acc.push(pedido);
        } else {
            acc[existingProductIndex].detallesPedidos[0].cantidad += pedido.detallesPedidos[0].cantidad;
        }
        return acc;
    }, []);

    //ordena los productos bebidas desde el que tiene mas ventas, al de menor ventas
    const pedidosPorProductoBebidaOrdenado = pedidosPorProductoBebida.sort((a, b) => {
        return b.detallesPedidos[0].cantidad - a.detallesPedidos[0].cantidad;
    });

    const exportToExcelBebidas = () => {
        if (productosBebida.length > 0) {
            const dataToExport: any[] = [];
            const productosProcesados = new Set();
            productosBebida.forEach(pedido => {
                const producto = pedido.detallesPedidos[0].producto;
                if (!productosProcesados.has(producto.id)) {
                    dataToExport.push({
                        "Nombre": `${producto.nombre} `,
                        Estado: producto.activo ? "Activo" : "Inactivo",
                        "Cantidad": pedido.detallesPedidos[0].cantidad,
                    });
                    productosProcesados.add(producto.id);
                }
            });
            exportTableDataToExcel(dataToExport, "Pedidos Bebidas");
        }
    };

    const exportToExcelCocina = () => {
        if (productosCocina.length > 0) {
            const dataToExport: any[] = [];
            const productosProcesados = new Set();
            productosCocina.forEach(pedido => {
                const producto = pedido.detallesPedidos[0].producto;
                if (!productosProcesados.has(producto.id)) {
                    dataToExport.push({
                        "Nombre": `${producto.nombre} `,
                        "Estado": producto.activo ? "Activo" : "Inactivo",
                        "Cantidad": pedido.detallesPedidos[0].cantidad,
                    });
                    productosProcesados.add(producto.id);
                }
            });
            exportTableDataToExcel(dataToExport, "Pedidos Cocina");
        }
    };

    return (
        <div>
            <Container fluid>
                <Row className="mt-3">
                    <Col>
                        <h2>Productos Cocina</h2>
                        {productosCocina && productosCocina.length > 0 ? (
                            <GenericTable<IPedidoDto>
                                data={pedidosPorProductoOrdenado}
                                columns={columns}
                                actions={{
                                    create: false,
                                    update: false,
                                    delete: false,
                                    view: false,
                                }}
                            />
                        ) : (
                            <NoHayPedidos onReload={() => window.location.reload()} />
                        )}
                        <Button variant="success" style={{ marginLeft: "10px" }} onClick={exportToExcelCocina}>
                            Exportar a Excel - Cocina
                        </Button>
                    </Col>
                    <Col>
                        <h2> Productos Bebidas</h2>
                        {productosBebida && productosBebida.length > 0 ? (
                            <GenericTable<IPedidoDto>
                                columns={columns}
                                data={pedidosPorProductoBebidaOrdenado}
                                actions={{
                                    create: false,
                                    update: false,
                                    delete: false,
                                    view: false,
                                }}
                            />
                        ) : (
                            <NoHayPedidos onReload={() => window.location.reload()} />
                        )}
                        <Button variant="success" style={{ marginLeft: "10px" }} onClick={exportToExcelBebidas}>
                            Exportar a Excel - Bebidas
                        </Button>
                    </Col>

                </Row>

            </Container>
        </div>
    );
};

export default RankingAlimento;