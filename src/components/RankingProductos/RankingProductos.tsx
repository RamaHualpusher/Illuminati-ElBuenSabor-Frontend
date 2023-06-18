import React, { useEffect, useState } from "react";
import { Container, Row, Col } from 'react-bootstrap';
import { Producto } from "../../interface/Producto";
import { TablaGeneric } from "../TableGeneric/TableGeneric";

const RankingProductos = () => {
    const [productos, setProductos] = useState<Producto[]>([]);

    useEffect(() => {
        const API_URL = ""; //Poner la url correspondiente
        fetch(API_URL)
            .then((response) => response.json())
            .then((data) => {
                setProductos(data);
            })
            .catch((error) => console.log(error));
    }, []);

    const columns = [
        { label: "ID", width: 100 },
        { label: "Nombre", width: 150 },
        { label: "Descripción", width: 200 },
        { label: "Nombre", width: 150 },//cambiar esto por cantidad vendido
    ];

    const data = productos.map((producto) => [
        producto.idProducto.toString(),
        producto.nombre,
        producto.denominacion,
        producto.nombre.toString(), //cambiar esto por cantidad vendido
    ]);
    const defaultAct = (data: any) => { };

    return (
        <div>
            <Container fluid>
                <Row className="mt-3">
                    <Col>
                        <h1>Ranking de Productos</h1>
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col>
                        <TablaGeneric columns={columns} data={data} showButton={false} buttonEdit={defaultAct} buttonDelete={defaultAct} />
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default RankingProductos;
