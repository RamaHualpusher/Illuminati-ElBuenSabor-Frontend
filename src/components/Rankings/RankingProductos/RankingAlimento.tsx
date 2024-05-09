import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from 'react-bootstrap';
import GenericTable from "../../GenericTable/GenericTable";
import { IColumn } from "../../../interface/ICamposTablaGenerica";
import axios from "axios";
import { IPedidoDto } from "../../../interface/IPedido";
import NoHayPedidos from "../../Page404/NoHayPedidos";

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

                console.log("productos cocina" + productosCocina)

                const productosBebida = pedidos.filter(pedido => {
                    return pedido.detallesPedidos.some(detalle => detalle.producto.esBebida);
                });

                console.log("productos bebida" + productosBebida)

                setProductosCocina(productosCocina);
                setProductosBebida(productosBebida);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, []);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const pedidoResponse = await axios.get<IPedidoDto[]>(`${API_URL}pedido`);
    //             const pedidos = pedidoResponse.data;

    //             let productosCocina: IPedidoDto[] = [];
    //             let productosBebida: IPedidoDto[] = [];

    //             pedidos.forEach(pedido => {
    //                 pedido.detallesPedidos.forEach(detalle => {
    //                     if (detalle.producto.esBebida) {
    //                         productosBebida.push(pedido);
    //                     } else {
    //                         productosCocina.push(pedido);
    //                     }
    //                 });
    //             });

    //             console.log("productos cocina", productosCocina);
    //             console.log("productos bebida", productosBebida);

    //             setProductosCocina(productosCocina);
    //             setProductosBebida(productosBebida);
    //         } catch (error) {
    //             console.log(error);
    //         }
    //     };

    //     fetchData();
    // }, []);    

    const columns: IColumn<IPedidoDto>[] = [
        {
            title: "Nombre",
            field: "detallesPedidos",
            render: rowData => {
                return rowData.detallesPedidos[0].producto.nombre ? <span>{rowData.detallesPedidos[0].producto.nombre}</span> : <span>-</span>;
            }
        },
        {
            title: "Cantidad",
            field: "detallesPedidos",
            render: rowData => {
                return rowData.detallesPedidos[0].cantidad ? <span>{rowData.detallesPedidos[0].cantidad}</span> : <span>-</span>;
            }
        },
        {
            title: "Imagen",
            field: "detallesPedidos",
            render: rowData => <img src={rowData.detallesPedidos[0].producto.imagen} alt={rowData.detallesPedidos[0].producto.imagen} style={{ width: "50px" }} />
        },
    ];

    // const columns: IColumn<IPedidoDto>[] = [
    //     { 
    //         title: "Nombre", 
    //         field: "detallesPedidos",
    //         render: rowData => (
    //             <>
    //                 {rowData.detallesPedidos.map(detalle => (
    //                     <span key={detalle.id}>{detalle.producto.nombre}</span> 
    //                 ))}
    //             </>
    //         )
    //     },
    //     { 
    //         title: "Cantidad", 
    //         field: "detallesPedidos",
    //         render: rowData => (
    //             <>
    //                 {rowData.detallesPedidos.map(detalle => (
    //                     <span key={detalle.id}>{detalle.cantidad}</span>
    //                 ))}
    //             </>
    //         )
    //     },
    //     { 
    //         title: "Imagen", 
    //         field: "detallesPedidos",
    //         render: rowData => (
    //             <>
    //                 {rowData.detallesPedidos.map(detalle => (
    //                     <img key={detalle.id} src={detalle.producto.imagen} alt={detalle.producto.nombre} style={{ width: "50px" }} />
    //                 ))}
    //             </>
    //         )
    //     },
    // ];    

    const exportToExcel = () => {
        //     if (pedidos.length > 0) {
        //       const dataToExport: any[] = [];
        //       const usuariosProcesados = new Set(); // Para evitar procesar al mismo usuario más de una vez
        //       pedidos.forEach(pedido => {
        //         const usuario = pedido.usuario;
        //         if (!usuariosProcesados.has(usuario.id)) {
        //           dataToExport.push({
        //             "Nombre Completo": `${usuario.nombre} ${usuario.apellido}`,
        //             Email: usuario.email,
        //             Teléfono: usuario.telefono,
        //             Estado: usuario.activo ? "Activo" : "Inactivo",
        //             "Cantidad de Pedidos": calcularCantidadTotalPedidos(usuario),
        //             "Total Pedidos": calcularTotalPedidos(usuario),
        //           });
        //           usuariosProcesados.add(usuario.id);
        //         }
        //       });
        //       exportTableDataToExcel(dataToExport, "Pedidos");
        //     }
    };

    return (
        <div>
            <Container fluid>
                <Row className="mt-3">
                    <Col>
                        <h2>Productos Cocina</h2>
                        {productosCocina && productosCocina.length > 0 ? (
                            <GenericTable<IPedidoDto>
                                data={productosCocina}
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
                    </Col>
                    <Col>
                        <h2> Productos Bebidas</h2>
                        {productosBebida && productosBebida.length > 0 ? (
                            <GenericTable<IPedidoDto>
                                columns={columns}
                                data={productosBebida}
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
                    </Col>
                </Row>
                <Button variant="success" style={{ marginLeft: "10px" }} onClick={exportToExcel}>
                    Exportar a Excel
                </Button>
            </Container>
        </div>
    );
};

export default RankingAlimento;