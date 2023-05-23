import React, { useState, useEffect } from "react";
import { Usuario } from "../../../interface/Usuario";
import { Rol } from "../../../interface/Rol";
import { Domicilio } from "../../../interface/Domicilio";
import { TablaGeneric } from "../../TableGeneric/TableGeneric";
import { Container, Row, Col, Button } from 'react-bootstrap';
import Buscador from "../../Buscador/Buscador";
import EditClienteModal from "./EditClienteModal";
import AddClienteModal from "./AddClienteModal";

const Clientes = () => {
    const [clientes, setClientes] = useState<Usuario[]>([]);
    const [clientesComplete, setClientesComplete] = useState<Usuario[]>([]);
    const [editModalShow, setEditModalShow] = useState(false);
    const [addModalShow, setAddModalShow] = useState(false);
    const [selectedCliente, setSelectedCliente] = useState<Usuario | null>(null);

    const columns = [
        { label: "idCliente", width: 100 },
        { label: "Nombre", width: 200 },
        { label: "Apellido", width: 200 },
        { label: "Email", width: 200 },
        { label: "Telefono", width: 200 },
        { label: "Rol", width: 150 },
        { label: "Domicilio", width: 200 },
    ];

    const data = clientes.map((item) => [
        item.idUsuario.toString(),
        item.nombre.toString(),
        item.apellido.toString(),
        item.email.toString(),
        item.telefono.toString(),
        item.Rol.nombreRol.toString(),
        `${item.Domicilio.calle}, ${item.Domicilio.numero}, ${item.Domicilio.localidad}`,
    ]);

    const API_URL = "assets/data/clienteTabla.json";

    useEffect(() => {
        fetch(API_URL)
            .then((response) => response.json())
            .then((data) => {
                setClientes(data);
                setClientesComplete(data);
            })
            .catch((error) => console.log(error));
    }, []);

    const filter = (searchParam: string) => {
        const searchResult = clientesComplete.filter((clienteVal: Usuario) => {
            if (
                clienteVal.idUsuario.toString().toLowerCase().includes(searchParam.toLowerCase()) ||
                clienteVal.nombre.toString().toLowerCase().includes(searchParam.toLowerCase()) ||
                clienteVal.apellido.toString().toLowerCase().includes(searchParam.toLowerCase()) ||
                clienteVal.email.toString().toLowerCase().includes(searchParam.toLowerCase()) ||
                clienteVal.telefono.toString().toLowerCase().includes(searchParam.toLowerCase()) ||
                clienteVal.Rol.nombreRol.toString().toLowerCase().includes(searchParam.toLowerCase()) ||
                `${clienteVal.Domicilio.calle}, ${clienteVal.Domicilio.numero}, ${clienteVal.Domicilio.localidad}`.toLowerCase().includes(searchParam.toLowerCase())
            ) {
                return clienteVal;
            }
            return null;
        });
        setClientes(searchResult);
    };

    const handleSearch = (searchParam: string) => {
        filter(searchParam);
    };

    const handleClienteRequest = async (method: string, endpoint: string, body?: object) => {
        try {
            const response = await fetch(endpoint, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                throw new Error('Error al realizar la solicitud');
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleClienteAdd = async (cliente: Usuario) => {
        const newCliente = await handleClienteRequest('POST', API_URL, cliente);
        if (newCliente) {
            setClientes([...clientes, newCliente]);
        }
    };

    const handleClienteEdit = async (cliente: Usuario) => {
        const updatedCliente = await handleClienteRequest(
            'PUT',
            `${API_URL}/${cliente.idUsuario}`,
            cliente
        );
        if (updatedCliente) {
            const newData = clientes.map((item) =>
                item.idUsuario === cliente.idUsuario ? updatedCliente : item
            );
            setClientes(newData);
        }
    };

    const handleClienteDelete = async (rowData: string[], e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const cliente: Usuario = {
            idUsuario: +rowData[0],
            nombre: rowData[1],
            apellido: rowData[2],
            email: rowData[3],
            clave: '',
            telefono: rowData[4],
            Rol: { idRol: parseInt(rowData[5]), nombreRol: '' },
            Domicilio: {
                idDomicilio: 0,
                calle: '',
                numero: 0,
                localidad: '',
            },
        };

        try {
            await handleClienteRequest('DELETE', `${API_URL}/${cliente.idUsuario}`);
            setClientes(clientes.filter((item) => item.idUsuario !== cliente.idUsuario));
        } catch (error) {
            console.log(error);
        }
    };

    const handleAddModalOpen = () => {
        setAddModalShow(true);
    };

    const handleAddModalClose = () => {
        setAddModalShow(false);
    };

    const handleEditModalOpen = (rowData: string[], e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const selectedCliente: Usuario = {
            idUsuario: +rowData[0],
            nombre: rowData[1],
            apellido: rowData[2],
            email: rowData[3],
            clave: '',
            telefono: rowData[4],
            Rol: { idRol: parseInt(rowData[5]), nombreRol: '' },
            Domicilio: {
                idDomicilio: 0,
                calle: '',
                numero: 0,
                localidad: '',
            },
        };
        setSelectedCliente(selectedCliente);
        setEditModalShow(true);
    };

    const handleEditModalClose = () => {
        setEditModalShow(false);
        setSelectedCliente(null);
    };

    return (
        <div>
            <Container fluid>
                <Row className="mt-3">
                    <Col sm={10}>
                        <h1>Buscar Cliente</h1>
                        <Buscador onSearch={handleSearch} />
                    </Col>
                    <Row className="mb-3">
                        <Col className="d-flex justify-content-start">
                            <Button variant="primary" onClick={handleAddModalOpen}>
                                Agregar Cliente
                            </Button>
                        </Col>
                    </Row>
                </Row>
                <Row className="mt-3">
                    <Col>
                        <TablaGeneric columns={columns} data={data} showButton={true}
                            buttonEdit={handleEditModalOpen} buttonDelete={handleClienteDelete} />
                    </Col>
                </Row>
                <AddClienteModal
                    show={addModalShow}
                    handleClose={handleAddModalClose}
                    handleClienteAdd={handleClienteAdd} />

                <EditClienteModal
                    show={editModalShow}
                    handleClose={handleEditModalClose}
                    handleClienteEdit={handleClienteEdit}
                    selectedCliente={selectedCliente} />
            </Container>
        </div>
    );
};

export default Clientes;

