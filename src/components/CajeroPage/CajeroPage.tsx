import React, { useEffect, useState } from "react";
import { Form, Row, Col } from "react-bootstrap";
import { Pedido } from "../../interface/Pedido";
import Buscador from "../Buscador/Buscador";
import PedidoList from "../Pedidos/PedidoList";

const CajeroPage = () => {
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [pedidosComplete, setPedidosComplete] = useState<Pedido[]>([]);
    const [filtroEstado, setFiltroEstado] = useState<string>("");
    const [pedidoSeleccionado, setPedidoSeleccionado] = useState<Pedido | null>(null);

    useEffect(() => {
        const fetchPedidos = async () => {
            try {
                const response = await fetch("assets/data/pedidos.json");
                const data = await response.json();
                setPedidos(data);
                setPedidosComplete(data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchPedidos();
    }, []);

    const filteredPedidos = pedidos.filter((pedido) => {
        if (filtroEstado === "") {
            return true;
        } else {
            return pedido.EstadoPedido.descripcion === filtroEstado;
        }
    });

    const filter = (searchParam: string) => {
        const searchResult = pedidosComplete.filter((productVal: Pedido) => {
            if (productVal.idPedido.toString().toLowerCase().includes(searchParam.toLowerCase())) {
                return productVal;
            }
            return null;
        });
        setPedidos(searchResult);
    };

    const handleSearch = (searchParam: string) => {
        filter(searchParam);
    };

    const cambiarEstadoPedido = (nuevoEstado: string) => {
        if (pedidoSeleccionado) {
            const { EstadoPedido, TipoEntregaPedido, TipoPago } = pedidoSeleccionado;

            if (
                (EstadoPedido.descripcion === "A confirmar" && nuevoEstado === "A cocina") ||
                (EstadoPedido.descripcion === "A confirmar" && nuevoEstado === "Listo") ||
                (EstadoPedido.descripcion === "Listo" && nuevoEstado === "En delivery" && TipoEntregaPedido.descripcion === "Envío a domicilio") ||
                (EstadoPedido.descripcion === "Listo" && nuevoEstado === "Entregado" && TipoEntregaPedido.descripcion === "Retiro en local" && TipoPago.descripcion === "Pago realizado")
            ) {
                setPedidoSeleccionado({ ...pedidoSeleccionado, EstadoPedido: { idEstadoPedido: 0, descripcion: nuevoEstado, tiempo: "0" } });
            }
        }
    };

    const handleEstadoFiltroChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setFiltroEstado(event.target.value);
        setPedidoSeleccionado(null);
    };

    return (
        <div className="container mt-3">
            <div className="header-container container-sm text-center">
                <Row className="align-items-center">
                    <Col>
                        <h1>Pedidos Pendientes</h1>
                    </Col>
                    <Col xs="auto">
                        <Form.Select value={filtroEstado} onChange={handleEstadoFiltroChange}>
                            <option value="">Todos los estados</option>
                            <option value="A confirmar">A confirmar</option>
                            <option value="En cocina">En cocina</option>
                            <option value="Listo">Listo</option>
                            <option value="En delivery">En delivery</option>
                            <option value="Entregado">Entregado</option>
                        </Form.Select>
                    </Col>
                </Row>
                <div className="d-flex justify-content-center mt-3">
                    <Buscador onSearch={handleSearch} />
                </div>
            </div>
            <PedidoList pedidos={filteredPedidos} cambiarEstadoPedido={cambiarEstadoPedido} btnTicket={true} phat="cajero"/>
        </div>
    );
};

export default CajeroPage;
