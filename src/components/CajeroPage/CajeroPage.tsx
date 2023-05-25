import React, { useEffect, useState } from "react";
import { Table, Form } from "react-bootstrap";
import { Pedido } from "../../interface/Pedido";
import { EstadoPedido } from "../../interface/EstadoPedido";

const CajeroPage = () => {
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [filtroEstado, setFiltroEstado] = useState<string>("");

    useEffect(() => {
        const fetchPedidos = async () => {
            try {
                const response = await fetch("assets/data/pedidos.json");
                const data = await response.json();
                setPedidos(data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchPedidos();
    }, []);

    

    const filteredPedidos = pedidos.filter(pedido => {
        if (filtroEstado === "") {
            return true;
        } else {
            return pedido.EstadoPedido.descripcion === filtroEstado;
        }
    });

    return (
        <div>
            <h1>Pedidos Pendientes</h1>
            {/* <Form.Select value={filtroEstado} onChange={handleEstadoFiltroChange}>
                <option value="">Todos los estados</option>
                <option value={EstadoPedido.A_CONFIRMAR.descripcion}>A confirmar</option>
                <option value={EstadoPedido.EN_COCINA.descripcion}>En cocina</option>
                <option value={EstadoPedido.LISTO.descripcion}>Listo</option>
                <option value={EstadoPedido.EN_DELIVERY.descripcion}>En delivery</option>
                <option value={EstadoPedido.ENTREGADO.descripcion}>Entregado</option>
            </Form.Select> */}
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Número de Pedido</th>
                        <th>Hora Estimada de Fin</th>
                        <th>Fecha del Pedido</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredPedidos.map(pedido => (
                        <tr key={pedido.idPedido}>
                            <td>{pedido.numeroPedido}</td>
                            <td>{pedido.horaEstimadaFin ? new Date(pedido.horaEstimadaFin).toLocaleTimeString() : ""}</td>
                            <td>{new Date(pedido.fechaPedido).toLocaleDateString()}</td>
                            <td>{pedido.EstadoPedido.descripcion}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default CajeroPage;
