import React, { useEffect, useState } from "react";
import { Container, Row, Col } from 'react-bootstrap';
import { Usuario } from "../../../interface/Usuario";
import { Column } from "../../../interface/CamposTablaGenerica";
import GenericTable from "../../GenericTable/GenericTable";

const RankingVentas = () => {
    const [clientes, setClientes] = useState<Usuario[]>([]);
    const [addModalShow, setAddModalShow] = useState(false);

    const columns: Column<Usuario>[] = [
        { title: "ID", field: "idUsuario", width: 2 },
        { title: "Nombre", field: "nombre", width: 3 },
        { title: "Apellido", field: "apellido", width: 3 },
        { title: "Cantidad de Pedidos", field: "telefono", width: 2 },
    ];

    useEffect(() => {
        const API_URL = "assets/data/clienteTabla.json"; // Poner la URL correspondiente
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
                        <GenericTable<Usuario>
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
