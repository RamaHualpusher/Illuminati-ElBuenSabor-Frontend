import React, { useEffect, useState } from "react";
import { Container, Row, Col } from 'react-bootstrap';
import { IUsuario } from "../../../interface/IUsuario";
import { IColumn } from "../../../interface/ICamposTablaGenerica";
import GenericTable from "../../GenericTable/GenericTable";

const RankingVentas = () => {
    const [clientes, setClientes] = useState<IUsuario[]>([]);
    const [addModalShow, setAddModalShow] = useState(false);

    const columns: IColumn<IUsuario>[] = [
        { title: "ID", field: "id", width: 2 },
        { title: "Nombre", field: "nombre", width: 3 },
        { title: "Apellido", field: "apellido", width: 3 },
        {
          title: "Cantidad de Pedidos", field: "telefono", width: 2,
          render: (rowData) =>
            <div>{calculateCantidadPedidosPorCliente(rowData.id)}</div>
        },
      ];

      const calculateCantidadPedidosPorCliente = (clienteId: number | undefined) => {
        return clientes.filter((cliente) => cliente.id === clienteId).length;
      };
      
    useEffect(() => {
        const API_URL = "assets/data/pedidos.json"; // Poner la URL correspondiente
        fetch(API_URL)
            .then((response) => response.json())
            .then((data) => {
                setClientes(data);
            })
            .catch((error) => console.log(error));
    }, []);

    const handleAddModalOpen = () => {
        setAddModalShow(true);
    };

    const handleAddModalClose = () => {
        setAddModalShow(false);
    };

    return (
        <div>
            <Container fluid>
                <Row className="mt-3">
                    <Col>
                        <GenericTable<IUsuario>
                            columns={columns}
                            data={clientes}
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

export default RankingVentas;
