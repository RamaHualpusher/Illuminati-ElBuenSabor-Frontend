import React, { useEffect, useState } from "react";
import { Container, Row, Col } from 'react-bootstrap';
import { Usuario } from "../../interface/Usuario";
import { TablaGeneric } from "../TableGeneric/TableGeneric";

const RankingClientes = () => {
    const [clientes, setClientes] = useState<Usuario[]>([]);
    const [addModalShow, setAddModalShow] = useState(false);
    
    const columns = [
        { label: "ID", width: 100 },
        { label: "Nombre", width: 150 },
        { label: "Apellido", width: 150 },
        { label: "Telefono", width: 150 },//Aca deberia ir la cantidad de pedidos hechos
    ];

    useEffect(() => {
        const API_URL = "";//Poner la url correspondiente
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

    const data = clientes.map((cliente) => [
        cliente.idUsuario.toString(),
        cliente.nombre,
        cliente.apellido,
        cliente.telefono, //cambiar esto por cantidad de pedidos
    ]);
    const defaultAct= (data:any)=>{};
    return (
        <div>
            <Container fluid>
                <Row className="mt-3">
                    <Col>
                        <h1>Ranking de Clientes</h1>
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col>
                        <TablaGeneric columns={columns} data={data} showButton={false} buttonAdd={handleAddModalClose} buttonEdit={defaultAct} buttonDelete={defaultAct}/>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default RankingClientes;
